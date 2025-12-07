'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Sparkles, Loader2, AlertCircle, Play, Wrench, CheckCircle } from 'lucide-react';
import type { Template } from '@/lib/storage';

interface AITemplateDialogProps {
  onClose: () => void;
  onGenerate: (template: Template) => void;
}

const NODE_TYPE_OPTIONS = [
  { value: 'auto', label: 'Auto-detect', icon: Sparkles, color: 'gray' },
  { value: 'issue', label: 'Issue', icon: AlertCircle, color: 'red' },
  { value: 'action', label: 'Action', icon: Play, color: 'blue' },
  { value: 'resource', label: 'Resource', icon: Wrench, color: 'green' },
  { value: 'deliverable', label: 'Deliverable', icon: CheckCircle, color: 'purple' },
];

const CATEGORY_OPTIONS = [
  'Auto-detect',
  'Client Onboarding',
  'Project Management',
  'Content Creation',
  'Customer Support',
  'Sales',
  'Development',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
  'General',
];

const EXAMPLE_PROMPTS = [
  'Client sends payment late',
  'Review code pull request',
  'Project management software',
  'Final delivery document',
  'Send welcome email to new customer',
  'Bug in production system',
];

export function AITemplateDialog({ onClose, onGenerate }: AITemplateDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [nodeType, setNodeType] = useState('auto');
  const [category, setCategory] = useState('Auto-detect');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a template description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          nodeType: nodeType === 'auto' ? undefined : nodeType,
          category: category === 'Auto-detect' ? undefined : category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate template');
      }

      const template = await response.json();
      onGenerate(template);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Generate Template with AI</h2>
              <p className="text-sm text-gray-500">Describe your template in natural language</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Template Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Description *
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Review code pull request"
              className="w-full"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe what this template is for in a few words
            </p>
          </div>

          {/* Node Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Node Type
            </label>
            <div className="grid grid-cols-5 gap-2">
              {NODE_TYPE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = nodeType === option.value;
                const colorClasses = {
                  gray: 'border-gray-300 text-gray-700',
                  red: 'border-red-500 text-red-700 bg-red-50',
                  blue: 'border-blue-500 text-blue-700 bg-blue-50',
                  green: 'border-green-500 text-green-700 bg-green-50',
                  purple: 'border-purple-500 text-purple-700 bg-purple-50',
                };

                return (
                  <button
                    key={option.value}
                    onClick={() => setNodeType(option.value)}
                    className={`flex flex-col items-center gap-1 px-2 py-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? colorClasses[option.color as keyof typeof colorClasses]
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Example Prompts */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
            <div className="grid grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-left"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• AI analyzes your description to understand the template purpose</li>
              <li>• Automatically detects the best node type (or use your selection)</li>
              <li>• Generates appropriate name, description, category, and tags</li>
              <li>• Template is instantly added to your library</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Template
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
