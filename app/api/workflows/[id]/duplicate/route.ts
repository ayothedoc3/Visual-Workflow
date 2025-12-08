import { NextRequest, NextResponse } from 'next/server';

// Check if database is available
async function isDatabaseAvailable() {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://user:password@host:port/database') {
      return false;
    }
    const { getDb } = await import('@/lib/db');
    const db = getDb();
    await db.execute('SELECT 1' as any);
    return true;
  } catch {
    return false;
  }
}

// POST /api/workflows/[id]/duplicate - Duplicate a workflow
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      return NextResponse.json(
        { useClientStorage: true, id: params.id },
        { status: 200, headers: { 'X-Storage-Mode': 'client' } }
      );
    }

    const { db } = await import('@/lib/db');
    const { workflows } = await import('@/lib/schema');
    const { eq } = await import('drizzle-orm');

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
