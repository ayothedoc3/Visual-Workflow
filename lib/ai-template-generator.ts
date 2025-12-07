// AI Template Generator
// Generates individual templates based on natural language descriptions

import type { Template } from './storage';

export interface TemplateGenerationRequest {
  prompt: string;
  nodeType?: 'issue' | 'action' | 'resource' | 'deliverable';
  category?: string;
  context?: string;
}

// Common template patterns for each node type
const TEMPLATE_PATTERNS = {
  issue: [
    'problem', 'bug', 'error', 'defect', 'blocker', 'challenge', 'risk',
    'concern', 'complaint', 'incident', 'outage', 'failure'
  ],
  action: [
    'task', 'step', 'execute', 'perform', 'create', 'build', 'implement',
    'configure', 'setup', 'review', 'approve', 'process', 'handle'
  ],
  resource: [
    'tool', 'document', 'template', 'guide', 'system', 'software', 'platform',
    'database', 'api', 'service', 'file', 'asset', 'library'
  ],
  deliverable: [
    'output', 'result', 'product', 'deliverable', 'report', 'dashboard',
    'document', 'artifact', 'completion', 'milestone', 'release'
  ],
};

// Category mappings
const CATEGORY_KEYWORDS = {
  'Client Onboarding': ['client', 'customer', 'onboarding', 'welcome', 'signup'],
  'Project Management': ['project', 'task', 'milestone', 'planning', 'tracking'],
  'Content Creation': ['content', 'article', 'blog', 'writing', 'publishing'],
  'Customer Support': ['support', 'ticket', 'help', 'issue', 'customer service'],
  'Sales': ['sales', 'lead', 'prospect', 'deal', 'quote', 'proposal'],
  'Development': ['code', 'develop', 'build', 'deploy', 'test', 'bug fix'],
  'Marketing': ['campaign', 'email', 'social media', 'advertising', 'promotion'],
  'HR': ['hiring', 'recruiting', 'employee', 'training', 'onboarding'],
  'Finance': ['invoice', 'payment', 'budget', 'expense', 'accounting'],
  'Operations': ['process', 'workflow', 'procedure', 'operations', 'logistics'],
};

export async function generateTemplate(
  request: TemplateGenerationRequest
): Promise<Template> {
  const { prompt, nodeType, category, context } = request;

  // Detect node type from prompt if not provided
  const detectedNodeType = nodeType || detectNodeType(prompt);

  // Detect category from prompt if not provided
  const detectedCategory = category || detectCategory(prompt);

  // Generate template name from prompt
  const templateName = generateTemplateName(prompt, detectedNodeType);

  // Generate description
  const description = generateDescription(prompt, detectedNodeType);

  // Generate tags
  const tags = generateTags(prompt, detectedNodeType, detectedCategory);

  // Create template
  const template: Template = {
    id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    nodeType: detectedNodeType,
    name: templateName,
    description: description,
    category: detectedCategory,
    tags: tags,
    metadata: {
      aiGenerated: true,
      prompt: prompt,
      context: context,
    },
    createdBy: 'AI Generated',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return template;
}

// Detect node type from prompt
function detectNodeType(prompt: string): 'issue' | 'action' | 'resource' | 'deliverable' {
  const lowerPrompt = prompt.toLowerCase();

  // Score each node type
  const scores = {
    issue: 0,
    action: 0,
    resource: 0,
    deliverable: 0,
  };

  // Check for pattern matches
  for (const [nodeType, patterns] of Object.entries(TEMPLATE_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerPrompt.includes(pattern)) {
        scores[nodeType as keyof typeof scores] += 1;
      }
    }
  }

  // Find highest score
  let maxScore = 0;
  let detectedType: 'issue' | 'action' | 'resource' | 'deliverable' = 'action';

  for (const [nodeType, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedType = nodeType as 'issue' | 'action' | 'resource' | 'deliverable';
    }
  }

  // Default to action if no clear match
  return maxScore > 0 ? detectedType : 'action';
}

// Detect category from prompt
function detectCategory(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        return category;
      }
    }
  }

  return 'General';
}

// Generate template name from prompt
function generateTemplateName(prompt: string, nodeType: string): string {
  // Clean and capitalize prompt
  let name = prompt.trim();

  // Remove common prefixes
  name = name.replace(/^(create|add|generate|make|build|setup|configure)\s+/i, '');
  name = name.replace(/^(a|an|the)\s+/i, '');

  // Capitalize first letter of each word
  name = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Limit length
  if (name.length > 50) {
    name = name.substring(0, 47) + '...';
  }

  return name;
}

// Generate description
function generateDescription(prompt: string, nodeType: string): string {
  const typeDescriptions = {
    issue: 'Identify and document this issue',
    action: 'Execute this action',
    resource: 'Use this resource',
    deliverable: 'Deliver this output',
  };

  const baseDescription = typeDescriptions[nodeType as keyof typeof typeDescriptions];

  return `${baseDescription}: ${prompt}`;
}

// Generate tags
function generateTags(prompt: string, nodeType: string, category: string): string[] {
  const tags: string[] = [nodeType, 'ai-generated'];

  // Add category as tag
  if (category && category !== 'General') {
    tags.push(category.toLowerCase().replace(/\s+/g, '-'));
  }

  // Extract key words from prompt (simple approach)
  const lowerPrompt = prompt.toLowerCase();
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];

  const words = lowerPrompt.split(/\s+/).filter(word =>
    word.length > 3 && !commonWords.includes(word)
  );

  // Add first 3 meaningful words as tags
  tags.push(...words.slice(0, 3));

  return [...new Set(tags)]; // Remove duplicates
}

// Generate multiple templates at once
export async function generateBulkTemplates(
  prompts: string[],
  options?: { nodeType?: string; category?: string; context?: string }
): Promise<Template[]> {
  const templates: Template[] = [];

  for (const prompt of prompts) {
    const template = await generateTemplate({
      prompt,
      nodeType: options?.nodeType as any,
      category: options?.category,
      context: options?.context,
    });
    templates.push(template);
  }

  return templates;
}
