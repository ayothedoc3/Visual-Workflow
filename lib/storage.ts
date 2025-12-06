// Storage utility that uses browser localStorage as fallback when database is not available
// This allows testing without database, then seamless migration to database later

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  nodes: any[];
  edges: any[];
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  nodeType: string;
  name: string;
  description: string | null;
  category: string;
  tags: string[];
  metadata: Record<string, any>;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Storage keys
const WORKFLOWS_KEY = 'visual-workflow-workflows';
const TEMPLATES_KEY = 'visual-workflow-templates';

// Generate UUID v4
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Workflow storage operations
export const workflowStorage = {
  getAll: (): Workflow[] => {
    if (!isBrowser) return [];
    const data = localStorage.getItem(WORKFLOWS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Workflow | null => {
    const workflows = workflowStorage.getAll();
    return workflows.find((w) => w.id === id) || null;
  },

  create: (workflow: Partial<Workflow>): Workflow => {
    const workflows = workflowStorage.getAll();
    const now = new Date().toISOString();
    const newWorkflow: Workflow = {
      id: generateId(),
      name: workflow.name || 'Untitled Workflow',
      description: workflow.description || null,
      thumbnail: workflow.thumbnail || null,
      nodes: workflow.nodes || [],
      edges: workflow.edges || [],
      createdBy: workflow.createdBy || null,
      createdAt: now,
      updatedAt: now,
    };
    workflows.push(newWorkflow);
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflows));
    return newWorkflow;
  },

  update: (id: string, updates: Partial<Workflow>): Workflow | null => {
    const workflows = workflowStorage.getAll();
    const index = workflows.findIndex((w) => w.id === id);
    if (index === -1) return null;

    const updated = {
      ...workflows[index],
      ...updates,
      id: workflows[index].id, // Preserve ID
      createdAt: workflows[index].createdAt, // Preserve created date
      updatedAt: new Date().toISOString(),
    };
    workflows[index] = updated;
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflows));
    return updated;
  },

  delete: (id: string): boolean => {
    const workflows = workflowStorage.getAll();
    const filtered = workflows.filter((w) => w.id !== id);
    if (filtered.length === workflows.length) return false;
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(filtered));
    return true;
  },

  search: (query: string): Workflow[] => {
    const workflows = workflowStorage.getAll();
    if (!query) return workflows;
    const lowerQuery = query.toLowerCase();
    return workflows.filter((w) =>
      w.name.toLowerCase().includes(lowerQuery) ||
      (w.description && w.description.toLowerCase().includes(lowerQuery))
    );
  },

  duplicate: (id: string): Workflow | null => {
    const original = workflowStorage.getById(id);
    if (!original) return null;
    return workflowStorage.create({
      ...original,
      name: `${original.name} (Copy)`,
    });
  },
};

// Template storage operations
export const templateStorage = {
  getAll: (): Template[] => {
    if (!isBrowser) return [];
    const data = localStorage.getItem(TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Template | null => {
    const templates = templateStorage.getAll();
    return templates.find((t) => t.id === id) || null;
  },

  create: (template: Partial<Template>): Template => {
    const templates = templateStorage.getAll();
    const now = new Date().toISOString();
    const newTemplate: Template = {
      id: generateId(),
      nodeType: template.nodeType || 'action',
      name: template.name || 'Untitled Template',
      description: template.description || null,
      category: template.category || 'General',
      tags: template.tags || [],
      metadata: template.metadata || {},
      createdBy: template.createdBy || null,
      createdAt: now,
      updatedAt: now,
    };
    templates.push(newTemplate);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    return newTemplate;
  },

  update: (id: string, updates: Partial<Template>): Template | null => {
    const templates = templateStorage.getAll();
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updated = {
      ...templates[index],
      ...updates,
      id: templates[index].id,
      createdAt: templates[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    templates[index] = updated;
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    return updated;
  },

  delete: (id: string): boolean => {
    const templates = templateStorage.getAll();
    const filtered = templates.filter((t) => t.id !== id);
    if (filtered.length === templates.length) return false;
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
    return true;
  },

  filter: (filters: {
    nodeType?: string;
    search?: string;
    category?: string;
  }): Template[] => {
    let templates = templateStorage.getAll();

    if (filters.nodeType) {
      templates = templates.filter((t) => t.nodeType === filters.nodeType);
    }

    if (filters.search) {
      const lowerQuery = filters.search.toLowerCase();
      templates = templates.filter((t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        (t.description && t.description.toLowerCase().includes(lowerQuery))
      );
    }

    if (filters.category) {
      templates = templates.filter((t) => t.category === filters.category);
    }

    return templates;
  },
};

// Check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    const response = await fetch('/api/health/db');
    return response.ok;
  } catch {
    return false;
  }
}
