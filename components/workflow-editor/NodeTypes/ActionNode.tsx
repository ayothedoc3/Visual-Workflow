'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateDropdown } from '../TemplateDropdown';
import type { Template } from '@/lib/storage';

export const ActionNode = memo(({ data, id }: NodeProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { setNodes } = useReactFlow();

  const handleTemplateSelect = (template: Template) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              templateId: template.id,
              label: template.name,
              description: template.description,
              category: template.category,
              tags: template.tags,
            },
          };
        }
        return node;
      })
    );
    setShowDropdown(false);
  };

  return (
    <>
      <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-blue-500 bg-white min-w-[200px] max-w-[250px]">
        {/* Action is middle node - input from left, output to right */}
        <Handle type="target" position={Position.Left} className="!bg-blue-500 !w-3 !h-3" />
        <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-3 !h-3" />

        <div className="flex items-center gap-2 mb-2">
          <Play className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-700">Action</span>
        </div>

        {data.templateId ? (
          <div className="max-h-[150px] overflow-y-auto">
            <p className="text-sm font-medium text-gray-900 break-words">{data.label}</p>
            {data.description && (
              <p className="text-xs text-gray-500 mt-1 break-words">{data.description}</p>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDropdown(true)}
              className="mt-2 w-full text-xs sticky bottom-0 bg-white"
            >
              Change Template
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowDropdown(true)}
            className="w-full bg-blue-500 hover:bg-blue-600"
            size="sm"
          >
            Select Template
          </Button>
        )}
      </div>

      {showDropdown && (
        <TemplateDropdown
          nodeType="action"
          onSelect={handleTemplateSelect}
          onClose={() => setShowDropdown(false)}
          currentTemplateId={data.templateId}
        />
      )}
    </>
  );
});

ActionNode.displayName = 'ActionNode';
