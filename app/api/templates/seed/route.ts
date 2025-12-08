import { NextResponse } from 'next/server';
import { seedTemplates } from '@/lib/seed-data';

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

// POST /api/templates/seed - Seed initial templates
export async function POST() {
  try {
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      return NextResponse.json(
        { useClientStorage: true },
        { status: 200, headers: { 'X-Storage-Mode': 'client' } }
      );
    }

    const { getDb } = await import('@/lib/db');
    const db = getDb();
    const { templates } = await import('@/lib/schema');
    // Check if templates already exist
    const existing = await db.select().from(templates);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          message: 'Database already contains templates',
          count: existing.length,
        },
        { status: 200 }
      );
    }

    // Insert seed templates
    const inserted = await db.insert(templates).values(seedTemplates).returning();

    return NextResponse.json(
      {
        message: 'Successfully seeded templates',
        count: inserted.length,
        templates: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error seeding templates:', error);
    return NextResponse.json(
      { error: 'Failed to seed templates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/templates/seed - Check seed status
export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      return NextResponse.json(
        { useClientStorage: true, seeded: false, count: 0, ready: false },
        { status: 200, headers: { 'X-Storage-Mode': 'client' } }
      );
    }

    const { getDb } = await import('@/lib/db');
    const db = getDb();
    const { templates } = await import('@/lib/schema');
    const existing = await db.select().from(templates);

    return NextResponse.json({
      seeded: existing.length > 0,
      count: existing.length,
      ready: existing.length > 0,
    });
  } catch (error) {
    console.error('Error checking seed status:', error);
    return NextResponse.json(
      { error: 'Failed to check seed status' },
      { status: 500 }
    );
  }
}
