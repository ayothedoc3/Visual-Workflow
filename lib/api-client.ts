// Client-side API wrapper that handles localStorage fallback
import { workflowStorage, templateStorage, type Workflow, type Template } from './storage';

// Workflow API client
export const workflowsApi = {
  async list(search?: string): Promise<Workflow[]> {
    const url = search ? `/api/workflows?search=${encodeURIComponent(search)}` : '/api/workflows';
    const response = await fetch(url);
    const data = await response.json();

    // Check if we should use client storage
    if (data.useClientStorage) {
      return search ? workflowStorage.search(search) : workflowStorage.getAll();
    }

    return data;
  },

  async get(id: string): Promise<Workflow | null> {
    const response = await fetch(`/api/workflows/${id}`);
    const data = await response.json();

    if (data.useClientStorage) {
      return workflowStorage.getById(id);
    }

    if (response.status === 404) {
      return null;
    }

    return data;
  },

  async create(workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow),
    });

    const data = await response.json();

    if (data.useClientStorage) {
      return workflowStorage.create(workflow);
    }

    return data;
  },

  async update(id: string, updates: Partial<Workflow>): Promise<Workflow | null> {
    const response = await fetch(`/api/workflows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (data.useClientStorage) {
      return workflowStorage.update(id, updates);
    }

    if (response.status === 404) {
      return null;
    }

    return data;
  },

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`/api/workflows/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.useClientStorage) {
      return workflowStorage.delete(id);
    }

    return response.ok;
  },

  async duplicate(id: string): Promise<Workflow | null> {
    const response = await fetch(`/api/workflows/${id}/duplicate`, {
      method: 'POST',
    });

    const data = await response.json();

    if (data.useClientStorage) {
      return workflowStorage.duplicate(id);
    }

    if (response.status === 404) {
      return null;
    }

    return data;
  },
};

// Template API client
export const templatesApi = {
  async list(filters?: {
    nodeType?: string;
    search?: string;
    category?: string;
  }): Promise<Template[]> {
    const params = new URLSearchParams();
    if (filters?.nodeType) params.set('node_type', filters.nodeType);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.category) params.set('category', filters.category);

    const url = params.toString() ? `/api/templates?${params}` : '/api/templates';
    const response = await fetch(url);
    const data = await response.json();

    if (data.useClientStorage) {
      return templateStorage.filter({
        nodeType: filters?.nodeType,
        search: filters?.search,
        category: filters?.category,
      });
    }

    return data;
  },

  async get(id: string): Promise<Template | null> {
    const response = await fetch(`/api/templates/${id}`);
    const data = await response.json();

    if (data.useClientStorage) {
      return templateStorage.getById(id);
    }

    if (response.status === 404) {
      return null;
    }

    return data;
  },

  async create(template: Partial<Template>): Promise<Template> {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    });

    const data = await response.json();

    if (data.useClientStorage) {
      return templateStorage.create(template);
    }

    return data;
  },

  async update(id: string, updates: Partial<Template>): Promise<Template | null> {
    const response = await fetch(`/api/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (data.useClientStorage) {
      return templateStorage.update(id, updates);
    }

    if (response.status === 404) {
      return null;
    }

    return data;
  },

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`/api/templates/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.useClientStorage) {
      return templateStorage.delete(id);
    }

    return response.ok;
  },

  async seed(): Promise<{ count: number }> {
    const response = await fetch('/api/templates/seed', {
      method: 'POST',
    });

    const data = await response.json();

    if (data.useClientStorage) {
      // Seed templates to localStorage
      const seedTemplates = await import('./seed-templates');
      return seedTemplates.seedToLocalStorage();
    }

    return data;
  },
};
