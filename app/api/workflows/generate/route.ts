import { NextRequest, NextResponse } from 'next/server';
import { generateWorkflow, generateFromMeetingTranscript } from '@/lib/ai-workflow-generator';
import { templatesApi } from '@/lib/api-client';

// POST /api/workflows/generate - Generate workflow from prompt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, context, mode, transcript, attendees } = body;

    if (!prompt && !transcript) {
      return NextResponse.json(
        { error: 'Either prompt or transcript is required' },
        { status: 400 }
      );
    }

    let workflow;

    if (mode === 'meeting' && transcript) {
      // Generate from meeting transcript
      workflow = await generateFromMeetingTranscript({
        transcript,
        attendees,
        context,
      });
    } else {
      // Generate from text prompt
      // Fetch templates for context
      let templates;
      try {
        templates = await templatesApi.list();
      } catch (error) {
        console.warn('Could not fetch templates:', error);
        templates = [];
      }

      workflow = await generateWorkflow({
        prompt,
        context,
        templates,
      });
    }

    return NextResponse.json(workflow, { status: 200 });
  } catch (error) {
    console.error('Error generating workflow:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/workflows/generate/patterns - Get available workflow patterns
export async function GET() {
  try {
    const patterns = [
      {
        id: 'client-onboarding',
        name: 'Client Onboarding',
        description: 'Complete client onboarding process from signup to activation',
        keywords: ['client', 'onboard', 'customer'],
        example: 'Create a client onboarding workflow',
      },
      {
        id: 'content-creation',
        name: 'Content Creation',
        description: 'End-to-end content creation and publishing workflow',
        keywords: ['content', 'blog', 'social media'],
        example: 'Create a blog post workflow',
      },
      {
        id: 'project-delivery',
        name: 'Project Delivery',
        description: 'Project implementation and delivery process',
        keywords: ['project', 'deliver', 'implementation'],
        example: 'Create a project delivery workflow',
      },
      {
        id: 'support-ticket',
        name: 'Support Ticket',
        description: 'Customer support ticket handling workflow',
        keywords: ['support', 'ticket', 'issue'],
        example: 'Create a support ticket workflow',
      },
      {
        id: 'hiring',
        name: 'Hiring Process',
        description: 'End-to-end recruitment and onboarding workflow',
        keywords: ['hire', 'recruit', 'interview'],
        example: 'Create a hiring workflow',
      },
      {
        id: 'sales',
        name: 'Sales Process',
        description: 'Lead qualification to deal closure workflow',
        keywords: ['sales', 'lead', 'proposal'],
        example: 'Create a sales workflow',
      },
    ];

    return NextResponse.json({ patterns }, { status: 200 });
  } catch (error) {
    console.error('Error fetching patterns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patterns' },
      { status: 500 }
    );
  }
}
