// AI Workflow Generator
// Smart pattern-based workflow generation with template integration
// Ready for Claude API upgrade

import { Node, Edge } from 'reactflow';
import type { Template } from './storage';

export interface GenerateWorkflowRequest {
  prompt: string;
  context?: string;
  templates?: Template[];
}

export interface GeneratedWorkflow {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  metadata: {
    generatedAt: string;
    prompt: string;
    confidence: number;
    suggestions: string[];
  };
}

// Workflow patterns library
const WORKFLOW_PATTERNS = {
  'client onboarding': {
    keywords: ['client', 'onboard', 'customer', 'new client'],
    structure: [
      { type: 'issue', label: 'New Client Signup' },
      { type: 'action', label: 'Discovery Call' },
      { type: 'resource', label: 'Onboarding Checklist' },
      { type: 'action', label: 'Contract Signing' },
      { type: 'resource', label: 'Welcome Pack' },
      { type: 'action', label: 'Kickoff Meeting' },
      { type: 'deliverable', label: 'Client Portal Access' },
    ],
  },
  'content creation': {
    keywords: ['content', 'blog', 'social media', 'post', 'article'],
    structure: [
      { type: 'issue', label: 'Content Request' },
      { type: 'action', label: 'Research Topic' },
      { type: 'resource', label: 'Content Template' },
      { type: 'action', label: 'Write Draft' },
      { type: 'action', label: 'Review & Edit' },
      { type: 'resource', label: 'Brand Guidelines' },
      { type: 'deliverable', label: 'Published Content' },
    ],
  },
  'project delivery': {
    keywords: ['project', 'deliver', 'implementation', 'deployment'],
    structure: [
      { type: 'issue', label: 'Project Kickoff' },
      { type: 'action', label: 'Requirements Gathering' },
      { type: 'resource', label: 'Project Plan' },
      { type: 'action', label: 'Development' },
      { type: 'action', label: 'Testing' },
      { type: 'action', label: 'Client Review' },
      { type: 'deliverable', label: 'Final Delivery' },
    ],
  },
  'support ticket': {
    keywords: ['support', 'ticket', 'issue', 'problem', 'bug', 'help'],
    structure: [
      { type: 'issue', label: 'Support Ticket Received' },
      { type: 'action', label: 'Triage & Categorize' },
      { type: 'action', label: 'Investigation' },
      { type: 'resource', label: 'Knowledge Base' },
      { type: 'action', label: 'Resolution' },
      { type: 'deliverable', label: 'Ticket Closed' },
    ],
  },
  'hiring': {
    keywords: ['hire', 'recruit', 'candidate', 'interview', 'job'],
    structure: [
      { type: 'issue', label: 'Hiring Need Identified' },
      { type: 'action', label: 'Post Job Opening' },
      { type: 'resource', label: 'Job Description' },
      { type: 'action', label: 'Screen Candidates' },
      { type: 'action', label: 'Conduct Interviews' },
      { type: 'action', label: 'Make Offer' },
      { type: 'deliverable', label: 'New Hire Onboarded' },
    ],
  },
  'sales': {
    keywords: ['sales', 'lead', 'prospect', 'deal', 'proposal'],
    structure: [
      { type: 'issue', label: 'New Lead' },
      { type: 'action', label: 'Qualification Call' },
      { type: 'action', label: 'Send Proposal' },
      { type: 'resource', label: 'Pricing Template' },
      { type: 'action', label: 'Follow Up' },
      { type: 'action', label: 'Negotiation' },
      { type: 'deliverable', label: 'Deal Closed' },
    ],
  },
};

// Auto-layout algorithm
function generateLayout(nodes: { type: string; label: string }[]): Node[] {
  const VERTICAL_SPACING = 150;
  const HORIZONTAL_OFFSET = 50;
  const NODE_WIDTH = 250;

  return nodes.map((node, index) => {
    const xOffset = (index % 2) * HORIZONTAL_OFFSET; // Alternate slight offset for visual interest

    return {
      id: `node-${index + 1}`,
      type: node.type as any,
      position: {
        x: 300 + xOffset,
        y: 100 + index * VERTICAL_SPACING,
      },
      data: {
        label: node.label,
        description: '',
      },
    };
  });
}

