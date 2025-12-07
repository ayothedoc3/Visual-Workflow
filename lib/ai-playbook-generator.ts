// AI Playbook Generator
// Creates complete operational playbooks from meetings or prompts
// Generates: Workflow + SOP + Templates + ClickUp Structure + n8n Code + More

import { Node, Edge } from 'reactflow';
import { generateWorkflow, generateFromMeetingTranscript } from './ai-workflow-generator';
import type { Template } from './storage';

export interface PlaybookGenerationRequest {
  source: 'meeting' | 'prompt';
  prompt?: string;
  transcript?: string;
  attendees?: string[];
  context?: string;
  includeOutputs?: PlaybookOutputType[];
}

export type PlaybookOutputType =
  | 'workflow'
  | 'sop'
  | 'templates'
  | 'clickup'
  | 'n8n'
  | 'training-checklist'
  | 'executive-summary'
  | 'faq'
  | 'metrics';

export interface PlaybookOutput {
  type: PlaybookOutputType;
  title: string;
  content: string;
  format: 'markdown' | 'json' | 'javascript' | 'text';
  description: string;
}

export interface GeneratedPlaybook {
  name: string;
  description: string;
  workflow: {
    name: string;
    nodes: Node[];
    edges: Edge[];
  };
  outputs: PlaybookOutput[];
  templates: Template[];
  metadata: {
    generatedAt: string;
    source: string;
    confidence: number;
  };
}

// Generate complete playbook
export async function generatePlaybook(
  request: PlaybookGenerationRequest
): Promise<GeneratedPlaybook> {
  const { source, prompt, transcript, attendees, context, includeOutputs } = request;

  // Default outputs if not specified
  const outputs = includeOutputs || [
    'workflow',
    'sop',
    'templates',
    'executive-summary',
    'training-checklist',
  ];

  // Generate workflow first
  let workflowData;
  if (source === 'meeting' && transcript) {
    workflowData = await generateFromMeetingTranscript({
      transcript,
      attendees,
      context,
    });
  } else if (prompt) {
    workflowData = await generateWorkflow({ prompt, context });
  } else {
    throw new Error('Either prompt or transcript is required');
  }

  // Extract workflow details
  const playbookName = workflowData.name.replace(' Workflow', ' Playbook');
  const description = `Complete operational playbook for ${workflowData.name.toLowerCase()}`;

  // Generate all outputs
  const generatedOutputs: PlaybookOutput[] = [];
  const generatedTemplates: Template[] = [];

  for (const outputType of outputs) {
    const output = generateOutput(outputType, workflowData, { prompt, transcript, context });
    if (output) {
      generatedOutputs.push(output);

      // Extract templates from output
      if (outputType === 'templates') {
        const templates = extractTemplatesFromWorkflow(workflowData);
        generatedTemplates.push(...templates);
      }
    }
  }

  return {
    name: playbookName,
    description,
    workflow: {
      name: workflowData.name,
      nodes: workflowData.nodes,
      edges: workflowData.edges,
    },
    outputs: generatedOutputs,
    templates: generatedTemplates,
    metadata: {
      generatedAt: new Date().toISOString(),
      source: source === 'meeting' ? 'meeting-transcript' : 'text-prompt',
      confidence: workflowData.metadata.confidence,
    },
  };
}

// Generate specific output type
function generateOutput(
  type: PlaybookOutputType,
  workflowData: any,
  context: { prompt?: string; transcript?: string; context?: string }
): PlaybookOutput | null {
  switch (type) {
    case 'workflow':
      return {
        type: 'workflow',
        title: 'Visual Workflow Diagram',
        content: JSON.stringify(
          {
            name: workflowData.name,
            nodes: workflowData.nodes,
            edges: workflowData.edges,
          },
          null,
          2
        ),
        format: 'json',
        description: 'Complete workflow structure with nodes and connections',
      };

    case 'sop':
      return generateSOP(workflowData);

    case 'templates':
      return generateTemplatesDoc(workflowData);

    case 'clickup':
      return generateClickUpStructure(workflowData);

    case 'n8n':
      return generateN8nAutomation(workflowData);

    case 'training-checklist':
      return generateTrainingChecklist(workflowData);

    case 'executive-summary':
      return generateExecutiveSummary(workflowData, context);

    case 'faq':
      return generateFAQ(workflowData);

    case 'metrics':
      return generateMetrics(workflowData);

    default:
      return null;
  }
}

