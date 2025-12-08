import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getDatabaseUrl } from '@/lib/db';

// GET /api/playbooks?campaignId=xxx - List playbooks (optionally filtered by campaign)
export async function GET(request: NextRequest) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    let playbooks;
    if (campaignId) {
      playbooks = await sql`
        SELECT
          p.*,
          c.name as campaign_name,
          COUNT(e.id) as execution_count
        FROM wf_playbooks p
        LEFT JOIN wf_campaigns c ON c.id = p.parent_campaign_id
        LEFT JOIN wf_executions e ON e.parent_playbook_id = p.id
        WHERE p.parent_campaign_id = ${campaignId}
        GROUP BY p.id, c.name
        ORDER BY p.updated_at DESC
      `;
    } else {
      playbooks = await sql`
        SELECT
          p.*,
          c.name as campaign_name,
          COUNT(e.id) as execution_count
        FROM wf_playbooks p
        LEFT JOIN wf_campaigns c ON c.id = p.parent_campaign_id
        LEFT JOIN wf_executions e ON e.parent_playbook_id = p.id
        GROUP BY p.id, c.name
        ORDER BY p.updated_at DESC
      `;
    }

    return NextResponse.json(playbooks);
  } catch (error) {
    console.error('Error fetching playbooks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playbooks' },
      { status: 500 }
    );
  }
}

// POST /api/playbooks - Create new playbook
export async function POST(request: NextRequest) {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const sql = neon(databaseUrl);
    const body = await request.json();
    const {
      name,
      description,
      parentCampaignId,
      parentNodeId,
      workflowNodes = [],
      workflowEdges = [],
      overallStatus = 'not-started',
      progress = 0,
      createdBy
    } = body;

    if (!name || !parentCampaignId) {
      return NextResponse.json(
        { error: 'Name and parentCampaignId are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO wf_playbooks (
        name,
        description,
        parent_campaign_id,
        parent_node_id,
        workflow_nodes,
        workflow_edges,
        overall_status,
        progress,
        created_by
      )
      VALUES (
        ${name},
        ${description || null},
        ${parentCampaignId},
        ${parentNodeId || null},
        ${JSON.stringify(workflowNodes)},
        ${JSON.stringify(workflowEdges)},
        ${overallStatus},
        ${progress},
        ${createdBy || null}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating playbook:', error);
    return NextResponse.json(
      { error: 'Failed to create playbook' },
      { status: 500 }
    );
  }
}