// Generate edges (connections)
function generateEdges(nodes: Node[]): Edge[] {
  const edges: Edge[] = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `edge-${i + 1}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    });
  }

  return edges;
}

// Pattern matching
function matchPattern(prompt: string): keyof typeof WORKFLOW_PATTERNS | null {
  const lowerPrompt = prompt.toLowerCase();

  for (const [patternName, pattern] of Object.entries(WORKFLOW_PATTERNS)) {
    if (pattern.keywords.some(keyword => lowerPrompt.includes(keyword))) {
      return patternName as keyof typeof WORKFLOW_PATTERNS;
    }
  }

  return null;
}

// Smart workflow generation
export async function generateWorkflow(
  request: GenerateWorkflowRequest
): Promise<GeneratedWorkflow> {
  const { prompt, context, templates } = request;

  // Match pattern
  const matchedPattern = matchPattern(prompt);

  let structure;
  let workflowName;
  let description;
  let confidence = 0.5; // Default confidence

  if (matchedPattern) {
    // Use matched pattern
    structure = WORKFLOW_PATTERNS[matchedPattern].structure;
    workflowName = formatWorkflowName(matchedPattern);
    description = `Generated workflow for ${matchedPattern}`;
    confidence = 0.9; // High confidence for pattern match
  } else {
    // Generic workflow structure
    structure = [
      { type: 'issue', label: 'Start' },
      { type: 'action', label: 'Process' },
      { type: 'deliverable', label: 'Complete' },
    ];
    workflowName = 'Generated Workflow';
    description = 'Generic workflow structure';
    confidence = 0.4; // Lower confidence for generic
  }

  // Generate nodes with auto-layout
  const nodes = generateLayout(structure);

  // Generate edges
  const edges = generateEdges(nodes);

  // Generate suggestions
  const suggestions = generateSuggestions(matchedPattern, templates);

  return {
    name: workflowName,
    description,
    nodes,
    edges,
    metadata: {
      generatedAt: new Date().toISOString(),
      prompt,
      confidence,
      suggestions,
    },
  };
}

// Format workflow name
function formatWorkflowName(pattern: string): string {
  return pattern
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + ' Workflow';
}

// Generate helpful suggestions
function generateSuggestions(
  pattern: keyof typeof WORKFLOW_PATTERNS | null,
  templates?: Template[]
): string[] {
  const suggestions: string[] = [];

  if (pattern) {
    suggestions.push(`✓ Pattern matched: ${formatWorkflowName(pattern)}`);
    suggestions.push('💡 Customize node labels to match your specific process');
  } else {
    suggestions.push('⚠️ No specific pattern matched - using generic structure');
    suggestions.push('💡 Try keywords like "client onboarding", "content creation", or "project delivery"');
  }

  if (templates && templates.length > 0) {
    suggestions.push(`📚 ${templates.length} templates available for customization`);
  }

  suggestions.push('🎨 Drag nodes to adjust layout');
  suggestions.push('🔗 Add connections by dragging from node handles');

  return suggestions;
}

// Co-pilot suggestions (watches workflow as you build)
export interface CopilotSuggestion {
  type: 'optimization' | 'completion' | 'warning' | 'best-practice';
  title: string;
  message: string;
  action?: string;
  data?: any;
}

export function analyzeworkflowForSuggestions(
  nodes: Node[],
  edges: Edge[],
  templates?: Template[]
): CopilotSuggestion[] {
  const suggestions: CopilotSuggestion[] = [];

  // Check for missing connections
  const disconnectedNodes = nodes.filter(node => {
    const hasIncoming = edges.some(edge => edge.target === node.id);
    const hasOutgoing = edges.some(edge => edge.source === node.id);
    return !hasIncoming && !hasOutgoing && nodes.indexOf(node) !== 0;
  });

  if (disconnectedNodes.length > 0) {
    suggestions.push({
      type: 'warning',
      title: 'Disconnected Nodes',
      message: `${disconnectedNodes.length} node(s) are not connected to the workflow`,
      action: 'Connect nodes to create workflow flow',
    });
  }

  // Check for missing deliverables
  const hasDeliverable = nodes.some(node => node.type === 'deliverable');
  if (nodes.length > 2 && !hasDeliverable) {
    suggestions.push({
      type: 'best-practice',
      title: 'Add Deliverable',
      message: 'Consider adding a deliverable node to define the workflow outcome',
      action: 'Add deliverable from node selector',
    });
  }

  // Check for missing resources
  const hasResource = nodes.some(node => node.type === 'resource');
  const hasMultipleActions = nodes.filter(node => node.type === 'action').length > 2;
  if (hasMultipleActions && !hasResource) {
    suggestions.push({
      type: 'best-practice',
      title: 'Add Resources',
      message: 'Workflows with multiple actions often benefit from resource nodes',
      action: 'Add resource nodes for tools, templates, or documentation',
    });
  }

  // Suggest auto-layout if nodes are clustered
  const positions = nodes.map(n => n.position);
  const avgDistance = positions.reduce((sum, pos, i) => {
    if (i === 0) return 0;
    const prev = positions[i - 1];
    const dist = Math.sqrt(Math.pow(pos.x - prev.x, 2) + Math.pow(pos.y - prev.y, 2));
    return sum + dist;
  }, 0) / Math.max(positions.length - 1, 1);

  if (avgDistance < 100 && nodes.length > 3) {
    suggestions.push({
      type: 'optimization',
      title: 'Improve Layout',
      message: 'Nodes appear clustered - consider using auto-layout',
      action: 'Use auto-arrange to organize nodes',
    });
  }

  return suggestions;
}

// Meeting transcript → Workflow converter
export interface MeetingToWorkflowRequest {
  transcript: string;
  attendees?: string[];
  context?: string;
}

export async function generateFromMeetingTranscript(
  request: MeetingToWorkflowRequest
): Promise<GeneratedWorkflow> {
  const { transcript, attendees, context } = request;

  // Extract key phrases and action items from transcript
  const lowerTranscript = transcript.toLowerCase();

  // Detect workflow type from transcript
  let detectedPattern: keyof typeof WORKFLOW_PATTERNS | null = null;
  let maxMatches = 0;

  for (const [patternName, pattern] of Object.entries(WORKFLOW_PATTERNS)) {
    const matches = pattern.keywords.filter(keyword =>
      lowerTranscript.includes(keyword)
    ).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      detectedPattern = patternName as keyof typeof WORKFLOW_PATTERNS;
    }
  }

  // Extract action items (simple heuristic)
  const actionPhrases = [
    'we need to',
    'action item',
    'next step',
    'should do',
    'have to',
    'must',
    'will',
  ];

  const actionItems: string[] = [];
  const sentences = transcript.split(/[.!?]+/);

  sentences.forEach(sentence => {
    const lower = sentence.toLowerCase();
    if (actionPhrases.some(phrase => lower.includes(phrase))) {
      actionItems.push(sentence.trim());
    }
  });

  // Generate workflow
  const prompt = detectedPattern
    ? `${detectedPattern} workflow`
    : actionItems.length > 0
      ? actionItems[0]
      : 'meeting discussion';

  const workflow = await generateWorkflow({ prompt, context });

  // Add meeting-specific metadata
  workflow.metadata.suggestions.unshift(
    `📝 Generated from meeting transcript (${sentences.length} sentences analyzed)`,
    `👥 Attendees: ${attendees?.join(', ') || 'Not specified'}`,
    `🎯 ${actionItems.length} action items detected`
  );

  if (actionItems.length > 0) {
    workflow.metadata.suggestions.push(
      '💡 Consider customizing nodes based on action items:'
    );
    actionItems.slice(0, 3).forEach((item, i) => {
      workflow.metadata.suggestions.push(`   ${i + 1}. ${item.substring(0, 60)}...`);
    });
  }

  return workflow;
}