// Generate SOP (Standard Operating Procedure)
function generateSOP(workflowData: any): PlaybookOutput {
  const steps = workflowData.nodes
    .map((node: Node, index: number) => {
      const stepNumber = index + 1;
      const nodeType = node.type?.toUpperCase() || 'STEP';
      const label = node.data?.label || 'Untitled';

      let stepDescription = '';
      switch (node.type) {
        case 'issue':
          stepDescription = `Identify and document: ${label}`;
          break;
        case 'action':
          stepDescription = `Execute: ${label}`;
          break;
        case 'resource':
          stepDescription = `Use resource: ${label}`;
          break;
        case 'deliverable':
          stepDescription = `Deliver: ${label}`;
          break;
        default:
          stepDescription = label;
      }

      return `### Step ${stepNumber}: ${label}\n\n**Type:** ${nodeType}\n\n**Description:** ${stepDescription}\n\n**Actions:**\n- Complete this step before proceeding\n- Document any issues or blockers\n- Update status in tracking system\n`;
    })
    .join('\n\n');

  const content = `# Standard Operating Procedure: ${workflowData.name}

## Overview

This SOP defines the step-by-step process for ${workflowData.name.toLowerCase()}.

## Purpose

To ensure consistent and efficient execution of this workflow across all team members.

## Scope

This procedure applies to all team members involved in ${workflowData.name.toLowerCase()}.

## Procedure

${steps}

## Quality Checks

- [ ] All steps completed in order
- [ ] Documentation updated
- [ ] Stakeholders notified
- [ ] Results validated

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| ${new Date().toISOString().split('T')[0]} | 1.0 | Initial creation | AI Generated |

---

*Generated with E8Matrix Visual Workflow Builder*
`;

  return {
    type: 'sop',
    title: 'Standard Operating Procedure',
    content,
    format: 'markdown',
    description: 'Step-by-step written procedure document',
  };
}

// Generate Templates Documentation
function generateTemplatesDoc(workflowData: any): PlaybookOutput {
  const templates = extractTemplatesFromWorkflow(workflowData);

  const templatesList = templates
    .map(
      (t, i) => `### ${i + 1}. ${t.name}

**Category:** ${t.category}
**Type:** ${t.nodeType}
**Description:** ${t.description || 'No description'}

**When to use:** Use this template when ${t.name.toLowerCase()}

---
`
    )
    .join('\n');

  const content = `# Templates Library: ${workflowData.name}

## Available Templates

This playbook includes ${templates.length} reusable templates:

${templatesList}

## How to Use Templates

1. Navigate to Templates section
2. Select appropriate template
3. Customize for your specific needs
4. Add to workflow

---

*Generated with E8Matrix Visual Workflow Builder*
`;

  return {
    type: 'templates',
    title: 'Templates Documentation',
    content,
    format: 'markdown',
    description: 'Reusable templates extracted from workflow',
  };
}

// Generate ClickUp Structure
function generateClickUpStructure(workflowData: any): PlaybookOutput {
  const tasks = workflowData.nodes.map((node: Node, index: number) => ({
    name: node.data?.label || `Task ${index + 1}`,
    description: `${node.type}: ${node.data?.label}`,
    status: 'to do',
    priority: node.type === 'issue' ? 'high' : node.type === 'deliverable' ? 'high' : 'normal',
    assignees: [],
    tags: [node.type || 'general', workflowData.name.toLowerCase().replace(/\s+/g, '-')],
    customFields: {
      nodeType: node.type,
      workflowStep: index + 1,
    },
  }));

  const structure = {
    space: {
      name: workflowData.name,
      lists: [
        {
          name: 'Workflow Tasks',
          tasks: tasks,
        },
      ],
    },
  };

  const content = JSON.stringify(structure, null, 2);

  return {
    type: 'clickup',
    title: 'ClickUp Task Structure',
    content,
    format: 'json',
    description: 'Pre-configured ClickUp tasks and structure',
  };
}

