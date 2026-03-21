// src/lib/db/queries.ts
// Typed data access layer for Répertoire Loi 96
// All queries go through Drizzle → Neon Postgres (no more flat-file reads)
import { db, businesses, swarmEvents, outreachLog } from './index';
import { eq, desc, sql, and, or, ilike } from 'drizzle-orm';
import type { Business, NewBusiness } from './schema';

// ─── Directory Queries ─────────────────────────────────────────────────────

/** Fetch all businesses, ordered by risk score descending */
export async function getAllBusinesses(): Promise<Business[]> {
  return db
    .select()
    .from(businesses)
    .orderBy(desc(businesses.riskScore));
}

/** Fetch a single business by slug */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const results = await db
    .select()
    .from(businesses)
    .where(eq(businesses.slug, slug))
    .limit(1);
  return results[0] ?? null;
}

/** Fetch businesses by category */
export async function getBusinessesByCategory(category: string): Promise<Business[]> {
  return db
    .select()
    .from(businesses)
    .where(eq(businesses.category, category))
    .orderBy(desc(businesses.riskScore));
}

/** Full-text search across name and domain */
export async function searchBusinesses(query: string): Promise<Business[]> {
  return db
    .select()
    .from(businesses)
    .where(
      or(
        ilike(businesses.name, `%${query}%`),
        ilike(businesses.domain, `%${query}%`)
      )
    )
    .orderBy(desc(businesses.riskScore))
    .limit(50);
}

/** Get compliance statistics for the dashboard */
export async function getComplianceStats() {
  const stats = await db
    .select({
      total:        sql<number>`COUNT(*)`,
      verified:     sql<number>`COUNT(*) FILTER (WHERE is_verified = true)`,
      critical:     sql<number>`COUNT(*) FILTER (WHERE risk_level = 'CRITICAL')`,
      high:         sql<number>`COUNT(*) FILTER (WHERE risk_level = 'HIGH')`,
      moderate:     sql<number>`COUNT(*) FILTER (WHERE risk_level = 'MODERATE')`,
      outreachSent: sql<number>`COUNT(*) FILTER (WHERE is_outreach_sent = true)`,
      paid:         sql<number>`COUNT(*) FILTER (WHERE remediation_status = 'PAID')`,
    })
    .from(businesses);
  return stats[0];
}

// ─── Mutation Queries ──────────────────────────────────────────────────────

/** Mark a business as CONFORME after payment */
export async function markBusinessConforme(slug: string): Promise<void> {
  await db
    .update(businesses)
    .set({
      isVerified:       true,
      riskScore:        0,
      riskLevel:        'CONFORME',
      auditDate:        new Date().toISOString().split('T')[0],
      remediationStatus:'PAID',
      remediationPaidAt: new Date(),
      updatedAt:        new Date(),
    })
    .where(eq(businesses.slug, slug));
}

/** Upsert a business record (used by the swarm) */
export async function upsertBusiness(data: NewBusiness): Promise<void> {
  await db
    .insert(businesses)
    .values(data)
    .onConflictDoUpdate({
      target: businesses.slug,
      set: {
        riskLevel:       data.riskLevel,
        riskScore:       data.riskScore,
        violations:      data.violations,
        isOutreachSent:  data.isOutreachSent,
        outreachDate:    data.outreachDate,
        updatedAt:       new Date(),
      },
    });
}

// ─── Swarm Telemetry ───────────────────────────────────────────────────────

/** Log a swarm action to the telemetry table */
export async function logSwarmEvent(
  eventType: string,
  action: string,
  targetSlug?: string,
  targetName?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await db.insert(swarmEvents).values({
    eventType,
    action,
    targetSlug,
    targetName,
    metadata: metadata ?? {},
  });
}

/** Get the 20 most recent swarm events for the dashboard */
export async function getRecentSwarmEvents(limit = 20) {
  return db
    .select()
    .from(swarmEvents)
    .orderBy(desc(swarmEvents.createdAt))
    .limit(limit);
}

// ─── Outreach Log ──────────────────────────────────────────────────────────

/** Log an outreach email dispatch */
export async function logOutreach(
  businessSlug: string,
  emailType: string,
  status = 'SENT'
): Promise<void> {
  await db.insert(outreachLog).values({ businessSlug, emailType, status });
}
