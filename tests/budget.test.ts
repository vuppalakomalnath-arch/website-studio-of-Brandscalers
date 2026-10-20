import { describe, it, expect } from 'vitest';
import {
  UsageLedger,
  OverBudgetError,
  MAX_INITIAL_BUILD_CREDITS,
} from '../src/engine/generation/budget';

describe('Suite 2: Credit Budget Ledger & 250-Credit Guard', () => {
  it('enforces the 250-credit hard ceiling and blocks over-budget requests', () => {
    const ledger = new UsageLedger(250);
    expect(ledger.getHardCap()).toBe(250);

    // Initial reservation of 100 credits passes
    const entry1 = ledger.reserve('plan_sitemap', 'gemini-3', 100);
    expect(entry1).toBeDefined();
    expect(ledger.getEstimatedSpent()).toBe(100);

    // Second reservation of 120 credits passes (100 + 120 = 220 <= 250)
    const entry2 = ledger.reserve('generate_sections', 'gemini-3.1-flash-lite', 120);
    expect(entry2).toBeDefined();
    expect(ledger.getEstimatedSpent()).toBe(220);

    // Third reservation of 50 credits would total 270 > 250 -> MUST BE BLOCKED BEFORE CALL
    expect(() => {
      ledger.reserve('generate_extra', 'gemini-3.1-flash-lite', 50);
    }).toThrow(OverBudgetError);

    // Verify rejection entry recorded with rejected_over_budget
    const entries = ledger.getAllEntries();
    const rejected = entries.find((e) => e.status === 'rejected_over_budget');
    expect(rejected).toBeDefined();
    expect(rejected?.actualCredits).toBe(0);
  });

  it('charges 0 credits when a model call fails (transactional safety)', () => {
    const ledger = new UsageLedger(250);
    const entryId = ledger.reserve('flaky_call', 'gemini-3.1-flash-lite', 80);

    // Simulate failure
    ledger.recordFailure(entryId, 'Network timeout / 500 error');

    const entry = ledger.getAllEntries().find((e) => e.id === entryId);
    expect(entry?.status).toBe('failed');
    expect(entry?.actualCredits).toBe(0);

    // Committed credits should be 0
    expect(ledger.commit()).toBe(0);
  });

  it('correctly calculates and commits credits on successful generation', () => {
    const ledger = new UsageLedger(250);
    const entryId = ledger.reserve('build_site', 'gemini-3', 150);

    // Record success with 6000 tokens
    ledger.recordSuccess(entryId, {
      promptTokens: 2000,
      candidatesTokens: 4000,
      totalTokens: 6000,
    });

    const entry = ledger.getAllEntries().find((e) => e.id === entryId);
    expect(entry?.status).toBe('success');
    expect(entry?.actualCredits).toBe(80); // 6000 / 75 = 80 credits

    // Before commit, committed credits is 0
    expect(ledger.getCommittedCredits()).toBe(0);

    // After commit, returns 80
    expect(ledger.commit()).toBe(80);
    expect(ledger.getCommittedCredits()).toBe(80);
  });
});
