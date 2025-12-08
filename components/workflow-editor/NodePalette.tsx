'use client';

import { AlertCircle, Play, FileText, CheckCircle } from 'lucide-react';

interface NodePaletteProps {
  onAddNode: (type: 'issue' | 'action' | 'resource' | 'deliverable') => void;
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const nodeTypes = [
    {
      type: 'issue' as const,
      label: 'Issue',
      icon: AlertCircle,
      color: 'bg-red-100 border-red-300 hover:bg-red-200 text-red-700',
      description: 'Problem or challenge'
    },
    {
      type: 'action' as const,
      label: 'Action',
      icon: Play,
      color: 'bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-700',
      description: 'Executable task (double-click to create execution)'
    },
    {
      type: 'resource' as const,
      label: 'Resource',
      icon: FileText,
      color: 'bg-green-100 border-green-300 hover:bg-green-200 text-green-700',
      description: 'Supporting material'
    },
    {
      type: 'deliverable' as const,
      label: 'Deliverable',
      icon: CheckCircle,
      color: 'bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-700',
      description: 'Output or result'
    }
  ];

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Nodes</h3>
      <div className="space-y-2">
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <button
              key={nodeType.type}
              onClick={() => onAddNode(nodeType.type)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md border-2 transition-all cursor-pointer ${nodeType.color}`}
              title={nodeType.description}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">{nodeType.label}</div>
                <div className="text-xs opacity-75">{nodeType.description}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">
          <strong>How to use:</strong>
        </p>
        <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
          <li>Click button → Enter name</li>
          <li>Drag nodes to reposition</li>
          <li>Drag from edge to connect</li>
          <li>Double-click Action to execute</li>
        </ul>
      </div>
    </div>
  );
}
