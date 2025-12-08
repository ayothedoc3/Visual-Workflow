import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getDatabaseUrl } from '@/lib/db';

// GET /api/campaigns/[id] - Get single campaign with playbook counts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const { id } = await params;

    // Get campaign with playbook count
    const result = await sql`
      SELECT
        c.*,
        COUNT(p.id) as playbook_count
      FROM wf_campaigns c
      LEFT JOIN wf_playbooks p ON p.parent_campaign_id = c.id
      WHERE c.id = ${id}
      GROUP BY c.id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

// PUT /api/campaigns/[id] - Update campaign
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      strategicNodes,
      strategicEdges,
      overallStatus,
      startDate,
      targetDate,
      actualCompletionDate
    } = body;

    const result = await sql`
      UPDATE wf_campaigns
      SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        strategic_nodes = COALESCE(${strategicNodes ? JSON.stringify(strategicNodes) : null}, strategic_nodes),
        strategic_edges = COALESCE(${strategicEdges ? JSON.stringify(strategicEdges) : null}, strategic_edges),
        overall_status = COALESCE(${overallStatus}, overall_status),
        start_date = COALESCE(${startDate}, start_date),
        target_date = COALESCE(${targetDate}, target_date),
        actual_completion_date = COALESCE(${actualCompletionDate}, actual_completion_date),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE /api/campaigns/[id] - Delete campaign (cascades to playbooks)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const { id } = await params;

    const result = await sql`
      DELETE FROM wf_campaigns
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
