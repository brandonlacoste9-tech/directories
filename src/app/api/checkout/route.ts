// src/app/api/checkout/route.ts
// Edge-compatible Stripe Checkout initializer
// Reads business data from Neon Postgres via Drizzle (replaces flat-file JSON)
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getBusinessBySlug } from '@/lib/db/queries';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { slug, planType } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    // Fetch live data from Neon — no stale JSON reads
    const business = await getBusinessBySlug(slug);

    let amount = 9900; // Default $99 CAD
    let description = `Audit de conformité Loi 96 pour ${slug}`;

    if (business?.remediationPrice) {
      const priceStr = business.remediationPrice.replace('$', '').replace(',', '');
      amount = parseInt(priceStr) * 100;
      description = business.remediationFrDesc ?? description;
    } else if (planType === 'SENTINELLE') {
      amount = 29900;
    } else if (planType === 'FORTERESSE') {
      amount = 99900;
    }

    console.log(`[LOI96_BILLING]: Initializing checkout for ${slug}, Amount: ${amount}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `Répertoire Loi 96 — ${business?.remediationTier ?? 'Audit Standard'}`,
              description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${new URL(req.url).origin}/audit/success?session_id={CHECKOUT_SESSION_ID}&slug=${slug}`,
      cancel_url:  `${new URL(req.url).origin}/directory?slug=${slug}&canceled=true`,
      metadata: {
        slug,
        tier: business?.remediationTier ?? 'STANDARD',
      },
    });

    return NextResponse.json({
      url:    session.url,
      status: 'INITIALIZED',
      id:     session.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout initialization failed';
    console.error('[LOI96_BILLING_ERROR]:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
