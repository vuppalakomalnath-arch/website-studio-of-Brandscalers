import { NextRequest, NextResponse } from 'next/server';
import { generateWebsiteFromProfile } from '@/engine/generation/pipeline';
import { OverBudgetError } from '@/engine/generation/budget';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.profile) {
      return NextResponse.json(
        { success: false, error: 'Missing business profile in request body.' },
        { status: 400 }
      );
    }

    const result = await generateWebsiteFromProfile(body.profile);

    return NextResponse.json({
      success: true,
      document: result.document,
      plan: result.plan,
      ledger: result.ledger.getAllEntries(),
      isMocked: result.isMocked,
      warnings: result.warnings,
      actualCredits: result.document.generation.actualCredits,
    });
  } catch (err: any) {
    if (err instanceof OverBudgetError) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
          code: err.code,
          requestedCredits: err.requestedCredits,
          limit: err.limit,
        },
        { status: 402 } // Payment Required / Over Budget
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Generation pipeline failed',
        details: err?.issues || undefined,
      },
      { status: 500 }
    );
  }
}
