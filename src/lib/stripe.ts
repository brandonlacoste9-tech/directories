import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build'; // Fallback for build time

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-11' as any, // Pin version or use latest
  appInfo: {
    name: 'Zyeute Compliance',
    version: '1.0.0',
  },
});
