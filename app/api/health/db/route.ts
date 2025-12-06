import { NextResponse } from 'next/server';

// Health check endpoint for database availability
export async function GET() {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://user:password@host:port/database') {
      return NextResponse.json(
        { available: false, reason: 'Database not configured' },
        { status: 503 }
      );
    }

    // Try to import db module
    const { db } = await import('@/lib/db');

    // Simple query to test connection
    await db.execute('SELECT 1' as any);

    return NextResponse.json({ available: true }, { status: 200 });
  } catch (error) {
    console.error('Database health check failed:', error);
    return NextResponse.json(
      { available: false, reason: 'Connection failed' },
      { status: 503 }
    );
  }
}
