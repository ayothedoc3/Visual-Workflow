import { NextRequest, NextResponse } from 'next/server';
import { generatePlaybook } from '@/lib/ai-playbook-generator';

// POST /api/playbooks/generate - Generate complete playbook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, prompt, transcript, attendees, context, includeOutputs } = body;

    if (source !== 'meeting' && source !== 'prompt') {
      return NextResponse.json(
        { error: 'Source must be either "meeting" or "prompt"' },
        { status: 400 }
      );
    }

    if (source === 'meeting' && !transcript) {
      return NextResponse.json(
        { error: 'Transcript is required for meeting source' },
        { status: 400 }
      );
    }

    if (source === 'prompt' && !prompt) {
      return NextResponse.json(
        { error: 'Prompt is required for prompt source' },
        { status: 400 }
      );
    }

    const playbook = await generatePlaybook({
      source,
      prompt,
      transcript,
      attendees,
      context,
      includeOutputs,
    });

    return NextResponse.json(playbook, { status: 200 });
  } catch (error) {
    console.error('Error generating playbook:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate playbook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/playbooks/generate/outputs - Get available output types
export async function GET() {
  try {
    const outputs = [
      {
        type: 'workflow',
        title: 'Visual Workflow Diagram',
        description: 'Interactive workflow diagram with nodes and connections',
        format: 'json',
      },
      {
        type: 'sop',
        title: 'Standard Operating Procedure',
        description: 'Step-by-step written procedure document',
        format: 'markdown',
      },
      {
        type: 'templates',
        title: 'Templates Library',
        description: 'Reusable templates extracted from workflow',
        format: 'markdown',
      },
      {
        type: 'clickup',
        title: 'ClickUp Task Structure',
        description: 'Pre-configured ClickUp tasks ready to import',
        format: 'json',
      },
      {
        type: 'n8n',
        title: 'n8n Automation Workflow',
        description: 'Ready-to-import n8n automation code',
        format: 'json',
      },
      {
        type: 'training-checklist',
        title: 'Training Checklist',
        description: 'Onboarding checklist for new team members',
        format: 'markdown',
      },
      {
        type: 'executive-summary',
        title: 'Executive Summary',
        description: 'High-level overview for leadership',
        format: 'markdown',
      },
      {
        type: 'faq',
        title: 'FAQ Document',
        description: 'Frequently asked questions and answers',
        format: 'markdown',
      },
      {
        type: 'metrics',
        title: 'Success Metrics',
        description: 'KPIs and performance tracking',
        format: 'markdown',
      },
    ];

    return NextResponse.json({ outputs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching output types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch output types' },
      { status: 500 }
    );
  }
}
