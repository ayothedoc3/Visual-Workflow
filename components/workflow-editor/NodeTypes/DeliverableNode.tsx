'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateDropdown } from '../TemplateDropdown';
import { Template } from '@/lib/schema';

export const DeliverableNode = memo(({ data, id }: NodeProps) => {
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
      <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-purple-500 bg-white min-w-[200px] max-w-[250px]">
        <Handle type="target" position={Position.Top} className="!bg-purple-500" />

        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-700">Deliverable</span>
        </div>

        {data.templateId ? (
          <div>
            <p className="text-sm font-medium text-gray-900 break-words">{data.label}</p>
            {data.description && (
              <p className="text-xs text-gray-500 mt-1 break-words">{data.description}</p>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDropdown(true)}
              className="mt-2 w-full text-xs"
            >
              Change Template
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowDropdown(true)}
            className="w-full bg-purple-500 hover:bg-purple-600"
            size="sm"
          >
            Select Template
          </Button>
        )}

        <Handle type="source" position={Position.Bottom} className="!bg-purple-500" />
      </div>

      {showDropdown && (
        <TemplateDropdown
          nodeType="deliverable"
          onSelect={handleTemplateSelect}
          onClose={() => setShowDropdown(false)}
          currentTemplateId={data.templateId}
        />
      )}
    </>
  );
});

DeliverableNode.displayName = 'DeliverableNode';
