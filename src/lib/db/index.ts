// src/lib/db/index.ts
// Neon serverless Postgres client with Drizzle ORM
// Uses HTTP-based driver for Edge/serverless compatibility
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('[LOI96_DB]: DATABASE_URL environment variable is not set.');
}

// Neon HTTP driver — Edge-compatible, no persistent connections
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });

export * from './schema';
