/**
 * Help content for different pages and layers
 */

export interface HelpSection {
  title: string;
  content: string;
}

export interface HelpExample {
  title: string;
  description: string;
  steps: string[];
  result: string;
}

export interface HelpContent {
  title: string;
  description: string;
  sections: HelpSection[];
  examples: HelpExample[];
}

// ============================================
// LAYER 1: CAMPAIGN (STRATEGIC VIEW)
// ============================================

export const CAMPAIGN_HELP: HelpContent = {
  title: 'Layer 1: Strategic View',
  description: 'Create high-level strategy with 3-5 nodes. Each node can drill down into a detailed playbook.',
  sections: [
    {
      title: 'Understanding the Strategic Canvas',
      content: `The Strategic Canvas is where you plan your campaign at the highest level.

• Think of it as a roadmap with 3-5 major milestones
• Each node represents a big-picture goal or phase
• This is NOT where you plan detailed tasks (that's Layer 2)`
    },
    {
      title: 'Setting EMOS Metadata',
      content: `Click the Settings icon (⚙️) in the top-right to configure:

Package Tier: Choose your service level
• Bronze/Silver = Basic services
• Gold/Platinum = Premium services
• Black = Elite/Enterprise services

Level: Choose your growth stage
• ACQUIRE = Getting new clients
• MAINTAIN = Keeping existing clients happy
• SCALE = Growing operations and revenue`
    },
    {
      title: 'Creating Strategy Nodes',
      content: `Drag nodes from the right palette onto the canvas:

• Use "Strategy" nodes for major phases or goals
• Use "Result" nodes for expected outcomes
• Connect them with arrows to show the flow
• Keep it simple: 3-5 nodes maximum

Pro tip: Think in months, not days. This is your big-picture view.`
    },
    {
      title: 'Drilling Down to Playbooks',
      content: `Double-click any Strategy node to create or open a playbook:

• First time: You'll be asked to create a new playbook
• After that: Double-click opens the existing playbook
• The playbook is where you plan detailed actions (Layer 2)

Think of it like: Campaign = Book, Playbook = Chapter`
    }
  ],
  examples: [
    {
      title: 'Example: Client Onboarding Campaign',
      description: 'A typical Gold-tier ACQUIRE campaign for onboarding new clients.',
      steps: [
        'Open Campaign Settings, set Package Tier to "Gold" and Level to "ACQUIRE"',
        'Create a Strategy node called "Discovery & Planning"',
        'Create a Strategy node called "Implementation"',
        'Create a Result node called "Client Go-Live"',
        'Connect them: Discovery → Implementation → Go-Live',
        'Double-click "Discovery & Planning" to create the detailed playbook'
      ],
      result: 'You now have a 3-node strategic roadmap. Each Strategy node links to a playbook where you\'ll plan the actual work with 9 Gates and detailed actions.'
    },
    {
      title: 'Example: Customer Retention Campaign',
      description: 'A MAINTAIN-level campaign for keeping existing clients engaged.',
      steps: [
        'Set Package Tier to "Silver" and Level to "MAINTAIN"',
        'Create Strategy node: "Quarterly Check-ins"',
        'Create Strategy node: "Success Stories & Case Studies"',
        'Create Result node: "90% Retention Rate"',
        'Connect them in sequence',
        'Save the campaign (Click "Save Canvas")'
      ],
      result: 'Your strategic plan is saved. You can now drill into each Strategy node to create the detailed playbooks for execution.'
    }
  ]
};

// ============================================
// LAYER 2: PLAYBOOK (TACTICAL VIEW)
// ============================================

