export const MAX_INITIAL_BUILD_CREDITS = 250;

export interface TokenUsage {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  estimatedCostUsd?: number;
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  task: string;
  model: string;
  estimatedCredits: number;
  actualCredits: number;
  estimatedCostUsd: number;
  latencyMs?: number;
  correlationId?: string;
  tokenUsage?: TokenUsage;
  status: 'pending' | 'success' | 'failed' | 'rejected_over_budget';
  error?: string;
}

export class OverBudgetError extends Error {
  public code = 'OVER_BUDGET_EXCEEDED';
  constructor(
    public requestedCredits: number,
    public currentSpent: number,
    public limit: number
  ) {
    super(`Generation blocked: estimated cost (${requestedCredits} credits) + current spent (${currentSpent} credits) exceeds hard cap (${limit} credits).`);
    this.name = 'OverBudgetError';
  }
}

export class UsageLedger {
  private entries: LedgerEntry[] = [];
  private hardCap: number = MAX_INITIAL_BUILD_CREDITS;
  private isCommitted: boolean = false;

  constructor(hardCap: number = MAX_INITIAL_BUILD_CREDITS) {
    this.hardCap = hardCap;
  }

  public getHardCap(): number {
    return this.hardCap;
  }

  public getCommittedCredits(): number {
    if (!this.isCommitted) return 0;
    return this.entries
      .filter((e) => e.status === 'success')
      .reduce((acc, curr) => acc + curr.actualCredits, 0);
  }

  public getEstimatedSpent(): number {
    return this.entries
      .filter((e) => e.status === 'pending' || e.status === 'success')
      .reduce((acc, curr) => acc + Math.max(curr.estimatedCredits, curr.actualCredits), 0);
  }

  public getAllEntries(): ReadonlyArray<LedgerEntry> {
    return [...this.entries];
  }

  /**
   * Pre-flight budget check before a model call.
   * If currentSpent + estimatedCredits > hardCap, throws OverBudgetError.
   */
  public reserve(task: string, model: string, estimatedCredits: number): string {
    const currentSpent = this.getEstimatedSpent();
    if (currentSpent + estimatedCredits > this.hardCap) {
      const entryId = `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      this.entries.push({
        id: entryId,
        timestamp: new Date().toISOString(),
        task,
        model,
        estimatedCredits,
        actualCredits: 0,
        estimatedCostUsd: 0,
        status: 'rejected_over_budget',
        error: `Exceeds budget cap of ${this.hardCap}`,
      });
      throw new OverBudgetError(estimatedCredits, currentSpent, this.hardCap);
    }

    const entryId = `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.entries.push({
      id: entryId,
      timestamp: new Date().toISOString(),
      task,
      model,
      estimatedCredits,
      actualCredits: 0,
      estimatedCostUsd: 0,
      status: 'pending',
    });
    return entryId;
  }

  /**
   * Record actual token usage and calibrate credits after successful call.
   */
  public recordSuccess(entryId: string, tokenUsage: TokenUsage, latencyMs?: number, correlationId?: string): void {
    const entry = this.entries.find((e) => e.id === entryId);
    if (!entry) return;

    // Credit formula: 1 credit per ~75 tokens + base transaction cost
    const calculatedCredits = Math.max(1, Math.round(tokenUsage.totalTokens / 75));
    // Official Gemini 3.5 Flash Lite pricing: $0.075 / 1M prompt, $0.30 / 1M candidate
    const promptCost = (tokenUsage.promptTokens / 1_000_000) * 0.075;
    const candidateCost = (tokenUsage.candidatesTokens / 1_000_000) * 0.30;
    const costUsd = Number((promptCost + candidateCost).toFixed(6));

    entry.actualCredits = calculatedCredits;
    entry.estimatedCostUsd = costUsd;
    tokenUsage.estimatedCostUsd = costUsd;
    entry.tokenUsage = tokenUsage;
    entry.latencyMs = latencyMs;
    entry.correlationId = correlationId;
    entry.status = 'success';
  }

  /**
   * Transactional rule: Failed calls debit 0 credits.
   */
  public recordFailure(entryId: string, error: string): void {
    const entry = this.entries.find((e) => e.id === entryId);
    if (!entry) return;

    entry.actualCredits = 0;
    entry.estimatedCostUsd = 0;
    entry.status = 'failed';
    entry.error = error;
  }

  /**
   * Returns total estimated provider USD cost across successful calls.
   */
  public getTotalEstimatedUsdCost(): number {
    const total = this.entries
      .filter((e) => e.status === 'success')
      .reduce((acc, curr) => acc + curr.estimatedCostUsd, 0);
    return Number(total.toFixed(6));
  }

  /**
   * Commit generation charge only after full site is validated.
   */
  public commit(): number {
    this.isCommitted = true;
    return this.getCommittedCredits();
  }
}
