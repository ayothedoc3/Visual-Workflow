/**
 * EMOS (Enterprise Management Operating System) Configuration
 *
 * This file defines the 3-layer system architecture:
 * - Layer 1 (Strategic): Campaign → Playbook → Result
 * - Layer 2 (Tactical): 9 Gates with Questions/Actions/Blocks
 * - Layer 3 (Operational): Talent Tiers and KPI Tracking
 */

// ============ LAYER 1: Strategic Metadata ============

export const PACKAGE_TIERS = [
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Black'
] as const;

export const LEVELS = [
  'ACQUIRE',
  'MAINTAIN',
  'SCALE'
] as const;

export const PILLARS = [
  'Revenue',
  'Technology',
  'People',
  'Equity'
] as const;

export type PackageTier = typeof PACKAGE_TIERS[number];
export type Level = typeof LEVELS[number];
export type Pillar = typeof PILLARS[number];

// ============ LAYER 2: Gate System ============

export interface GateDefinition {
  id: string;
  number: number;
  name: string;
  question: string;
  action: string;
  blockedIf: string;
  escalateTo: string;
  description: string;
}

export const GATE_DEFINITIONS: GateDefinition[] = [
  {
    id: 'gate-1',
    number: 1,
    name: 'Strategy Entry',
    question: 'What is the strategic objective?',
    action: 'Define campaign goals and success metrics',
    blockedIf: 'No clear ROI or business case',
    escalateTo: 'CEO / Strategy Team',
    description: 'Entry point for all strategic initiatives. Validates business case and alignment with company vision.'
  },
  {
    id: 'gate-2',
    number: 2,
    name: 'Level Selection',
    question: 'Are we acquiring, maintaining, or scaling?',
    action: 'Select ACQUIRE, MAINTAIN, or SCALE level',
    blockedIf: 'Level conflicts with current capacity',
    escalateTo: 'Operations Director',
    description: 'Determines resource allocation and timeline expectations based on growth stage.'
  },
  {
    id: 'gate-3',
    number: 3,
    name: 'Formation Selection',
    question: 'What package tier is required?',
    action: 'Select Bronze/Silver/Gold/Platinum/Black package',
    blockedIf: 'Client budget below minimum tier',
    escalateTo: 'Sales / Account Manager',
    description: 'Matches client needs and budget to appropriate service package and deliverables.'
  },
  {
    id: 'gate-4',
    number: 4,
    name: 'Talent Matching',
    question: 'Do we have the right talent available?',
    action: 'Assign talent based on tier requirements',
    blockedIf: 'Required talent tier unavailable or overbooked',
    escalateTo: 'Resource Manager / HR',
    description: 'Ensures qualified personnel are available and assigned to execute the playbook.'
  },
  {
    id: 'gate-5',
    number: 5,
    name: 'SOP Activation',
    question: 'Are SOPs in place for this playbook?',
    action: 'Load and customize relevant SOPs',
    blockedIf: 'Critical SOPs missing or outdated',
    escalateTo: 'Process Owner / COO',
    description: 'Activates standard operating procedures to ensure consistent execution quality.'
  },
  {
    id: 'gate-6',
    number: 6,
    name: 'Template Deployment',
    question: 'What templates and resources are needed?',
    action: 'Deploy workflow templates and resources',
    blockedIf: 'Required templates not approved or tested',
    escalateTo: 'Operations / Project Manager',
    description: 'Deploys pre-built templates, documents, and tools needed for execution.'
  },
  {
    id: 'gate-7',
    number: 7,
    name: 'Contract Enforcement',
    question: 'Are contracts and agreements signed?',
    action: 'Ensure all legal/contractual requirements met',
    blockedIf: 'Unsigned contracts or missing terms',
    escalateTo: 'Legal / Contracts Team',
    description: 'Validates all contractual obligations and compliance requirements are satisfied.'
  },
  {
    id: 'gate-8',
    number: 8,
    name: 'KPI Feedback',
    question: 'How do we measure success?',
    action: 'Set up KPI tracking and reporting',
    blockedIf: 'No measurable KPIs or tracking system',
    escalateTo: 'Analytics / Performance Team',
    description: 'Establishes metrics, dashboards, and feedback loops to monitor progress and outcomes.'
  },
  {
    id: 'gate-9',
    number: 9,
    name: 'Learning Loop',
    question: 'What did we learn?',
    action: 'Document lessons learned and improvements',
    blockedIf: 'No retrospective or feedback collected',
    escalateTo: 'Knowledge Manager / Team Lead',
    description: 'Captures insights, documents best practices, and feeds learnings back into the system.'
  }
];

// ============ LAYER 3: Talent Tiers ============

export const TALENT_TIERS = [1, 2, 3] as const;

export type TalentTier = typeof TALENT_TIERS[number];

export interface TalentTierRequirement {
  tier: TalentTier;
  name: string;
  description: string;
  examples: string[];
}

