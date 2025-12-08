import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/executions/[id]/tasks - Create new task
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const executionId = params.id;
    const body = await request.json();
    const {
      description,
      status = 'not-started',
      assignee,
      dueDate,
      priority = 'medium',
      dependsOn = [],
      blocks = []
    } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO wf_tasks (
        execution_id,
        description,
        status,
        assignee,
        due_date,
        priority,
        depends_on,
        blocks
      )
      VALUES (
        ${executionId},
        ${description},
        ${status},
        ${assignee || null},
        ${dueDate || null},
        ${priority},
        ${dependsOn},
        ${blocks}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// PUT /api/executions/[id]/tasks?taskId=xxx - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      description,
      status,
      assignee,
      dueDate,
      completedDate,
      priority,
      dependsOn,
      blocks
    } = body;

    const result = await sql`
      UPDATE wf_tasks
      SET
        description = COALESCE(${description}, description),
        status = COALESCE(${status}, status),
        assignee = COALESCE(${assignee}, assignee),
        due_date = COALESCE(${dueDate}, due_date),
        completed_date = COALESCE(${completedDate}, completed_date),
        priority = COALESCE(${priority}, priority),
        depends_on = COALESCE(${dependsOn ? dependsOn : null}, depends_on),
        blocks = COALESCE(${blocks ? blocks : null}, blocks),
        updated_at = NOW()
      WHERE id = ${taskId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/executions/[id]/tasks?taskId=xxx - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM wf_tasks
      WHERE id = ${taskId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
