'use client';

import { AlertCircle, Play, Wrench, CheckCircle } from 'lucide-react';

const nodeTypes = [
  {
    type: 'issue',
    label: 'Issue',
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    count: 23, // Placeholder - will be dynamic later
  },
  {
    type: 'action',
    label: 'Action',
    icon: Play,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    count: 45,
  },
  {
    type: 'resource',
    label: 'Resource',
    icon: Wrench,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    count: 18,
  },
  {
    type: 'deliverable',
    label: 'Deliverable',
    icon: CheckCircle,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500',
    count: 12,
  },
];

export function NodeSelector() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Node Types</h2>
        <p className="text-sm text-gray-600">Drag nodes to canvas</p>
      </div>

      <div className="space-y-3">
        {nodeTypes.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              className={`
                flex items-center gap-3 p-3 rounded-lg border-2
                ${node.borderColor} ${node.bgColor}
                cursor-move hover:shadow-md transition-all
              `}
            >
              <Icon className={`w-6 h-6 ${node.color} flex-shrink-0`} />
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">{node.label}</div>
                <div className="text-xs text-gray-500">({node.count})</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
          Templates →
        </button>
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
          Workflows →
        </button>
      </div>
    </div>
  );
}