export const TALENT_TIER_DEFINITIONS: TalentTierRequirement[] = [
  {
    tier: 1,
    name: 'Tier 1 - Junior/Support',
    description: 'Entry-level or support roles. Executes defined tasks under supervision.',
    examples: ['Junior Developer', 'Social Media Assistant', 'Data Entry Specialist']
  },
  {
    tier: 2,
    name: 'Tier 2 - Mid-Level/Specialist',
    description: 'Experienced professionals who can work independently and handle complex tasks.',
    examples: ['Senior Developer', 'Marketing Manager', 'Project Coordinator']
  },
  {
    tier: 3,
    name: 'Tier 3 - Expert/Lead',
    description: 'Expert-level talent with strategic capabilities and leadership experience.',
    examples: ['Technical Architect', 'Creative Director', 'Strategy Consultant']
  }
];

// ============ KPI Tracking by Level ============

export interface KPIDefinition {
  id: string;
  name: string;
  description: string;
  level: Level;
  targetMetric: string;
}

export const KPI_BY_LEVEL: Record<Level, KPIDefinition[]> = {
  ACQUIRE: [
    {
      id: 'acquire-conversion',
      name: 'Lead Conversion Rate',
      description: 'Percentage of leads converted to clients',
      level: 'ACQUIRE',
      targetMetric: '>25%'
    },
    {
      id: 'acquire-cac',
      name: 'Customer Acquisition Cost',
      description: 'Cost to acquire each new customer',
      level: 'ACQUIRE',
      targetMetric: '<$5,000'
    },
    {
      id: 'acquire-timeline',
      name: 'Sales Cycle Length',
      description: 'Average days from first contact to close',
      level: 'ACQUIRE',
      targetMetric: '<45 days'
    }
  ],
  MAINTAIN: [
    {
      id: 'maintain-retention',
      name: 'Client Retention Rate',
      description: 'Percentage of clients retained year-over-year',
      level: 'MAINTAIN',
      targetMetric: '>90%'
    },
    {
      id: 'maintain-satisfaction',
      name: 'Client Satisfaction Score',
      description: 'Average CSAT or NPS score',
      level: 'MAINTAIN',
      targetMetric: '>8.5/10'
    },
    {
      id: 'maintain-delivery',
      name: 'On-Time Delivery Rate',
      description: 'Percentage of deliverables completed on schedule',
      level: 'MAINTAIN',
      targetMetric: '>95%'
    }
  ],
  SCALE: [
    {
      id: 'scale-revenue',
      name: 'Revenue Growth Rate',
      description: 'Month-over-month revenue growth',
      level: 'SCALE',
      targetMetric: '>20% MoM'
    },
    {
      id: 'scale-margin',
      name: 'Profit Margin',
      description: 'Net profit as percentage of revenue',
      level: 'SCALE',
      targetMetric: '>30%'
    },
    {
      id: 'scale-efficiency',
      name: 'Operational Efficiency',
      description: 'Revenue per employee',
      level: 'SCALE',
      targetMetric: '>$150K/employee'
    }
  ]
};

// ============ Package Tier Requirements ============

export interface PackageTierRequirement {
  tier: PackageTier;
  minTalentTier: TalentTier;
  description: string;
  typical_services: string[];
}

export const PACKAGE_TIER_REQUIREMENTS: Record<PackageTier, PackageTierRequirement> = {
  Bronze: {
    tier: 'Bronze',
    minTalentTier: 1,
    description: 'Basic services with junior-level execution',
    typical_services: ['Social Media Management', 'Basic Content Creation', 'Email Marketing']
  },
  Silver: {
    tier: 'Silver',
    minTalentTier: 1,
    description: 'Standard services with mixed talent levels',
    typical_services: ['Content Marketing', 'SEO Optimization', 'Lead Generation']
  },
  Gold: {
    tier: 'Gold',
    minTalentTier: 2,
    description: 'Premium services requiring mid-level specialists',
    typical_services: ['Brand Strategy', 'Marketing Automation', 'Performance Analytics']
  },
  Platinum: {
    tier: 'Platinum',
    minTalentTier: 2,
    description: 'Advanced services with senior talent',
    typical_services: ['Full Marketing Stack', 'Custom Development', 'Strategic Consulting']
  },
  Black: {
    tier: 'Black',
    minTalentTier: 3,
    description: 'Elite services requiring expert-level talent',
    typical_services: ['Enterprise Solutions', 'Executive Advisory', 'Transformation Programs']
  }
};

// ============ Validation Functions ============

/**
 * Validates if assigned talent tier meets the playbook requirement
 */
export function validateTalentTier(
  assignedTalentTier: TalentTier,
  playbookPackageTier: PackageTier
): { valid: boolean; message: string } {
  const requirement = PACKAGE_TIER_REQUIREMENTS[playbookPackageTier];

  if (assignedTalentTier < requirement.minTalentTier) {
    return {
      valid: false,
      message: `Talent Tier ${assignedTalentTier} is below required Tier ${requirement.minTalentTier} for ${playbookPackageTier} package`
    };
  }

  return {
    valid: true,
    message: 'Talent tier meets requirements'
  };
}

/**
 * Gets KPIs for a specific level
 */
export function getKPIsForLevel(level: Level): KPIDefinition[] {
  return KPI_BY_LEVEL[level] || [];
}

/**
 * Gets gate definition by number
 */
export function getGateByNumber(gateNumber: number): GateDefinition | undefined {
  return GATE_DEFINITIONS.find(gate => gate.number === gateNumber);
}
