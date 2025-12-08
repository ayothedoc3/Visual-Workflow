import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getDatabaseUrl } from '@/lib/db';

// POST /api/executions/[id]/resources - Create new resource
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const { id: executionId } = await params;
    const body = await request.json();
    const {
      name,
      type,
      status = 'available',
      url,
      notes
    } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO wf_resources (
        execution_id,
        name,
        type,
        status,
        url,
        notes
      )
      VALUES (
        ${executionId},
        ${name},
        ${type},
        ${status},
        ${url || null},
        ${notes || null}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}

// PUT /api/executions/[id]/resources?resourceId=xxx - Update resource
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
    await params;
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');

    if (!resourceId) {
      return NextResponse.json(
        { error: 'resourceId is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      type,
      status,
      url,
      notes
    } = body;

    const result = await sql`
      UPDATE wf_resources
      SET
        name = COALESCE(${name}, name),
        type = COALESCE(${type}, type),
        status = COALESCE(${status}, status),
        url = COALESCE(${url}, url),
        notes = COALESCE(${notes}, notes),
        updated_at = NOW()
      WHERE id = ${resourceId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/executions/[id]/resources?resourceId=xxx - Delete resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');

    if (!resourceId) {
      return NextResponse.json(
        { error: 'resourceId is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM wf_resources
      WHERE id = ${resourceId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
