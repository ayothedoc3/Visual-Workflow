// Template Variants System
// CEO Request: "If you select Discovery Call, it changes the entire rest of the formula"
// Each action template can have multiple variants with different outcomes

export interface TemplateVariant {
  id: string;
  name: string;
  description: string;
  outcome: string; // What this variant leads to
  suggestedResources: SuggestedNode[];
  suggestedDeliverables: SuggestedNode[];
}

export interface SuggestedNode {
  templateName: string;
  description: string;
  defaultSoftware?: string; // Pre-fill software field
  defaultAssignedTo?: string; // Pre-fill person field
}

// Predefined variants for common action templates
// Following CEO's "finite pathways" approach: 4-5 outcomes per action
export const ACTION_TEMPLATE_VARIANTS: Record<string, TemplateVariant[]> = {
  'Discovery Call': [
    {
      id: 'discovery-to-kpi',
      name: 'KPI Analysis Path',
      description: 'Focus on metrics and performance tracking',
      outcome: 'KPI Deliverable',
      suggestedResources: [
        {
          templateName: 'Analytics Dashboard',
          description: 'Current performance metrics',
          defaultSoftware: 'Google Analytics',
        },
        {
          templateName: 'Historical Data',
          description: 'Past 6 months performance',
          defaultSoftware: 'Data Warehouse',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'KPI Report',
          description: 'Key performance indicators and targets',
        },
        {
          templateName: 'Metrics Dashboard',
          description: 'Visual representation of KPIs',
        },
      ],
    },
    {
      id: 'discovery-to-sales',
      name: 'Sales Pipeline Path',
      description: 'Focus on sales process and conversion',
      outcome: 'Sales Proposal',
      suggestedResources: [
        {
          templateName: 'Pricing Sheet',
          description: 'Current pricing and packages',
          defaultSoftware: 'CRM',
        },
        {
          templateName: 'Case Studies',
          description: 'Similar client success stories',
          defaultSoftware: 'Google Drive',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'Sales Proposal',
          description: 'Customized proposal with pricing',
        },
        {
          templateName: 'ROI Projection',
          description: 'Expected return on investment',
        },
      ],
    },
    {
      id: 'discovery-to-strategy',
      name: 'Strategy Development Path',
      description: 'Focus on long-term planning',
      outcome: 'Strategy Playbook',
      suggestedResources: [
        {
          templateName: 'Market Research',
          description: 'Industry trends and analysis',
          defaultSoftware: 'Research Database',
        },
        {
          templateName: 'Competitor Analysis',
          description: 'Competitive landscape review',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'Strategy Playbook',
          description: '12-month strategic plan',
        },
        {
          templateName: 'Action Roadmap',
          description: 'Phased implementation plan',
        },
      ],
    },
    {
      id: 'discovery-to-needs',
      name: 'Needs Assessment Path',
      description: 'Focus on identifying gaps and requirements',
      outcome: 'Needs Analysis',
      suggestedResources: [
        {
          templateName: 'Requirements Checklist',
          description: 'Standard requirements framework',
        },
        {
          templateName: 'Assessment Template',
          description: 'Gap analysis framework',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'Needs Analysis Report',
          description: 'Comprehensive needs assessment',
        },
        {
          templateName: 'Priority Matrix',
          description: 'Prioritized list of requirements',
        },
      ],
    },
    {
      id: 'discovery-to-qualification',
      name: 'Lead Qualification Path',
      description: 'Focus on qualifying the opportunity',
      outcome: 'Qualification Score',
      suggestedResources: [
        {
          templateName: 'Qualification Framework',
          description: 'BANT or similar framework',
          defaultSoftware: 'CRM',
        },
        {
          templateName: 'Scoring Matrix',
          description: 'Lead scoring criteria',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'Qualification Score',
          description: 'Lead qualification rating',
        },
        {
          templateName: 'Next Steps Doc',
          description: 'Recommended follow-up actions',
        },
      ],
    },
  ],

  'Client Onboarding': [
    {
      id: 'onboarding-standard',
      name: 'Standard Onboarding',
      description: 'Full-service onboarding process',
      outcome: 'Active Client Status',
      suggestedResources: [
        {
          templateName: 'Welcome Kit',
          description: 'Getting started materials',
          defaultSoftware: 'Google Drive',
        },
        {
          templateName: 'Access Credentials',
          description: 'System login information',
          defaultSoftware: 'Password Manager',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'Onboarding Checklist',
          description: 'Completed onboarding tasks',
        },
        {
          templateName: 'Account Setup Confirmation',
          description: 'All systems configured',
        },
      ],
    },
    {
      id: 'onboarding-expedited',
      name: 'Expedited Onboarding',
      description: 'Fast-track for urgent starts',
      outcome: 'Quick Start Package',
      suggestedResources: [
        {
          templateName: 'Quick Start Guide',
          description: 'Essential information only',
        },
        {
          templateName: 'Priority Setup Template',
          description: 'Minimum viable configuration',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'Quick Start Package',
          description: 'Essential setup completed',
        },
      ],
    },
    {
      id: 'onboarding-enterprise',
      name: 'Enterprise Onboarding',
      description: 'Comprehensive multi-department setup',
      outcome: 'Enterprise Deployment',
      suggestedResources: [
        {
          templateName: 'Enterprise Setup Guide',
          description: 'Multi-user configuration',
        },
        {
          templateName: 'Integration Specifications',
          description: 'System integration requirements',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'Deployment Plan',
          description: 'Phased rollout strategy',
        },
        {
          templateName: 'Training Schedule',
          description: 'Team training timeline',
        },
      ],
    },
  ],

  'Content Creation': [
    {
      id: 'content-blog',
      name: 'Blog Content',
      description: 'SEO-optimized blog articles',
      outcome: 'Published Blog Post',
      suggestedResources: [
        {
          templateName: 'SEO Keywords',
          description: 'Target keywords list',
          defaultSoftware: 'SEMrush',
        },
        {
          templateName: 'Style Guide',
          description: 'Brand voice guidelines',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'Blog Post',
          description: '1500-2000 word article',
        },
        {
          templateName: 'Social Snippets',
          description: 'Promotional social media posts',
        },
      ],
    },
    {
      id: 'content-video',
      name: 'Video Content',
      description: 'Video script and production',
      outcome: 'Published Video',
      suggestedResources: [
        {
          templateName: 'Video Brief',
          description: 'Video concept and objectives',
        },
        {
          templateName: 'Brand Assets',
          description: 'Logos, colors, templates',
          defaultSoftware: 'Brand Kit',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'Video Script',
          description: 'Complete shooting script',
        },
        {
          templateName: 'Final Video',
          description: 'Edited and published video',
        },
      ],
    },
    {
      id: 'content-social',
      name: 'Social Media Campaign',
      description: 'Multi-platform social content',
      outcome: 'Social Campaign',
      suggestedResources: [
        {
          templateName: 'Content Calendar',
          description: 'Posting schedule template',
          defaultSoftware: 'Buffer',
        },
        {
          templateName: 'Platform Guidelines',
          description: 'Platform-specific best practices',
        },
      ],
      suggestedDeliverables: [
        {
          templateName: 'Content Calendar',
          description: '30-day posting schedule',
        },
        {
          templateName: 'Creative Assets',
          description: 'Images, videos, copy',
        },
      ],
    },
  ],
};

// Helper function to get variants for a template
export function getTemplateVariants(templateName: string): TemplateVariant[] {
  return ACTION_TEMPLATE_VARIANTS[templateName] || [];
}

// Helper function to check if a template has variants
export function hasVariants(templateName: string): boolean {
  return templateName in ACTION_TEMPLATE_VARIANTS;
}
