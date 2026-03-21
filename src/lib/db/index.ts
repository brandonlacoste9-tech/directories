// src/lib/db/index.ts
// Neon serverless Postgres client with Drizzle ORM
// IMPORTANT: Lazy initialization — the client is only created on first use,
// NOT at module evaluation time. This prevents Vercel build failures when
// DATABASE_URL is not set during static page data collection.
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type Schema = typeof schema;

let _db: NeonHttpDatabase<Schema> | null = null;

function getDb(): NeonHttpDatabase<Schema> {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      '[LOI96_DB]: DATABASE_URL is not set. ' +
      'Add it to your Vercel project environment variables.'
    );
  }

  const sql: NeonQueryFunction<false, false> = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}

// Proxy that defers initialization until the first property access
export const db = new Proxy({} as NeonHttpDatabase<Schema>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

export * from './schema';
