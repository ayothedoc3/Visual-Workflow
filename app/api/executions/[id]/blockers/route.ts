import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/executions/[id]/blockers - Create new blocker
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: executionId } = await params;
    const body = await request.json();
    const {
      description,
      blockerType,
      status = 'active',
      reportedBy,
      assignedTo,
      taskId
    } = body;

    if (!description || !blockerType || !reportedBy) {
      return NextResponse.json(
        { error: 'Description, blockerType, and reportedBy are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO wf_blockers (
        execution_id,
        task_id,
        description,
        blocker_type,
        status,
        reported_by,
        assigned_to
      )
      VALUES (
        ${executionId},
        ${taskId || null},
        ${description},
        ${blockerType},
        ${status},
        ${reportedBy},
        ${assignedTo || null}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating blocker:', error);
    return NextResponse.json(
      { error: 'Failed to create blocker' },
      { status: 500 }
    );
  }
}

// PUT /api/executions/[id]/blockers?blockerId=xxx - Update blocker
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const { searchParams } = new URL(request.url);
    const blockerId = searchParams.get('blockerId');

    if (!blockerId) {
      return NextResponse.json(
        { error: 'blockerId is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      description,
      blockerType,
      status,
      assignedTo,
      resolvedAt
    } = body;

    const result = await sql`
      UPDATE wf_blockers
      SET
        description = COALESCE(${description}, description),
        blocker_type = COALESCE(${blockerType}, blocker_type),
        status = COALESCE(${status}, status),
        assigned_to = COALESCE(${assignedTo}, assigned_to),
        resolved_at = COALESCE(${resolvedAt}, resolved_at)
      WHERE id = ${blockerId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Blocker not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating blocker:', error);
    return NextResponse.json(
      { error: 'Failed to update blocker' },
      { status: 500 }
    );
  }
}

// DELETE /api/executions/[id]/blockers?blockerId=xxx - Delete blocker
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const { searchParams } = new URL(request.url);
    const blockerId = searchParams.get('blockerId');

    if (!blockerId) {
      return NextResponse.json(
        { error: 'blockerId is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM wf_blockers
      WHERE id = ${blockerId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Blocker not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blocker:', error);
    return NextResponse.json(
      { error: 'Failed to delete blocker' },
      { status: 500 }
    );
  }
}