export const PLAYBOOK_HELP: HelpContent = {
  title: 'Layer 2: Tactical View',
  description: 'Execute your strategy with 9 sequential Gates and detailed workflows. This is where planning becomes action.',
  sections: [
    {
      title: 'Understanding the 9 Gates',
      content: `Every new playbook starts with 9 pre-loaded Gates arranged in a 3x3 grid:

Gate 1: Strategy Entry - Define goals
Gate 2: Level Selection - Confirm ACQUIRE/MAINTAIN/SCALE
Gate 3: Formation Selection - Confirm package tier
Gate 4: Talent Matching - Assign team members
Gate 5: SOP Activation - Load procedures
Gate 6: Template Deployment - Deploy workflows
Gate 7: Contract Enforcement - Legal requirements
Gate 8: KPI Feedback - Setup metrics
Gate 9: Learning Loop - Document lessons

These gates flow sequentially (1→2→3→...→9) as checkpoints.`
    },
    {
      title: 'Working with Gates',
      content: `Each Gate has important fields you can customize:

Click the arrow (▶) to expand a Gate and see:
• Question: What needs to be answered?
• Action: What needs to be done?
• Blocked If: What would stop progress?
• Escalate To: Who to contact if blocked?

You can:
• Click "Edit" to customize these fields
• Click "Block Gate" to mark it as blocked
• Blocked gates turn red and show an alert icon`
    },
    {
      title: 'Adding Detailed Workflow Nodes',
      content: `Between the Gates, add detailed nodes from the right palette:

Issue Nodes (Red):
• Problems that need solving
• Blockers or concerns

Action Nodes (Blue):
• Tasks to complete
• Can assign to people and select software tools

Resource Nodes (Green):
• Files, documents, tools needed
• Can specify software/platform

Deliverable Nodes (Purple):
• Outputs or results
• What gets produced or shipped

Connect them with arrows to show the workflow.`
    },
    {
      title: 'Assigning Work',
      content: `Action nodes let you assign work to your team:

1. Click "Assign" or "Edit" on an Action node
2. Enter the person or role (e.g., "John" or "Marketing Manager")
3. Enter the software/tool they'll use (e.g., "Figma" or "HubSpot")
4. Click "Done" to save

The assignments appear as badges on the node with icons:
• 👤 = Person assigned
• 💻 = Software tool`
    },
    {
      title: 'Using Templates for Speed',
      content: `Action and Resource nodes can use pre-built templates:

1. Click "Select Template" on an empty Action node
2. Browse categories or search for templates
3. Select a template to auto-fill the node
4. Some templates have variants (different approaches)
5. Variants can auto-create connected resources and deliverables

This saves time and ensures consistency across playbooks.`
    }
  ],
  examples: [
    {
      title: 'Example: Discovery Call Workflow',
      description: 'Building a detailed workflow for Gate 1 (Strategy Entry) in a client onboarding playbook.',
      steps: [
        'Your playbook auto-loads with 9 Gates in a 3x3 grid',
        'Expand Gate 1 (Strategy Entry) to review the checkpoint',
        'Drag an Action node from the palette and place it after Gate 1',
        'Click "Select Template" and search for "Discovery Call"',
        'Select the "Initial Discovery Call" template',
        'Click "Assign" and enter "Sales Rep" and "Zoom"',
        'Drag a Deliverable node and label it "Discovery Notes"',
        'Connect: Gate 1 → Action → Deliverable → Gate 2'
      ],
      result: 'You now have a workflow between Gate 1 and Gate 2 showing exactly what happens during discovery: who does it, what tool they use, and what gets delivered.'
    },
    {
      title: 'Example: Blocking a Gate',
      description: 'What to do when you can\'t proceed past a Gate checkpoint.',
      steps: [
        'Navigate to Gate 4 (Talent Matching)',
        'Click the arrow to expand the gate',
        'Review the "Blocked If" condition: "Required talent tier unavailable"',
        'Realize your team is fully booked',
        'Click "Block Gate" button',
        'The gate turns red with an alert icon',
        'Review "Escalate To: Resource Manager / HR"',
        'Contact the Resource Manager to resolve the blocker'
      ],
      result: 'The gate is visually marked as blocked. Your team knows to pause and resolve the talent availability issue before proceeding. Once resolved, click "Unblock Gate" to continue.'
    },
    {
      title: 'Example: Template with Variants',
      description: 'Using template variants to auto-create a workflow with resources and deliverables.',
      steps: [
        'Place an Action node after Gate 6 (Template Deployment)',
        'Click "Select Template" and choose "Client Presentation"',
        'A dropdown appears with variants: "Sales Pitch", "Status Update", "Results Review"',
        'Select "Sales Pitch" variant',
        'The system auto-creates 3 Resource nodes (left side) and 2 Deliverable nodes (right side)',
        'Resources: Slide Deck Template, Brand Assets, Case Studies',
        'Deliverables: Final Presentation, Follow-up Email',
        'All nodes are pre-connected with arrows'
      ],
      result: 'In one click, you have a complete 6-node workflow: 3 resources feed into the action, which produces 2 deliverables. You can now customize each node as needed.'
    }
  ]
};

// ============================================
// TEMPLATES PAGE
// ============================================

export const TEMPLATES_HELP: HelpContent = {
  title: 'Templates Library',
  description: 'Browse, create, and manage reusable templates for Actions, Issues, Resources, and Deliverables.',
  sections: [
    {
      title: 'What are Templates?',
      content: `Templates are pre-built, reusable nodes that save time:

• Think of them as blueprints for common tasks
• Use them to ensure consistency across projects
• They come with pre-filled descriptions and metadata
• You can customize them after adding to your workflow

Templates work for:
• Actions (tasks to complete)
• Issues (problems to solve)
• Resources (files/tools needed)
• Deliverables (outputs/results)`
    },
    {
      title: 'Finding the Right Template',
      content: `Use the search and filter tools:

Search Bar: Type keywords to find templates
• Example: "client call" finds all call-related templates

Category Filter: Browse by category
• Marketing, Sales, Development, Operations, etc.

Node Type Filter: Filter by type
• Actions, Issues, Resources, Deliverables

The results update instantly as you search and filter.`
    },
    {
      title: 'Creating a New Template',
      content: `To create your own reusable template:

1. Click "New Template" button
2. Choose the node type (Action, Issue, etc.)
3. Enter a clear, descriptive name
4. Write a description explaining what it's for
5. Select a category (or create a new one)
6. Add tags to make it searchable
7. Click "Save Template"

Your template is now available for all future workflows.`
    },
    {
      title: 'Using Templates in Workflows',
      content: `Templates are used when building playbooks:

1. In a playbook, add an Action or other node
2. Click "Select Template" on the node
3. Search or browse for your template
4. Click to apply it to the node
5. The node auto-fills with template data
6. Customize as needed for your specific use case

Templates speed up workflow creation significantly.`
    }
  ],
  examples: [
    {
      title: 'Example: Creating a "Client Kickoff Call" Template',
      description: 'Building a reusable template for client kickoff meetings.',
      steps: [
        'Click "New Template" button',
        'Select type: "Action"',
        'Name: "Client Kickoff Call"',
        'Description: "Initial call to align on goals, timeline, and success metrics with new client"',
        'Category: "Client Management"',
        'Tags: "onboarding", "kickoff", "client", "meeting"',
        'Click "Save Template"'
      ],
      result: 'Your template is saved and will appear when searching for "kickoff" or "onboarding" in any playbook. You can now use it consistently across all client onboarding workflows.'
    }
  ]
};
