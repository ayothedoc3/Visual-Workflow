-- ============================================
-- E8Matrix Visual Workflow Builder
-- 3-Layer System Database Migration
-- ============================================

-- Create ENUMs first
DO $$ BEGIN
    CREATE TYPE status AS ENUM ('not-started', 'on-track', 'in-progress', 'at-risk', 'blocked', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('not-started', 'in-progress', 'blocked', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE blocker_type AS ENUM ('waiting-on-person', 'missing-resource', 'external-dependency', 'technical-issue', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE blocker_status AS ENUM ('active', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resource_type AS ENUM ('tool', 'document', 'person', 'budget', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resource_status AS ENUM ('available', 'requested', 'unavailable');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- LAYER 1: CAMPAIGNS (STRATEGIC VIEW)
-- ============================================

CREATE TABLE IF NOT EXISTS wf_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,

    -- Strategic canvas data (3-5 high-level nodes)
    strategic_nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    strategic_edges JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Overall status and progress
    overall_status status NOT NULL DEFAULT 'not-started',

    -- Timeline
    start_date DATE,
    target_date DATE,
    actual_completion_date DATE,

    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID
);

-- ============================================
-- LAYER 2: PLAYBOOKS (TACTICAL VIEW)
-- ============================================

CREATE TABLE IF NOT EXISTS wf_playbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,

    -- Parent campaign reference
    parent_campaign_id UUID NOT NULL REFERENCES wf_campaigns(id) ON DELETE CASCADE,
    parent_node_id VARCHAR(100), -- Which strategic node this links to

    -- Workflow canvas data (10-50 detailed nodes)
    workflow_nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    workflow_edges JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Status tracking
    overall_status status NOT NULL DEFAULT 'not-started',
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID
);

-- ============================================
-- LAYER 3: EXECUTIONS (OPERATIONAL VIEW)
-- ============================================

CREATE TABLE IF NOT EXISTS wf_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,

    -- Parent playbook reference
    parent_playbook_id UUID NOT NULL REFERENCES wf_playbooks(id) ON DELETE CASCADE,
    parent_node_id VARCHAR(100), -- Which workflow node this links to

    -- Status and progress
    status task_status NOT NULL DEFAULT 'not-started',
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

    -- Ownership
    primary_assignee VARCHAR(100),
    team_members TEXT[],

    -- Timeline
    start_date DATE,
    due_date DATE,
    completed_date DATE,
    estimated_hours INTEGER,
    actual_hours INTEGER,

    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wf_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES wf_executions(id) ON DELETE CASCADE,

    description TEXT NOT NULL,
    status task_status NOT NULL DEFAULT 'not-started',

    -- Assignment
    assignee VARCHAR(100),
    due_date DATE,
    completed_date DATE,

    -- Dependencies
    depends_on TEXT[],
    blocks TEXT[],

    -- Priority
    priority priority NOT NULL DEFAULT 'medium',

    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wf_blockers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES wf_executions(id) ON DELETE CASCADE,
    task_id UUID REFERENCES wf_tasks(id) ON DELETE CASCADE,

    description TEXT NOT NULL,
    blocker_type blocker_type NOT NULL,
    status blocker_status NOT NULL DEFAULT 'active',

    reported_by VARCHAR(100) NOT NULL,
    assigned_to VARCHAR(100),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wf_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES wf_executions(id) ON DELETE CASCADE,

    name VARCHAR(200) NOT NULL,
    type resource_type NOT NULL,
    status resource_status NOT NULL DEFAULT 'available',

    url TEXT,
    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_playbooks_campaign ON wf_playbooks(parent_campaign_id);
CREATE INDEX IF NOT EXISTS idx_executions_playbook ON wf_executions(parent_playbook_id);
CREATE INDEX IF NOT EXISTS idx_tasks_execution ON wf_tasks(execution_id);
CREATE INDEX IF NOT EXISTS idx_blockers_execution ON wf_blockers(execution_id);
CREATE INDEX IF NOT EXISTS idx_blockers_task ON wf_blockers(task_id);
CREATE INDEX IF NOT EXISTS idx_resources_execution ON wf_resources(execution_id);

-- Active blockers query optimization
CREATE INDEX IF NOT EXISTS idx_blockers_status ON wf_blockers(status) WHERE status = 'active';

-- Updated timestamp indexes for sorting
CREATE INDEX IF NOT EXISTS idx_campaigns_updated ON wf_campaigns(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_playbooks_updated ON wf_playbooks(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_executions_updated ON wf_executions(updated_at DESC);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
