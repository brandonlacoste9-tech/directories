// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import fs from 'fs';
import path from 'path';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  // DEV OVERRIDE: Allow simulation tests with a secret header
  const isSimulation = req.headers.get('x-gravityclaw-simulation') === 'LETHAL';

  try {
    if (isSimulation) {
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
  } catch (err: any) {
    console.error(`[STRIPE_WEBHOOK_ERROR]: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const slug = session.metadata?.slug;

    if (slug) {
      console.log(`[STRIPE_WEBHOOK]: Payment confirmed for ${slug}. Triggering automation...`);
      
      try {
        await updateBusinessConformity(slug);
        // Trigger Post-Payment Automation (Simulated here, could be a fetch to orchestrator)
        await triggerValidationAudit(slug);
      } catch (error) {
         console.error(`[STRIPE_WEBHOOK_ERROR]: Failed to process payment for ${slug}`, error);
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function updateBusinessConformity(slug: string) {
  const dataPath = path.join(process.cwd(), 'src', 'lib', 'directory_data.json');
  const fileData = fs.readFileSync(dataPath, 'utf8');
  const directory = JSON.parse(fileData);

  if (directory[slug]) {
    directory[slug].isVerified = true;
    directory[slug].riskScore = 0;
    directory[slug].riskLevel = 'CONFORME';
    directory[slug].auditDate = new Date().toISOString().split('T')[0];
    
    // Maintain history of the remediation
    directory[slug].remediationPrice.status = 'PAID';
    directory[slug].remediationPrice.paid_at = new Date().toISOString();

    fs.writeFileSync(dataPath, JSON.stringify(directory, null, 2), 'utf8');
    console.log(`[DATABASE]: ${slug} updated to CONFORME status.`);
  }
}

async function triggerValidationAudit(slug: string) {
  // In a real production environment, this would hit the Orchestrator API 
  // or put a message on a queue for the Swarm to pick up.
  console.log(`[AUTOMATION]: Triggering final Validation Audit for ${slug}...`);
  try {
     const orchestratorUrl = 'http://localhost:8000/api/swarm/deploy';
     await fetch(`${orchestratorUrl}?sector=PostPaymentValidation&slug=${slug}`, {
       method: 'POST'
     });
  } catch (e) {
     console.log(`[AUTOMATION_INFO]: Orchestrator call deferred (likely running locally).`);
  }
}
