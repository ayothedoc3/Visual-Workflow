'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TemplateForm } from '@/components/template-manager/TemplateForm';
import type { Template } from '@/lib/storage';
import { templatesApi } from '@/lib/api-client';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedNodeType, selectedCategory, templates]);

  const fetchTemplates = async () => {
    try {
      const data = await templatesApi.list();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedNodeType !== 'all') {
      filtered = filtered.filter((t) => t.nodeType === selectedNodeType);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const success = await templatesApi.delete(id);
      if (success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'issue':
        return 'bg-red-100 text-red-800';
      case 'action':
        return 'bg-blue-100 text-blue-800';
      case 'resource':
        return 'bg-green-100 text-green-800';
      case 'deliverable':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = ['all', ...new Set(templates.map((t) => t.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Template Library</h1>
            <p className="text-gray-600">
              {templates.length} template{templates.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <Button size="lg" onClick={() => { setEditingTemplate(undefined); setShowForm(true); }}>
            <Plus className="w-5 h-5 mr-2" />
            Add Template
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedNodeType}
              onChange={(e) => setSelectedNodeType(e.target.value)}
              className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
            >
              <option value="all">All Node Types</option>
              <option value="issue">Issue</option>
              <option value="action">Action</option>
              <option value="resource">Resource</option>
              <option value="deliverable">Deliverable</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Template List */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">
              {templates.length === 0
                ? 'No templates yet'
                : 'No templates match your filters'}
            </p>
            <Button onClick={() => { setEditingTemplate(undefined); setShowForm(true); }}>
              Add your first template
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getNodeTypeColor(
                      template.nodeType
                    )}`}
                  >
                    {template.nodeType}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingTemplate(template); setShowForm(true); }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>

                {template.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {template.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {template.category}
                  </span>
                  {template.tags && template.tags.length > 0 && (
                    <span>{template.tags.length} tag{template.tags.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Form Modal */}
        {showForm && (
          <TemplateForm
            template={editingTemplate}
            onClose={() => { setShowForm(false); setEditingTemplate(undefined); }}
            onSave={fetchTemplates}
          />
        )}
      </div>
    </div>
  );
}
