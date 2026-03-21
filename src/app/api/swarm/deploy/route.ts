// src/app/api/swarm/deploy/route.ts
// Swarm deployment endpoint — receives events from the Python orchestrator
// and persists them to Neon for real-time dashboard telemetry
import { NextResponse } from 'next/server';
import { logSwarmEvent, upsertBusiness } from '@/lib/db/queries';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { sector, slug, action, eventType, businessData } = await req.json().catch(() => ({}));
    const searchParams = new URL(req.url).searchParams;

    const resolvedSector = sector ?? searchParams.get('sector') ?? 'UNKNOWN';
    const resolvedSlug   = slug   ?? searchParams.get('slug')   ?? undefined;
    const resolvedAction = action ?? `SWARM_DEPLOY:${resolvedSector}`;
    const resolvedEvent  = eventType ?? 'SWARM_ACTION';

    // Log to swarm telemetry
    await logSwarmEvent(resolvedEvent, resolvedAction, resolvedSlug, undefined, {
      sector: resolvedSector,
    });

    // If the orchestrator is pushing a new/updated business record, upsert it
    if (businessData && resolvedSlug) {
      await upsertBusiness({
        id:             businessData.id ?? `LOI96-${Date.now()}`,
        name:           businessData.name ?? resolvedSlug,
        category:       businessData.category ?? 'SERVICES',
        slug:           resolvedSlug,
        riskLevel:      businessData.riskLevel ?? 'MODERATE',
        riskScore:      businessData.riskScore ?? 0,
        violations:     businessData.violations ?? [],
        domain:         businessData.domain,
        isOutreachSent: businessData.isOutreachSent ?? false,
        outreachDate:   businessData.outreachDate,
        remediationTier:         businessData.remediationTier,
        remediationPrice:        businessData.remediationPrice,
        remediationFrDesc:       businessData.remediationFrDesc,
        remediationComplexity:   businessData.remediationComplexity,
        remediationEstimatedTime:businessData.remediationEstimatedTime,
      });
    }

    return NextResponse.json({ status: 'LOGGED', sector: resolvedSector, slug: resolvedSlug });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Deploy endpoint error';
    console.error('[SWARM_DEPLOY_ERROR]:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