// Generate n8n Automation
function generateN8nAutomation(workflowData: any): PlaybookOutput {
  const nodes = workflowData.nodes.map((node: Node, index: number) => ({
    parameters: {
      functionCode: `// ${node.data?.label}\nreturn items;`,
    },
    name: node.data?.label || `Step ${index + 1}`,
    type: 'n8n-nodes-base.code',
    typeVersion: 1,
    position: [node.position.x, node.position.y],
  }));

  const connections = {};
  workflowData.edges.forEach((edge: Edge, index: number) => {
    const sourceNode = workflowData.nodes.find((n: Node) => n.id === edge.source);
    if (sourceNode && connections) {
      (connections as any)[sourceNode.data?.label || edge.source] = {
        main: [[{ node: edge.target, type: 'main', index: 0 }]],
      };
    }
  });

  const n8nWorkflow = {
    name: workflowData.name,
    nodes: nodes,
    connections: connections,
    active: false,
    settings: {},
  };

  const content = JSON.stringify(n8nWorkflow, null, 2);

  return {
    type: 'n8n',
    title: 'n8n Automation Workflow',
    content,
    format: 'json',
    description: 'Ready-to-import n8n automation workflow',
  };
}

// Generate Training Checklist
function generateTrainingChecklist(workflowData: any): PlaybookOutput {
  const checklistItems = workflowData.nodes
    .map(
      (node: Node, index: number) =>
        `- [ ] Understand ${node.type}: ${node.data?.label}\n- [ ] Practice executing this step\n- [ ] Know when to escalate issues`
    )
    .join('\n');

  const content = `# Training Checklist: ${workflowData.name}

## Onboarding Requirements

New team members must complete the following before working independently on this workflow:

### Knowledge Requirements

${checklistItems}

### Skills Assessment

- [ ] Can explain the entire workflow from memory
- [ ] Knows all tools and resources required
- [ ] Understands quality standards
- [ ] Can identify and escalate blockers

### Sign-Off

- Trainee: _________________ Date: _______
- Trainer: _________________ Date: _______

---

*Generated with E8Matrix Visual Workflow Builder*
`;

  return {
    type: 'training-checklist',
    title: 'Training & Onboarding Checklist',
    content,
    format: 'markdown',
    description: 'Checklist for training new team members',
  };
}

// Generate Executive Summary
function generateExecutiveSummary(workflowData: any, context: any): PlaybookOutput {
  const actionCount = workflowData.nodes.filter((n: Node) => n.type === 'action').length;
  const resourceCount = workflowData.nodes.filter((n: Node) => n.type === 'resource').length;
  const deliverableCount = workflowData.nodes.filter((n: Node) => n.type === 'deliverable').length;

  const content = `# Executive Summary: ${workflowData.name}

## Overview

${workflowData.description || `Complete operational playbook for ${workflowData.name.toLowerCase()}.`}

## Key Metrics

- **Total Steps:** ${workflowData.nodes.length}
- **Actions Required:** ${actionCount}
- **Resources Needed:** ${resourceCount}
- **Deliverables:** ${deliverableCount}

## Estimated Timeline

- **Setup Time:** 30-60 minutes
- **Execution Time:** 2-4 hours (first time), 1-2 hours (optimized)
- **Review Time:** 30 minutes

## Resource Requirements

- **Team Members:** 2-3 people recommended
- **Tools/Systems:** ${resourceCount} resources identified
- **Budget Impact:** Low - uses existing resources

## Success Criteria

- All ${workflowData.nodes.length} steps completed
- ${deliverableCount} deliverable(s) produced
- Quality checks passed
- Stakeholders satisfied

## Recommendations

1. **Immediate:** Review and customize workflow for your specific needs
2. **Short-term:** Assign team members and schedule training
3. **Long-term:** Automate repetitive steps, track metrics

## Next Steps

1. Review complete playbook documentation
2. Assign roles and responsibilities
3. Schedule kickoff meeting
4. Execute first workflow iteration
5. Gather feedback and optimize

---

*Generated: ${new Date().toLocaleDateString()}*
*Confidence: ${Math.round(workflowData.metadata.confidence * 100)}%*
`;

  return {
    type: 'executive-summary',
    title: 'Executive Summary',
    content,
    format: 'markdown',
    description: 'High-level overview for leadership',
  };
}

