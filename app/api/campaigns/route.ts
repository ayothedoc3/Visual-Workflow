import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/campaigns - List all campaigns
export async function GET() {
  try {
    const campaigns = await sql`
      SELECT
        id,
        name,
        description,
        strategic_nodes,
        strategic_edges,
        overall_status,
        start_date,
        target_date,
        actual_completion_date,
        created_at,
        updated_at,
        created_by
      FROM wf_campaigns
      ORDER BY updated_at DESC
    `;

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      strategicNodes = [],
      strategicEdges = [],
      overallStatus = 'not-started',
      startDate,
      targetDate,
      createdBy
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO wf_campaigns (
        name,
        description,
        strategic_nodes,
        strategic_edges,
        overall_status,
        start_date,
        target_date,
        created_by
      )
      VALUES (
        ${name},
        ${description || null},
        ${JSON.stringify(strategicNodes)},
        ${JSON.stringify(strategicEdges)},
        ${overallStatus},
        ${startDate || null},
        ${targetDate || null},
        ${createdBy || null}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
