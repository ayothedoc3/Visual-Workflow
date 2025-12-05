import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workflows } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// GET /api/workflows/[id] - Get single workflow
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const result = await db
      .select()
      .from(workflows)
      .where(eq(workflows.id, params.id));

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    );
  }
}

// PUT /api/workflows/[id] - Update workflow
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.name) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;
    if (body.nodes) updateData.nodes = body.nodes;
    if (body.edges) updateData.edges = body.edges;

    const result = await db
      .update(workflows)
      .set(updateData)
      .where(eq(workflows.id, params.id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error('Error updating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    );
  }
}

// DELETE /api/workflows/[id] - Delete workflow
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const result = await db
      .delete(workflows)
      .where(eq(workflows.id, params.id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Workflow deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    );
  }
}
