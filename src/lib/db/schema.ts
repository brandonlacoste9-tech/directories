// src/lib/db/schema.ts
// Drizzle ORM schema for Répertoire Loi 96 — Neon Postgres
import { pgTable, text, boolean, integer, jsonb, serial, timestamp, date } from 'drizzle-orm/pg-core';

// ─── Core business registry ────────────────────────────────────────────────
export const businesses = pgTable('businesses', {
  id:                      text('id').primaryKey(),
  name:                    text('name').notNull(),
  category:                text('category').notNull(),
  slug:                    text('slug').notNull().unique(),
  isVerified:              boolean('is_verified').notNull().default(false),
  neq:                     text('neq'),
  loc:                     text('loc'),
  auditDate:               date('audit_date'),
  riskLevel:               text('risk_level').notNull().default('MODERATE'),
  riskScore:               integer('risk_score').notNull().default(0),
  violations:              jsonb('violations').notNull().default([]),
  domain:                  text('domain'),
  // Remediation package
  remediationTier:         text('remediation_tier'),
  remediationPrice:        text('remediation_price'),
  remediationFrDesc:       text('remediation_fr_desc'),
  remediationComplexity:   text('remediation_complexity'),
  remediationEstimatedTime:text('remediation_estimated_time'),
  remediationStatus:       text('remediation_status').default('PENDING'),
  remediationPaidAt:       timestamp('remediation_paid_at', { withTimezone: true }),
  // Outreach tracking
  isOutreachSent:          boolean('is_outreach_sent').notNull().default(false),
  outreachDate:            date('outreach_date'),
  // Timestamps
  createdAt:               timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:               timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Swarm telemetry log ───────────────────────────────────────────────────
export const swarmEvents = pgTable('swarm_events', {
  id:          serial('id').primaryKey(),
  eventType:   text('event_type').notNull(),
  targetSlug:  text('target_slug'),
  targetName:  text('target_name'),
  action:      text('action').notNull(),
  metadata:    jsonb('metadata').default({}),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Outreach communication log ────────────────────────────────────────────
export const outreachLog = pgTable('outreach_log', {
  id:                  serial('id').primaryKey(),
  businessSlug:        text('business_slug').notNull().references(() => businesses.slug),
  emailType:           text('email_type').notNull(),
  status:              text('status').notNull().default('SENT'),
  sentAt:              timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
  responseReceivedAt:  timestamp('response_received_at', { withTimezone: true }),
  responseContent:     text('response_content'),
});

// ─── Inferred types ────────────────────────────────────────────────────────
export type Business     = typeof businesses.$inferSelect;
export type NewBusiness  = typeof businesses.$inferInsert;
export type SwarmEvent   = typeof swarmEvents.$inferSelect;
export type OutreachLog  = typeof outreachLog.$inferSelect;
