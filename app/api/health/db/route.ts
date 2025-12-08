import { NextResponse } from 'next/server';

// Health check endpoint for database availability
export async function GET() {
  try {
    const { getDatabaseUrl } = await import('@/lib/db');
    const databaseUrl = getDatabaseUrl();

    // Check if DATABASE_URL is configured
    if (!databaseUrl || databaseUrl === 'postgresql://user:password@host:port/database') {
      return NextResponse.json(
        { available: false, reason: 'Database not configured' },
        { status: 503 }
      );
    }

    const { Pool } = await import('@neondatabase/serverless');
    const pool = new Pool({ connectionString: databaseUrl });
    await pool.query('SELECT 1');

    return NextResponse.json({ available: true }, { status: 200 });
  } catch (error) {
    console.error('Database health check failed:', error);
    return NextResponse.json(
      { available: false, reason: 'Connection failed' },
      { status: 503 }
    );
  }
}
