// Seed templates to localStorage for testing without database
import { templateStorage } from './storage';
import { seedTemplates } from './seed-data';

export function seedToLocalStorage(): { count: number } {
  // Check if already seeded
  const existing = templateStorage.getAll();
  if (existing.length > 0) {
    return { count: existing.length };
  }

  // Seed each template
  let count = 0;
  for (const template of seedTemplates) {
    templateStorage.create({
      nodeType: template.nodeType,
      name: template.name,
      description: template.description,
      category: template.category,
      tags: template.tags || [],
      metadata: (template.metadata as Record<string, any>) || {},
    });
    count++;
  }

  return { count };
}

// Auto-seed on first import if in browser
if (typeof window !== 'undefined') {
  const existing = templateStorage.getAll();
  if (existing.length === 0) {
    console.log('🌱 Seeding templates to localStorage...');
    const result = seedToLocalStorage();
    console.log(`✅ Seeded ${result.count} templates`);
  }
}
