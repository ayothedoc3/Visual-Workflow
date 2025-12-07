'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Lightbulb, AlertTriangle, X } from 'lucide-react';
import { Node, Edge } from 'reactflow';
import { analyzeworkflowForSuggestions, CopilotSuggestion } from '@/lib/ai-workflow-generator';
import type { Template } from '@/lib/storage';

interface WorkflowCopilotProps {
  nodes: Node[];
  edges: Edge[];
  templates?: Template[];
  onClose?: () => void;
}

const iconMap = {
  optimization: Lightbulb,
  completion: CheckCircle,
  warning: AlertTriangle,
  'best-practice': AlertCircle,
};

const colorMap = {
  optimization: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-500',
  },
  completion: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: 'text-green-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: 'text-yellow-500',
  },
  'best-practice': {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    icon: 'text-purple-500',
  },
};

export function WorkflowCopilot({ nodes, edges, templates, onClose }: WorkflowCopilotProps) {
  const [suggestions, setSuggestions] = useState<CopilotSuggestion[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Analyze workflow and generate suggestions
    const newSuggestions = analyzeworkflowForSuggestions(nodes, edges, templates);
    setSuggestions(newSuggestions);
  }, [nodes, edges, templates]);

  const dismissSuggestion = (index: number) => {
    setDismissed(prev => new Set(prev).add(`${index}-${suggestions[index].title}`));
  };

  const activeSuggestions = suggestions.filter(
    (suggestion, index) => !dismissed.has(`${index}-${suggestion.title}`)
  );

  if (activeSuggestions.length === 0) {
    return (
      <div className="bg-white border-l border-gray-200 w-80 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">AI Co-Pilot</h3>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
          <p className="text-sm text-gray-600 font-medium">Workflow looks great!</p>
          <p className="text-xs text-gray-500 mt-1">No suggestions at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-l border-gray-200 w-80 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">AI Co-Pilot</h3>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {activeSuggestions.length} suggestion{activeSuggestions.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="p-4 space-y-3">
        {activeSuggestions.map((suggestion, index) => {
          const Icon = iconMap[suggestion.type];
          const colors = colorMap[suggestion.type];

          return (
            <div
              key={index}
              className={`relative p-4 rounded-lg border ${colors.bg} ${colors.border}`}
            >
              <button
                onClick={() => dismissSuggestion(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex items-start gap-3 pr-6">
                <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                <div>
                  <h4 className={`font-medium text-sm ${colors.text} mb-1`}>
                    {suggestion.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">{suggestion.message}</p>
                  {suggestion.action && (
                    <p className="text-xs font-medium text-gray-700 mt-2">
                      💡 {suggestion.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow Stats */}
      <div className="p-4 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-3">Workflow Stats</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Total Nodes</p>
            <p className="text-lg font-semibold text-gray-900">{nodes.length}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Connections</p>
            <p className="text-lg font-semibold text-gray-900">{edges.length}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Issues</p>
            <p className="text-lg font-semibold text-red-600">
              {nodes.filter(n => n.type === 'issue').length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Actions</p>
            <p className="text-lg font-semibold text-blue-600">
              {nodes.filter(n => n.type === 'action').length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Resources</p>
            <p className="text-lg font-semibold text-green-600">
              {nodes.filter(n => n.type === 'resource').length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Deliverables</p>
            <p className="text-lg font-semibold text-purple-600">
              {nodes.filter(n => n.type === 'deliverable').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
