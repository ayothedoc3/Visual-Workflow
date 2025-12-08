import { Pool } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_dQ21iJkvpRhL@ep-dark-silence-a2al1i7l-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function seed() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    console.log('🌱 Seeding 3-Layer System...\n');

    // ============================================
    // LAYER 1: Create Campaign
    // ============================================
    console.log('📊 Layer 1: Creating Campaign...');

    const campaignResult = await pool.query(`
      INSERT INTO wf_campaigns (name, description, strategic_nodes, strategic_edges, overall_status, start_date, target_date)
      VALUES (
        'Q1 2025 Product Launch',
        'Strategic campaign to launch our new SaaS platform',
        $1::jsonb,
        $2::jsonb,
        'in-progress',
        '2025-01-01',
        '2025-03-31'
      )
      RETURNING id
    `, [
      JSON.stringify([
        {
          id: 'campaign-1',
          type: 'campaign',
          label: 'Product Launch Campaign',
          description: 'Launch new SaaS platform in Q1',
          position: { x: 250, y: 100 },
          overallProgress: 35,
          status: 'in-progress'
        },
        {
          id: 'strategy-1',
          type: 'strategy',
          label: 'Build & Test Product',
          description: 'Complete product development and QA',
          position: { x: 100, y: 250 },
          linkedPlaybookId: null,
          overallProgress: 60,
          status: 'in-progress'
        },
        {
          id: 'strategy-2',
          type: 'strategy',
          label: 'Marketing & Sales',
          description: 'Prepare go-to-market strategy',
          position: { x: 400, y: 250 },
          linkedPlaybookId: null,
          overallProgress: 25,
          status: 'in-progress'
        },
        {
          id: 'result-1',
          type: 'result',
          label: 'Launch Success',
          description: '1000 users, $50k MRR',
          position: { x: 250, y: 400 },
          overallProgress: 0,
          status: 'not-started'
        }
      ]),
      JSON.stringify([
        { id: 'e1', source: 'campaign-1', target: 'strategy-1', animated: true },
        { id: 'e2', source: 'campaign-1', target: 'strategy-2', animated: true },
        { id: 'e3', source: 'strategy-1', target: 'result-1' },
        { id: 'e4', source: 'strategy-2', target: 'result-1' }
      ])
    ]);

    const campaignId = campaignResult.rows[0].id;
    console.log(`✅ Created campaign: ${campaignId}\n`);

    // ============================================
    // LAYER 2: Create Playbooks
    // ============================================
    console.log('📋 Layer 2: Creating Playbooks...');

    // Playbook 1: Product Development
    const playbook1Result = await pool.query(`
      INSERT INTO wf_playbooks (
        name,
        description,
        parent_campaign_id,
        parent_node_id,
        workflow_nodes,
        workflow_edges,
        overall_status,
        progress
      )
      VALUES (
        'Product Development Sprint',
        'Complete core features and testing',
        $1,
        'strategy-1',
        $2::jsonb,
        $3::jsonb,
        'in-progress',
        60
      )
      RETURNING id
    `, [
      campaignId,
      JSON.stringify([
        {
          id: 'issue-1',
          type: 'issue',
          label: 'Missing Authentication',
          description: 'Need OAuth2 implementation',
          category: 'Technical Issue',
          position: { x: 100, y: 100 },
          status: 'in-progress',
          progress: 70,
          primaryAssignee: 'dev-team'
        },
        {
          id: 'action-1',
          type: 'action',
          label: 'Build Auth System',
          description: 'Implement OAuth2 with Google/GitHub',
          category: 'Development',
          position: { x: 300, y: 100 },
          linkedExecutionId: null,
          status: 'in-progress',
          progress: 70,
          primaryAssignee: 'John Doe'
        },
        {
          id: 'action-2',
          type: 'action',
          label: 'Integration Testing',
          description: 'Test all auth flows',
          category: 'Testing',
          position: { x: 500, y: 100 },
          linkedExecutionId: null,
          status: 'not-started',
          progress: 0,
          primaryAssignee: 'QA Team'
        },
        {
          id: 'deliverable-1',
          type: 'deliverable',
          label: 'Working Auth System',
          description: 'Production-ready authentication',
          category: 'Feature',
          position: { x: 700, y: 100 },
          status: 'not-started',
          progress: 0
        }
      ]),
      JSON.stringify([
        { id: 'e1', source: 'issue-1', target: 'action-1', animated: true },
        { id: 'e2', source: 'action-1', target: 'action-2' },
        { id: 'e3', source: 'action-2', target: 'deliverable-1' }
      ])
    ]);

    const playbook1Id = playbook1Result.rows[0].id;
    console.log(`✅ Created playbook 1: ${playbook1Id}`);

    // Playbook 2: Marketing Campaign
    const playbook2Result = await pool.query(`
      INSERT INTO wf_playbooks (
        name,
        description,
        parent_campaign_id,
        parent_node_id,
        workflow_nodes,
        workflow_edges,
        overall_status,
        progress
      )
      VALUES (
        'Go-To-Market Strategy',
        'Marketing and sales preparation',
        $1,
        'strategy-2',
        $2::jsonb,
        $3::jsonb,
        'in-progress',
        25
      )
      RETURNING id
    `, [
      campaignId,
      JSON.stringify([
        {
          id: 'issue-2',
          type: 'issue',
          label: 'No Brand Identity',
          description: 'Need logo, colors, messaging',
          category: 'Marketing',
          position: { x: 100, y: 200 },
          status: 'in-progress',
          progress: 40,
          primaryAssignee: 'marketing-team'
        },
        {
          id: 'action-3',
          type: 'action',
          label: 'Design Brand Assets',
          description: 'Create logo, style guide, templates',
          category: 'Design',
          position: { x: 300, y: 200 },
          linkedExecutionId: null,
          status: 'in-progress',
          progress: 40,
          primaryAssignee: 'Jane Smith'
        },
        {
          id: 'resource-1',
          type: 'resource',
          label: 'Brand Guidelines',
          description: 'Complete brand style guide',
          category: 'Document',
          position: { x: 500, y: 200 },
          status: 'not-started',
          progress: 0
        }
      ]),
      JSON.stringify([
        { id: 'e4', source: 'issue-2', target: 'action-3', animated: true },
        { id: 'e5', source: 'action-3', target: 'resource-1' }
      ])
    ]);

    const playbook2Id = playbook2Result.rows[0].id;
    console.log(`✅ Created playbook 2: ${playbook2Id}\n`);

    // ============================================
    // LAYER 3: Create Executions
    // ============================================
    console.log('⚙️  Layer 3: Creating Executions...');

    // Execution 1: Auth System Implementation
    const execution1Result = await pool.query(`
      INSERT INTO wf_executions (
        name,
        parent_playbook_id,
        parent_node_id,
        status,
        progress,
        primary_assignee,
        team_members,
        start_date,
        due_date,
        estimated_hours,
        actual_hours
      )
      VALUES (
        'OAuth2 Implementation',
        $1,
        'action-1',
        'in-progress',
        70,
        'John Doe',
        $2,
        '2025-01-05',
        '2025-01-20',
        80,
        56
      )
      RETURNING id
    `, [playbook1Id, ['John Doe', 'Sarah Chen', 'Mike Johnson']]);

    const execution1Id = execution1Result.rows[0].id;
    console.log(`✅ Created execution 1: ${execution1Id}`);

    // Execution 2: Brand Design
    const execution2Result = await pool.query(`
      INSERT INTO wf_executions (
        name,
        parent_playbook_id,
        parent_node_id,
        status,
        progress,
        primary_assignee,
        team_members,
        start_date,
        due_date,
        estimated_hours,
        actual_hours
      )
      VALUES (
        'Brand Identity Design',
        $1,
        'action-3',
        'in-progress',
        40,
        'Jane Smith',
        $2,
        '2025-01-10',
        '2025-02-01',
        60,
        24
      )
      RETURNING id
    `, [playbook2Id, ['Jane Smith', 'Alex Rivera']]);

    const execution2Id = execution2Result.rows[0].id;
    console.log(`✅ Created execution 2: ${execution2Id}\n`);

    // ============================================
    // Add Tasks
    // ============================================
    console.log('✅ Adding Tasks...');

    // Tasks for Execution 1 (OAuth2)
    await pool.query(`
      INSERT INTO wf_tasks (execution_id, description, status, assignee, priority, due_date, completed_date)
      VALUES
        ($1, 'Set up OAuth2 providers (Google, GitHub)', 'completed', 'John Doe', 'high', '2025-01-08', '2025-01-08'),
        ($1, 'Implement JWT token generation', 'completed', 'Sarah Chen', 'high', '2025-01-12', '2025-01-11'),
        ($1, 'Build user session management', 'in-progress', 'John Doe', 'high', '2025-01-15', NULL),
        ($1, 'Write integration tests', 'not-started', 'Mike Johnson', 'medium', '2025-01-18', NULL),
        ($1, 'Security audit', 'not-started', 'Sarah Chen', 'urgent', '2025-01-20', NULL)
    `, [execution1Id]);

    // Tasks for Execution 2 (Brand Design)
    await pool.query(`
      INSERT INTO wf_tasks (execution_id, description, status, assignee, priority, due_date)
      VALUES
        ($1, 'Design logo concepts', 'completed', 'Jane Smith', 'high', '2025-01-15'),
        ($1, 'Create color palette', 'completed', 'Jane Smith', 'medium', '2025-01-17'),
        ($1, 'Design marketing templates', 'in-progress', 'Alex Rivera', 'medium', '2025-01-25'),
        ($1, 'Write brand guidelines document', 'not-started', 'Jane Smith', 'medium', '2025-01-30')
    `, [execution2Id]);

    console.log('✅ Created 9 tasks\n');

    // ============================================
    // Add Blockers
    // ============================================
    console.log('🚧 Adding Blockers...');

    await pool.query(`
      INSERT INTO wf_blockers (execution_id, description, blocker_type, status, reported_by, assigned_to)
      VALUES
        ($1, 'Waiting for security team review of OAuth implementation', 'waiting-on-person', 'active', 'John Doe', 'Security Team'),
        ($2, 'Need final approval on brand colors from CEO', 'waiting-on-person', 'active', 'Jane Smith', 'CEO')
    `, [execution1Id, execution2Id]);

    console.log('✅ Created 2 blockers\n');

    // ============================================
    // Add Resources
    // ============================================
    console.log('📚 Adding Resources...');

    await pool.query(`
      INSERT INTO wf_resources (execution_id, name, type, status, url, notes)
      VALUES
        ($1, 'OAuth2 RFC Documentation', 'document', 'available', 'https://oauth.net/2/', 'Official OAuth2 specification'),
        ($1, 'Passport.js Library', 'tool', 'available', 'https://www.passportjs.org/', 'Node.js authentication middleware'),
        ($2, 'Figma Design File', 'tool', 'available', 'https://figma.com/...', 'Main brand design workspace'),
        ($2, 'Brand Strategy Doc', 'document', 'requested', NULL, 'Requested from marketing consultant')
    `, [execution1Id, execution2Id]);

    console.log('✅ Created 4 resources\n');

    // ============================================
    // Summary
    // ============================================
    console.log('═══════════════════════════════════════');
    console.log('✨ Seed Complete! 3-Layer System Ready');
    console.log('═══════════════════════════════════════\n');
    console.log('📊 Layer 1 (Strategic):');
    console.log('   ├─ 1 Campaign: Q1 2025 Product Launch');
    console.log('   └─ 4 Strategic Nodes\n');
    console.log('📋 Layer 2 (Tactical):');
    console.log('   ├─ 2 Playbooks');
    console.log('   └─ 7 Workflow Nodes\n');
    console.log('⚙️  Layer 3 (Operational):');
    console.log('   ├─ 2 Executions');
    console.log('   ├─ 9 Tasks');
    console.log('   ├─ 2 Blockers');
    console.log('   └─ 4 Resources\n');
    console.log('🔗 Test the hierarchy:');
    console.log(`   Campaign ID: ${campaignId}`);
    console.log(`   Playbook IDs: ${playbook1Id}, ${playbook2Id}`);
    console.log(`   Execution IDs: ${execution1Id}, ${execution2Id}\n`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