// Generate FAQ
function generateFAQ(workflowData: any): PlaybookOutput {
  const content = `# FAQ: ${workflowData.name}

## General Questions

**Q: What is this workflow for?**
A: This workflow provides a structured process for ${workflowData.name.toLowerCase()}.

**Q: Who should use this workflow?**
A: Any team member involved in ${workflowData.name.toLowerCase()}.

**Q: How long does it take?**
A: Approximately 2-4 hours for first execution, 1-2 hours once optimized.

## Process Questions

**Q: What if I encounter a blocker?**
A: Document the issue and escalate to your manager immediately.

**Q: Can steps be done in parallel?**
A: Some steps may be parallelized. Check the workflow diagram for dependencies.

**Q: What tools do I need?**
A: See the Resources section for required tools and templates.

## Quality Questions

**Q: How do I know if I'm done?**
A: Complete the quality checklist at the end of the SOP.

**Q: Who reviews my work?**
A: Follow your team's standard review process.

**Q: Where do I document issues?**
A: Use your team's standard issue tracking system.

---

*Last Updated: ${new Date().toLocaleDateString()}*
`;

  return {
    type: 'faq',
    title: 'Frequently Asked Questions',
    content,
    format: 'markdown',
    description: 'Common questions and answers',
  };
}

// Generate Metrics/KPIs
function generateMetrics(workflowData: any): PlaybookOutput {
  const content = `# Success Metrics: ${workflowData.name}

## Key Performance Indicators (KPIs)

### Efficiency Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cycle Time | < 2 hours | Start to finish duration |
| First-Time Success Rate | > 90% | % completed without rework |
| Resource Utilization | > 80% | % of available resources used |

### Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Error Rate | < 5% | % of workflows with errors |
| Customer Satisfaction | > 4.5/5 | Post-workflow survey |
| Compliance Rate | 100% | % following all steps |

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cost per Execution | Baseline | Total cost / # executions |
| ROI | > 200% | Value created / cost |
| Adoption Rate | > 75% | % of team using workflow |

## Tracking Instructions

1. Record start/end times for each execution
2. Log any errors or rework
3. Collect user feedback
4. Calculate metrics weekly
5. Review and optimize monthly

## Dashboard

Track these metrics in your team dashboard:
- Weekly execution count
- Average cycle time
- Error trend
- User satisfaction trend

---

*Review these metrics monthly and adjust targets as needed*
`;

  return {
    type: 'metrics',
    title: 'Success Metrics & KPIs',
    content,
    format: 'markdown',
    description: 'Key performance indicators and tracking',
  };
}

// Extract templates from workflow
function extractTemplatesFromWorkflow(workflowData: any): Template[] {
  return workflowData.nodes
    .filter((node: Node) => node.type === 'resource' || node.type === 'action')
    .map((node: Node, index: number): Template => ({
      id: `template-${index + 1}`,
      nodeType: node.type as any,
      name: node.data?.label || `Template ${index + 1}`,
      description: `Template for ${node.data?.label}`,
      category: workflowData.name.replace(' Workflow', ''),
      tags: [node.type || '', 'generated'],
      metadata: {
        sourceWorkflow: workflowData.name,
        nodeId: node.id,
      },
      createdBy: 'AI Generated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
}
