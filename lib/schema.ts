import { pgTable, uuid, varchar, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Enum for node types
export const nodeTypeEnum = pgEnum('node_type', ['issue', 'action', 'resource', 'deliverable']);

// Templates table
export const templates = pgTable('templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  nodeType: nodeTypeEnum('node_type').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  tags: text('tags').array(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by'),
});

// Workflows table
export const workflows = pgTable('workflows', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  thumbnail: text('thumbnail'),
  nodes: jsonb('nodes').notNull(),
  edges: jsonb('edges').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by'),
});

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Node type enum
export type NodeType = 'issue' | 'action' | 'resource' | 'deliverable';

// TypeScript types with proper nodeType
type TemplateBase = typeof templates.$inferSelect;
type NewTemplateBase = typeof templates.$inferInsert;

export type Template = Omit<TemplateBase, 'nodeType'> & { nodeType: NodeType };
export type NewTemplate = Omit<NewTemplateBase, 'nodeType'> & { nodeType: NodeType };
export type Workflow = typeof workflows.$inferSelect;
export type NewWorkflow = typeof workflows.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
