// src/app/api/swarm/status/route.ts
// Live swarm telemetry endpoint — reads from Neon swarm_events table
// Replaces the memory.json polling pattern with a real DB-backed API
import { NextResponse } from 'next/server';
import { getRecentSwarmEvents, getComplianceStats } from '@/lib/db/queries';

export const runtime = 'edge';
export const revalidate = 10; // ISR: revalidate every 10 seconds

export async function GET() {
  try {
    const [events, stats] = await Promise.all([
      getRecentSwarmEvents(20),
      getComplianceStats(),
    ]);

    // Map DB events to the format the /swarm UI expects
    const recentTasks = events.map((e) => ({
      time:   e.createdAt,
      action: e.action,
      target: e.targetSlug ?? e.targetName ?? 'UNKNOWN',
    }));

    // Derive active swarms from recent event types
    const activeSwarmTypes = [...new Set(events.map((e) => e.eventType))].slice(0, 5);

    return NextResponse.json({
      audits_completed: Number(stats?.verified ?? 0),
      total_tracked:    Number(stats?.total ?? 0),
      critical_count:   Number(stats?.critical ?? 0),
      high_count:       Number(stats?.high ?? 0),
      outreach_sent:    Number(stats?.outreachSent ?? 0),
      paid_count:       Number(stats?.paid ?? 0),
      recent_tasks:     recentTasks,
      active_swarms:    activeSwarmTypes,
      openclaw_link: {
        active:  false, // Updated by the Python orchestrator via /api/swarm/heartbeat
        version: 'Sentinelle-96 v2.0 / Neon-Backed',
      },
    });
  } catch (error) {
    console.error('[SWARM_STATUS_ERROR]:', error);
    return NextResponse.json({ error: 'Failed to fetch swarm status' }, { status: 500 });
  }
}
