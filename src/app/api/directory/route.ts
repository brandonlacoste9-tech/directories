// src/app/api/directory/route.ts
// Edge-optimized directory listing API
// Supports filtering by category, risk level, and full-text search
import { NextResponse } from 'next/server';
import { getAllBusinesses, getBusinessesByCategory, searchBusinesses, getComplianceStats } from '@/lib/db/queries';

export const runtime = 'edge';
export const revalidate = 30; // ISR: revalidate every 30 seconds

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const query    = searchParams.get('q');
    const statsOnly = searchParams.get('stats') === 'true';

    // Stats-only mode for dashboard widgets
    if (statsOnly) {
      const stats = await getComplianceStats();
      return NextResponse.json(stats, {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
      });
    }

    let businesses;
    if (query) {
      businesses = await searchBusinesses(query);
    } else if (category) {
      businesses = await getBusinessesByCategory(category.toUpperCase());
    } else {
      businesses = await getAllBusinesses();
    }

    return NextResponse.json(
      { businesses, total: businesses.length },
      {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Directory fetch failed';
    console.error('[DIRECTORY_API_ERROR]:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
