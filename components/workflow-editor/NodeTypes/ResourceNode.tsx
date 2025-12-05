'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ResourceNode = memo(({ data, id }: NodeProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-green-500 bg-white min-w-[200px] max-w-[250px]">
      <Handle type="target" position={Position.Top} className="!bg-green-500" />

      <div className="flex items-center gap-2 mb-2">
        <Wrench className="w-5 h-5 text-green-500 flex-shrink-0" />
        <span className="text-sm font-semibold text-gray-700">Resource</span>
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
          className="w-full bg-green-500 hover:bg-green-600"
          size="sm"
        >
          Select Template
        </Button>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  );
});

ResourceNode.displayName = 'ResourceNode';
