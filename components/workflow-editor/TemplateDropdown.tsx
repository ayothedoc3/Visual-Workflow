'use client';

import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Template, NodeType } from '@/lib/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TemplateDropdownProps {
  nodeType: NodeType;
  onSelect: (template: Template) => void;
  onClose: () => void;
  currentTemplateId?: string;
}

export function TemplateDropdown({
  nodeType,
  onSelect,
  onClose,
  currentTemplateId,
}: TemplateDropdownProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchTemplates();
  }, [nodeType]);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedCategory, templates]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/templates?node_type=${nodeType}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
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

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
  };

  const categories = ['all', ...new Set(templates.map((t) => t.category))];

  const getNodeTypeColor = () => {
    switch (nodeType) {
      case 'issue':
        return 'border-red-500 bg-red-50';
      case 'action':
        return 'border-blue-500 bg-blue-50';
      case 'resource':
        return 'border-green-500 bg-green-50';
      case 'deliverable':
        return 'border-purple-500 bg-purple-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold capitalize">
              Select {nodeType} Template
            </h2>
            <p className="text-sm text-gray-600">
              {templates.length} template{templates.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 space-y-3">
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

        {/* Template List */}
        {loading ? (
          <div className="text-center py-8 text-gray-600">
            Loading templates...
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p className="mb-2">
              {templates.length === 0
                ? `No ${nodeType} templates available yet`
                : 'No templates match your search'}
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className={`w-full text-left p-4 rounded-lg border-2 hover:shadow-md transition-all ${
                  template.id === currentTemplateId
                    ? getNodeTypeColor()
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {template.category}
                  </span>
                </div>

                {template.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {template.description}
                  </p>
                )}

                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{template.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
