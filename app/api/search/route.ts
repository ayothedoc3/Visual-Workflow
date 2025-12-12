import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { campaigns, playbooks, executions } from '@/lib/schema';
import { like, or, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${query}%`;
    const results: any[] = [];

    // Search Campaigns (Layer 1)
    const campaignResults = await db
      .select()
      .from(campaigns)
      .where(
        or(
          like(campaigns.name, searchTerm),
          like(campaigns.description, searchTerm)
        )
      )
      .limit(10);

    results.push(
      ...campaignResults.map((campaign) => ({
        id: campaign.id,
        type: 'campaign',
        title: campaign.name,
        description: campaign.description,
        layer: 1,
        url: `/campaigns/${campaign.id}`,
      }))
    );

    // Search Playbooks (Layer 2)
    const playbookResults = await db
      .select({
        id: playbooks.id,
        name: playbooks.name,
        description: playbooks.description,
        campaignId: playbooks.parentCampaignId,
        campaignName: campaigns.name,
      })
      .from(playbooks)
      .leftJoin(campaigns, sql`${playbooks.parentCampaignId} = ${campaigns.id}`)
      .where(
        or(
          like(playbooks.name, searchTerm),
          like(playbooks.description, searchTerm)
        )
      )
      .limit(10);

    results.push(
      ...playbookResults.map((playbook) => ({
        id: playbook.id,
        type: 'playbook',
        title: playbook.name,
        description: playbook.description,
        parentId: playbook.campaignId,
        parentName: playbook.campaignName,
        layer: 2,
        url: `/playbooks/${playbook.id}`,
      }))
    );

    // Search Executions (Layer 3)
    const executionResults = await db
      .select({
        id: executions.id,
        name: executions.name,
        status: executions.status,
        playbookId: executions.parentPlaybookId,
        playbookName: playbooks.name,
      })
      .from(executions)
      .leftJoin(playbooks, sql`${executions.parentPlaybookId} = ${playbooks.id}`)
      .where(like(executions.name, searchTerm))
      .limit(10);

    results.push(
      ...executionResults.map((execution) => ({
        id: execution.id,
        type: 'execution',
        title: execution.name,
        description: `Status: ${execution.status}`,
        parentId: execution.playbookId,
        parentName: execution.playbookName,
        layer: 3,
        url: `/executions/${execution.id}`,
      }))
    );

    // Search within workflow nodes (across all playbooks)
    const nodeResults = await db
      .select({
        playbookId: playbooks.id,
        playbookName: playbooks.name,
        workflowNodes: playbooks.workflowNodes,
      })
      .from(playbooks)
      .limit(100);

    // Search through node labels and descriptions
    for (const playbook of nodeResults) {
      if (!playbook.workflowNodes) continue;

      const nodes = playbook.workflowNodes as any[];
      for (const node of nodes) {
        if (
          node.label?.toLowerCase().includes(query.toLowerCase()) ||
          node.description?.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({
            id: node.id,
            type: 'node',
            title: node.label || 'Unnamed Node',
            description: node.description || `${node.type} node`,
            parentId: playbook.playbookId,
            parentName: playbook.playbookName,
            layer: 2,
            url: `/playbooks/${playbook.playbookId}`,
          });

          if (results.length >= 50) break;
        }
      }
      if (results.length >= 50) break;
    }

    // Sort results by relevance (exact matches first)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === query.toLowerCase();
      const bExact = b.title.toLowerCase() === query.toLowerCase();
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.layer - b.layer; // Then by layer (1 < 2 < 3)
    });

    return NextResponse.json({
      results: results.slice(0, 20), // Limit to top 20 results
      query,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    );
  }
}
