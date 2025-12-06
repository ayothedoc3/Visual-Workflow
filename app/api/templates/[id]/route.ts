import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// Check if database is available
async function isDatabaseAvailable() {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://user:password@host:port/database') {
      return false;
    }
    const { db } = await import('@/lib/db');
    await db.execute('SELECT 1' as any);
    return true;
  } catch {
    return false;
  }
}

// GET /api/templates/[id] - Get single template
export async function GET(
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
    const { templates } = await import('@/lib/schema');
    const result = await db
      .select()
      .from(templates)
      .where(eq(templates.id, params.id));

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

// PUT /api/templates/[id] - Update template
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      return NextResponse.json(
        { useClientStorage: true, id: params.id, data: body },
        { status: 200, headers: { 'X-Storage-Mode': 'client' } }
      );
    }

    const { db } = await import('@/lib/db');
    const { templates } = await import('@/lib/schema');

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.name) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category) updateData.category = body.category;
    if (body.tags) updateData.tags = body.tags;
    if (body.metadata) updateData.metadata = body.metadata;
    if (body.node_type) updateData.nodeType = body.node_type;

    const result = await db
      .update(templates)
      .set(updateData)
      .where(eq(templates.id, params.id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

// DELETE /api/templates/[id] - Delete template
export async function DELETE(
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
    const { templates } = await import('@/lib/schema');
    const result = await db
      .delete(templates)
      .where(eq(templates.id, params.id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Template deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
