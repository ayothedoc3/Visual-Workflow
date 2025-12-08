import { pgTable, uuid, varchar, text, timestamp, jsonb, pgEnum, integer, date } from 'drizzle-orm/pg-core';

// ============================================
// ENUMS
// ============================================

// Enum for node types
export const nodeTypeEnum = pgEnum('node_type', ['issue', 'action', 'resource', 'deliverable']);

// Enum for campaign/playbook status
export const statusEnum = pgEnum('status', ['not-started', 'on-track', 'in-progress', 'at-risk', 'blocked', 'completed']);

// Enum for task status
export const taskStatusEnum = pgEnum('task_status', ['not-started', 'in-progress', 'blocked', 'completed']);

// Enum for priority
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);

// Enum for blocker type
export const blockerTypeEnum = pgEnum('blocker_type', [
  'waiting-on-person',
  'missing-resource',
  'external-dependency',
  'technical-issue',
  'other'
]);

// Enum for blocker status
export const blockerStatusEnum = pgEnum('blocker_status', ['active', 'resolved']);

// Enum for resource type
export const resourceTypeEnum = pgEnum('resource_type', ['tool', 'document', 'person', 'budget', 'other']);

// Enum for resource status
export const resourceStatusEnum = pgEnum('resource_status', ['available', 'requested', 'unavailable']);

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

// ============================================
// LAYER 1: CAMPAIGNS (STRATEGIC VIEW)
// ============================================

export const campaigns = pgTable('wf_campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),

  // Strategic canvas data (3-5 high-level nodes)
  strategicNodes: jsonb('strategic_nodes').notNull().default('[]'),
  strategicEdges: jsonb('strategic_edges').notNull().default('[]'),

  // Overall status and progress
  overallStatus: statusEnum('overall_status').notNull().default('not-started'),

  // Timeline
  startDate: date('start_date'),
  targetDate: date('target_date'),
  actualCompletionDate: date('actual_completion_date'),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by'),
});

// ============================================
// LAYER 2: PLAYBOOKS (TACTICAL VIEW)
// ============================================

export const playbooks = pgTable('wf_playbooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),

  // Parent campaign reference
  parentCampaignId: uuid('parent_campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  parentNodeId: varchar('parent_node_id', { length: 100 }), // Which strategic node this links to

  // Workflow canvas data (10-50 detailed nodes)
  workflowNodes: jsonb('workflow_nodes').notNull().default('[]'),
  workflowEdges: jsonb('workflow_edges').notNull().default('[]'),

  // Status tracking
  overallStatus: statusEnum('overall_status').notNull().default('not-started'),
  progress: integer('progress').notNull().default(0), // 0-100

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by'),
});

// ============================================
// LAYER 3: EXECUTIONS (OPERATIONAL VIEW)
// ============================================

export const executions = pgTable('wf_executions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),

  // Parent playbook reference
  parentPlaybookId: uuid('parent_playbook_id').notNull().references(() => playbooks.id, { onDelete: 'cascade' }),
  parentNodeId: varchar('parent_node_id', { length: 100 }), // Which workflow node this links to

  // Status and progress
  status: taskStatusEnum('status').notNull().default('not-started'),
  progress: integer('progress').notNull().default(0), // 0-100, calculated from tasks

  // Ownership
  primaryAssignee: varchar('primary_assignee', { length: 100 }),
  teamMembers: text('team_members').array().default([]),

  // Timeline
  startDate: date('start_date'),
  dueDate: date('due_date'),
  completedDate: date('completed_date'),
  estimatedHours: integer('estimated_hours'),
  actualHours: integer('actual_hours'),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tasks = pgTable('wf_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  executionId: uuid('execution_id').notNull().references(() => executions.id, { onDelete: 'cascade' }),

  description: text('description').notNull(),
  status: taskStatusEnum('status').notNull().default('not-started'),

  // Assignment
  assignee: varchar('assignee', { length: 100 }),
  dueDate: date('due_date'),
  completedDate: date('completed_date'),

  // Dependencies
  dependsOn: text('depends_on').array().default([]), // Array of task IDs
  blocks: text('blocks').array().default([]), // Array of task IDs

  // Priority
  priority: priorityEnum('priority').notNull().default('medium'),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blockers = pgTable('wf_blockers', {
  id: uuid('id').defaultRandom().primaryKey(),
  executionId: uuid('execution_id').notNull().references(() => executions.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }),

  description: text('description').notNull(),
  blockerType: blockerTypeEnum('blocker_type').notNull(),
  status: blockerStatusEnum('status').notNull().default('active'),

  reportedBy: varchar('reported_by', { length: 100 }).notNull(),
  assignedTo: varchar('assigned_to', { length: 100 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
});

export const resources = pgTable('wf_resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  executionId: uuid('execution_id').notNull().references(() => executions.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 200 }).notNull(),
  type: resourceTypeEnum('type').notNull(),
  status: resourceStatusEnum('status').notNull().default('available'),

  url: text('url'),
  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// TYPESCRIPT TYPES
// ============================================

// Node type enum
export type NodeType = 'issue' | 'action' | 'resource' | 'deliverable';

// Status types
export type CampaignStatus = 'not-started' | 'on-track' | 'at-risk' | 'blocked' | 'completed';
export type PlaybookStatus = 'not-started' | 'on-track' | 'at-risk' | 'blocked' | 'completed';
export type ExecutionStatus = 'not-started' | 'in-progress' | 'blocked' | 'completed';
export type TaskStatus = 'not-started' | 'in-progress' | 'blocked' | 'completed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type BlockerType = 'waiting-on-person' | 'missing-resource' | 'external-dependency' | 'technical-issue' | 'other';
export type BlockerStatus = 'active' | 'resolved';
export type ResourceType = 'tool' | 'document' | 'person' | 'budget' | 'other';
export type ResourceStatus = 'available' | 'requested' | 'unavailable';

// Strategic Node Structure (stored in JSONB)
export interface StrategicNode {
  id: string;
  type: 'campaign' | 'strategy' | 'result';
  label: string;
  description: string;
  position: { x: number; y: number };

  // Link to Layer 2
  linkedPlaybookId?: string;

  // Calculated from Layer 2
  overallProgress: number; // 0-100%
  status: ExecutionStatus;
}

// Workflow Node Structure (stored in JSONB)
export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  category: string;
  position: { x: number; y: number };

  // Link to Layer 3
  linkedExecutionId?: string;

  // Status (calculated from Layer 3 tasks)
  status: ExecutionStatus;
  progress: number; // 0-100%

  // High-level assignment
  primaryAssignee?: string;

  // Template reference
  templateId?: string;

  // Additional node data
  data?: any;
}

// Edge Structure (for both strategic and workflow)
export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
}

// TypeScript types with proper nodeType
type TemplateBase = typeof templates.$inferSelect;
type NewTemplateBase = typeof templates.$inferInsert;

export type Template = Omit<TemplateBase, 'nodeType'> & { nodeType: NodeType };
export type NewTemplate = Omit<NewTemplateBase, 'nodeType'> & { nodeType: NodeType };
export type Workflow = typeof workflows.$inferSelect;
export type NewWorkflow = typeof workflows.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Campaign types
export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

// Playbook types
export type Playbook = typeof playbooks.$inferSelect;
export type NewPlaybook = typeof playbooks.$inferInsert;

// Execution types
export type Execution = typeof executions.$inferSelect;
export type NewExecution = typeof executions.$inferInsert;

// Task types
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

// Blocker types
export type Blocker = typeof blockers.$inferSelect;
export type NewBlocker = typeof blockers.$inferInsert;

// Resource types
export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
