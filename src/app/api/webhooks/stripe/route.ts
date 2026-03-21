// src/app/api/webhooks/stripe/route.ts
// Stripe webhook handler — uses Neon Postgres for atomic updates (no fs writes)
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { markBusinessConforme, logSwarmEvent } from '@/lib/db/queries';

// NOTE: Cannot use `runtime = 'edge'` here because stripe.webhooks.constructEvent
// requires the raw body as a Buffer, which is only available in Node.js runtime.
export const runtime = 'nodejs';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;

  // DEV OVERRIDE: Allow simulation tests with a secret header
  const isSimulation = req.headers.get('x-gravityclaw-simulation') === 'LETHAL';

  try {
    if (isSimulation) {
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown webhook error';
    console.error(`[STRIPE_WEBHOOK_ERROR]: ${message}`);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const slug = session.metadata?.slug;

    if (slug) {
      console.log(`[STRIPE_WEBHOOK]: Payment confirmed for ${slug}. Triggering automation...`);

      try {
        // Atomic DB update — no race conditions, no fs writes
        await markBusinessConforme(slug);

        // Log the payment event to swarm telemetry
        await logSwarmEvent(
          'PAYMENT_CONFIRMED',
          'MARK_CONFORME',
          slug,
          session.metadata?.tier,
          {
            stripeSessionId: session.id,
            amountTotal:     session.amount_total,
            currency:        session.currency,
          }
        );

        // Trigger post-payment validation via orchestrator (fire-and-forget)
        triggerValidationAudit(slug).catch((e: Error) =>
          console.log(`[AUTOMATION_INFO]: Orchestrator deferred — ${e.message}`)
        );
      } catch (error) {
        console.error(`[STRIPE_WEBHOOK_ERROR]: Failed to process payment for ${slug}`, error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

/** Fire-and-forget: notify the local swarm orchestrator of a post-payment validation */
async function triggerValidationAudit(slug: string): Promise<void> {
  const port = process.env.OPENCLAW_PORT ?? '18789';
  const orchestratorUrl = `http://localhost:${port}/api/swarm/deploy`;

  await fetch(`${orchestratorUrl}?sector=PostPaymentValidation&slug=${slug}`, {
    method: 'POST',
    signal: AbortSignal.timeout(3000),
  });
}
