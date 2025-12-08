import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getDatabaseUrl } from '@/lib/db';

// GET /api/executions/[id] - Get single execution with all related data
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

    // Get execution with counts
    const executionResult = await sql`
      SELECT
        e.*,
        p.name as playbook_name,
        p.id as playbook_id,
        p.parent_campaign_id as campaign_id
      FROM wf_executions e
      LEFT JOIN wf_playbooks p ON p.id = e.parent_playbook_id
      WHERE e.id = ${id}
    `;

    if (executionResult.length === 0) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      );
    }

    const execution = executionResult[0];

    // Get tasks
    const tasks = await sql`
      SELECT *
      FROM wf_tasks
      WHERE execution_id = ${id}
      ORDER BY created_at ASC
    `;

    // Get blockers
    const blockers = await sql`
      SELECT *
      FROM wf_blockers
      WHERE execution_id = ${id}
      ORDER BY created_at DESC
    `;

    // Get resources
    const resources = await sql`
      SELECT *
      FROM wf_resources
      WHERE execution_id = ${id}
      ORDER BY created_at ASC
    `;

    return NextResponse.json({
      ...execution,
      tasks,
      blockers,
      resources
    });
  } catch (error) {
    console.error('Error fetching execution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch execution' },
      { status: 500 }
    );
  }
}

// PUT /api/executions/[id] - Update execution
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
      status,
      progress,
      primaryAssignee,
      teamMembers,
      startDate,
      dueDate,
      completedDate,
      estimatedHours,
      actualHours,
      parentNodeId
    } = body;

    const result = await sql`
      UPDATE wf_executions
      SET
        name = COALESCE(${name}, name),
        status = COALESCE(${status}, status),
        progress = COALESCE(${progress}, progress),
        primary_assignee = COALESCE(${primaryAssignee}, primary_assignee),
        team_members = COALESCE(${teamMembers ? teamMembers : null}, team_members),
        start_date = COALESCE(${startDate}, start_date),
        due_date = COALESCE(${dueDate}, due_date),
        completed_date = COALESCE(${completedDate}, completed_date),
        estimated_hours = COALESCE(${estimatedHours}, estimated_hours),
        actual_hours = COALESCE(${actualHours}, actual_hours),
        parent_node_id = COALESCE(${parentNodeId}, parent_node_id),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating execution:', error);
    return NextResponse.json(
      { error: 'Failed to update execution' },
      { status: 500 }
    );
  }
}

// DELETE /api/executions/[id] - Delete execution (cascades to tasks/blockers/resources)
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
      DELETE FROM wf_executions
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting execution:', error);
    return NextResponse.json(
      { error: 'Failed to delete execution' },
      { status: 500 }
    );
  }
}
