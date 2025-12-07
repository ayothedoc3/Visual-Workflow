import { NextRequest, NextResponse } from 'next/server';
import { generateTemplate } from '@/lib/ai-template-generator';

// POST /api/templates/generate - Generate a single template with AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, nodeType, category, context } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const template = await generateTemplate({
      prompt,
      nodeType,
      category,
      context,
    });

    return NextResponse.json(template, { status: 200 });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate template',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
