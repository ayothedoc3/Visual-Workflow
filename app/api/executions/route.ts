import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getDatabaseUrl } from '@/lib/db';

// GET /api/executions?playbookId=xxx - List executions
export async function GET(request: NextRequest) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const { searchParams } = new URL(request.url);
    const playbookId = searchParams.get('playbookId');

    let executions;
    if (playbookId) {
      executions = await sql`
        SELECT
          e.*,
          p.name as playbook_name,
          COUNT(DISTINCT t.id) as task_count,
          COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_task_count,
          COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'active') as active_blocker_count
        FROM wf_executions e
        LEFT JOIN wf_playbooks p ON p.id = e.parent_playbook_id
        LEFT JOIN wf_tasks t ON t.execution_id = e.id
        LEFT JOIN wf_blockers b ON b.execution_id = e.id
        WHERE e.parent_playbook_id = ${playbookId}
        GROUP BY e.id, p.name
        ORDER BY e.updated_at DESC
      `;
    } else {
      executions = await sql`
        SELECT
          e.*,
          p.name as playbook_name,
          COUNT(DISTINCT t.id) as task_count,
          COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_task_count,
          COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'active') as active_blocker_count
        FROM wf_executions e
        LEFT JOIN wf_playbooks p ON p.id = e.parent_playbook_id
        LEFT JOIN wf_tasks t ON t.execution_id = e.id
        LEFT JOIN wf_blockers b ON b.execution_id = e.id
        GROUP BY e.id, p.name
        ORDER BY e.updated_at DESC
      `;
    }

    return NextResponse.json(executions);
  } catch (error) {
    console.error('Error fetching executions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}

// POST /api/executions - Create new execution
export async function POST(request: NextRequest) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const body = await request.json();
    const {
      name,
      parentPlaybookId,
      parentNodeId,
      status = 'not-started',
      progress = 0,
      primaryAssignee,
      teamMembers = [],
      startDate,
      dueDate,
      estimatedHours,
      actualHours
    } = body;

    if (!name || !parentPlaybookId) {
      return NextResponse.json(
        { error: 'Name and parentPlaybookId are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO wf_executions (
        name,
        parent_playbook_id,
        parent_node_id,
        status,
        progress,
        primary_assignee,
        team_members,
        start_date,
        due_date,
        estimated_hours,
        actual_hours
      )
      VALUES (
        ${name},
        ${parentPlaybookId},
        ${parentNodeId || null},
        ${status},
        ${progress},
        ${primaryAssignee || null},
        ${teamMembers},
        ${startDate || null},
        ${dueDate || null},
        ${estimatedHours || null},
        ${actualHours || null}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating execution:', error);
    return NextResponse.json(
      { error: 'Failed to create execution' },
      { status: 500 }
    );
  }
}
