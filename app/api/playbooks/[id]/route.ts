import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getDatabaseUrl } from '@/lib/db';

// GET /api/playbooks/[id] - Get single playbook with execution counts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const { id } = await params;

    const result = await sql`
      SELECT
        p.*,
        c.name as campaign_name,
        c.id as campaign_id,
        COUNT(e.id) as execution_count
      FROM wf_playbooks p
      LEFT JOIN wf_campaigns c ON c.id = p.parent_campaign_id
      LEFT JOIN wf_executions e ON e.parent_playbook_id = p.id
      WHERE p.id = ${id}
      GROUP BY p.id, c.name, c.id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Playbook not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching playbook:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playbook' },
      { status: 500 }
    );
  }
}

// PUT /api/playbooks/[id] - Update playbook
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      workflowNodes,
      workflowEdges,
      overallStatus,
      progress,
      parentNodeId
    } = body;

    const result = await sql`
      UPDATE wf_playbooks
      SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        workflow_nodes = COALESCE(${workflowNodes ? JSON.stringify(workflowNodes) : null}, workflow_nodes),
        workflow_edges = COALESCE(${workflowEdges ? JSON.stringify(workflowEdges) : null}, workflow_edges),
        overall_status = COALESCE(${overallStatus}, overall_status),
        progress = COALESCE(${progress}, progress),
        parent_node_id = COALESCE(${parentNodeId}, parent_node_id),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Playbook not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating playbook:', error);
    return NextResponse.json(
      { error: 'Failed to update playbook' },
      { status: 500 }
    );
  }
}

// DELETE /api/playbooks/[id] - Delete playbook (cascades to executions)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const { id } = await params;

    const result = await sql`
      DELETE FROM wf_playbooks
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Playbook not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting playbook:', error);
    return NextResponse.json(
      { error: 'Failed to delete playbook' },
      { status: 500 }
    );
  }
}
