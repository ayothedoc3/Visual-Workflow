import { NextRequest, NextResponse } from 'next/server';
import { eq, like, and, or, ilike } from 'drizzle-orm';

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

// GET /api/templates - List/search templates
export async function GET(request: NextRequest) {
  try {
    const dbAvailable = await isDatabaseAvailable();
    if (!dbAvailable) {
      return NextResponse.json(
        { useClientStorage: true },
        { status: 200, headers: { 'X-Storage-Mode': 'client' } }
      );
    }

    const { db } = await import('@/lib/db');
    const { templates } = await import('@/lib/schema');
    const { searchParams } = new URL(request.url);
    const nodeType = searchParams.get('node_type');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let query = db.select().from(templates);

    const filters = [];

    if (nodeType) {
      filters.push(eq(templates.nodeType, nodeType as any));
    }

    if (search) {
      filters.push(
        or(
          ilike(templates.name, `%${search}%`),
          ilike(templates.description, `%${search}%`)
        )
      );
    }

    if (category) {
      filters.push(eq(templates.category, category));
    }

    if (filters.length > 0) {
      query = query.where(and(...filters)) as any;
    }

    const results = await query;

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.node_type || !body.name || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: node_type, name, category' },
        { status: 400 }
      );
    }

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      return NextResponse.json(
        { useClientStorage: true, data: body },
        { status: 201, headers: { 'X-Storage-Mode': 'client' } }
      );
    }

    const { db } = await import('@/lib/db');
    const { templates } = await import('@/lib/schema');

    const newTemplate = await db.insert(templates).values({
      nodeType: body.node_type,
      name: body.name,
      description: body.description || null,
      category: body.category,
      tags: body.tags || [],
      metadata: body.metadata || {},
      createdBy: body.created_by || null,
    }).returning();

    return NextResponse.json(newTemplate[0], { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
