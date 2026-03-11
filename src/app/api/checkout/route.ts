// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import directoryData from '@/lib/directory_data.json';

export async function POST(req: Request) {
  try {
    const { slug, planType } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    // Attempt to get dynamic price from directory data
    const business = (directoryData as any)[slug];
    let amount = 9900; // Default 99$
    let description = `Audit de conformité Loi 96 pour ${slug}`;

    if (business && business.remediationPrice) {
      const priceStr = business.remediationPrice.price.replace('$', '');
      amount = parseInt(priceStr) * 100;
      description = business.remediationPrice.fr_desc || description;
    } else if (planType === 'SENTINELLE') {
      amount = 29900;
    } else if (planType === 'FORTERESSE') {
      amount = 99900;
    }

    console.log(`[ZYEUTE_BILLING]: Initializing checkout for ${slug}, Amount: ${amount}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `Zyeuté - ${business?.remediationPrice?.tier || 'Audit Standard'}`,
              description: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/audit/success?session_id={CHECKOUT_SESSION_ID}&slug=${slug}`,
      cancel_url: `${req.headers.get('origin')}/directory?slug=${slug}&canceled=true`,
      metadata: {
        slug,
        tier: business?.remediationPrice?.tier || 'STANDARD',
      },
    });

    return NextResponse.json({ 
      url: session.url,
      status: 'INITIALIZED',
      id: session.id
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout initialization failed';
    console.error('[ZYEUTE_BILLING_ERROR]:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
