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

// GET /api/workflows - List all workflows
export async function GET(request: NextRequest) {
  try {
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Return signal to use client-side storage
      return NextResponse.json(
        { useClientStorage: true },
        { status: 200, headers: { 'X-Storage-Mode': 'client' } }
      );
    }

    const { getDb } = await import('@/lib/db');
    const db = getDb();
    const { workflows } = await import('@/lib/schema');
    const { like, desc } = await import('drizzle-orm');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = db.select().from(workflows).orderBy(desc(workflows.updatedAt));

    if (search) {
      query = query.where(like(workflows.name, `%${search}%`)) as any;
    }

    const results = await query;

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}

// POST /api/workflows - Create new workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Return signal to use client-side storage
      return NextResponse.json(
        { useClientStorage: true, data: body },
        { status: 201, headers: { 'X-Storage-Mode': 'client' } }
      );
    }

    const { db } = await import('@/lib/db');
    const { workflows } = await import('@/lib/schema');

    const newWorkflow = await db.insert(workflows).values({
      name: body.name,
      description: body.description || null,
      thumbnail: body.thumbnail || null,
      nodes: body.nodes || [],
      edges: body.edges || [],
      createdBy: body.created_by || null,
    }).returning();

    return NextResponse.json(newWorkflow[0], { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}
