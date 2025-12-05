import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workflows } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// POST /api/workflows/[id]/duplicate - Duplicate a workflow
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;

    // Get the original workflow
    const original = await db
      .select()
      .from(workflows)
      .where(eq(workflows.id, params.id));

    if (original.length === 0) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    const originalWorkflow = original[0];

    // Create duplicate with new name
    const duplicate = await db.insert(workflows).values({
      name: `${originalWorkflow.name} (Copy)`,
      description: originalWorkflow.description,
      thumbnail: originalWorkflow.thumbnail,
      nodes: originalWorkflow.nodes,
      edges: originalWorkflow.edges,
      createdBy: originalWorkflow.createdBy,
    }).returning();

    return NextResponse.json(duplicate[0], { status: 201 });
  } catch (error) {
    console.error('Error duplicating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate workflow' },
      { status: 500 }
    );
  }
}
