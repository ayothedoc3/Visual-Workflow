import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { templates } from '@/lib/schema';
import { seedTemplates } from '@/lib/seed-data';

// POST /api/templates/seed - Seed initial templates
export async function POST() {
  try {
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
