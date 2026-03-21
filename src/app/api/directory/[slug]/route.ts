// src/app/api/directory/[slug]/route.ts
// Edge-optimized single business dossier endpoint
import { NextResponse } from 'next/server';
import { getBusinessBySlug } from '@/lib/db/queries';

export const runtime = 'edge';
export const revalidate = 60;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const business = await getBusinessBySlug(slug);

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json(business, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lookup failed';
    console.error('[DIRECTORY_SLUG_ERROR]:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
