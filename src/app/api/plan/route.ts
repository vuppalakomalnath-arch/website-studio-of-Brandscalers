import { NextRequest, NextResponse } from 'next/server';
import { BusinessProfileSchema } from '@/engine/schemas/business-profile';
import { GeminiProvider } from '@/engine/generation/gemini-provider';
import { FixtureProvider } from '@/engine/generation/fixture-provider';
import { UsageLedger } from '@/engine/generation/budget';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile = BusinessProfileSchema.parse(body.profile || body);

    const ledger = new UsageLedger(250);
    const gemini = new GeminiProvider();
    const provider = gemini.isAvailable ? gemini : new FixtureProvider();

    const plan = await provider.generatePlan(profile, ledger);

    return NextResponse.json({
      success: true,
      plan,
      isMocked: !gemini.isAvailable,
      estimatedCredits: ledger.getEstimatedSpent(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Planning failed',
      },
      { status: 400 }
    );
  }
}
