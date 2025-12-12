'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow, Node } from 'reactflow';
import { Play, User, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateDropdown } from '../TemplateDropdown';
import type { Template } from '@/lib/storage';
import type { TemplateVariant } from '@/lib/templateVariants';

export const ActionNode = memo(({ data, id }: NodeProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditingAssignments, setIsEditingAssignments] = useState(false);
  const { setNodes, setEdges, getNode } = useReactFlow();

  const handleTemplateSelect = (template: Template, variant?: TemplateVariant) => {
    // Update the current node with template data
    setNodes((nodes) => {
      const updatedNodes = nodes.map((node) => {
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
              selectedVariant: variant,
            },
          };
        }
        return node;
      });

      // If variant is selected, auto-create suggested resources and deliverables
      if (variant) {
        const currentNode = getNode(id);
        if (!currentNode) return updatedNodes;

        const newNodes: Node[] = [];
        const resourceIds: string[] = [];
        const deliverableIds: string[] = [];
        const baseX = currentNode.position.x;
        const baseY = currentNode.position.y;
        const horizontalSpacing = 300;
        const verticalSpacing = 150;
        const timestamp = Date.now();

        // Create resource nodes to the left
        variant.suggestedResources.forEach((resource, index) => {
          const resourceId = `resource-${timestamp}-${index}`;
          resourceIds.push(resourceId);
          newNodes.push({
            id: resourceId,
            type: 'resource',
            position: {
              x: baseX - horizontalSpacing,
              y: baseY + (index * verticalSpacing),
            },
            data: {
              id: resourceId,
              type: 'resource',
              label: resource.templateName,
              description: resource.description,
              category: 'auto-generated',
              software: resource.defaultSoftware || '',
              status: 'not-started',
              progress: 0,
            },
          });
        });

        // Create deliverable nodes to the right
        variant.suggestedDeliverables.forEach((deliverable, index) => {
          const deliverableId = `deliverable-${timestamp}-${index}`;
          deliverableIds.push(deliverableId);
          newNodes.push({
            id: deliverableId,
            type: 'deliverable',
            position: {
              x: baseX + horizontalSpacing,
              y: baseY + (index * verticalSpacing),
            },
            data: {
              id: deliverableId,
              type: 'deliverable',
              label: deliverable.templateName,
              description: deliverable.description,
              category: 'auto-generated',
              status: 'not-started',
              progress: 0,
            },
          });
        });

        // Add edges from resources to action and from action to deliverables
        setEdges((edges) => {
          const newEdges = [...edges];

          // Connect resources -> action
          resourceIds.forEach((resourceId) => {
            newEdges.push({
              id: `edge-${resourceId}-${id}`,
              source: resourceId,
              target: id,
              type: 'smoothstep',
              animated: true,
            });
          });

          // Connect action -> deliverables
          deliverableIds.forEach((deliverableId) => {
            newEdges.push({
              id: `edge-${id}-${deliverableId}`,
              source: id,
              target: deliverableId,
              type: 'smoothstep',
              animated: true,
            });
          });

          return newEdges;
        });

        return [...updatedNodes, ...newNodes];
      }

      return updatedNodes;
    });

    setShowDropdown(false);
  };

  const handleAssignmentUpdate = (field: 'assignedTo' | 'software', value: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: value,
            },
          };
        }
        return node;
      })
    );
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
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 break-words">{data.label}</p>
            {data.description && (
              <p className="text-xs text-gray-500 break-words">{data.description}</p>
            )}

            {/* Assignment Display/Edit */}
            <div className="space-y-1 pt-2 border-t">
              {isEditingAssignments ? (
                <>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <User className="w-3 h-3" />
                      Assigned To
                    </label>
                    <input
                      type="text"
                      value={data.assignedTo || ''}
                      onChange={(e) => handleAssignmentUpdate('assignedTo', e.target.value)}
                      placeholder="Role or person..."
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <Laptop className="w-3 h-3" />
                      Software
                    </label>
                    <input
                      type="text"
                      value={data.software || ''}
                      onChange={(e) => handleAssignmentUpdate('software', e.target.value)}
                      placeholder="Tool or platform..."
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingAssignments(false)}
                    className="w-full text-xs"
                  >
                    Done
                  </Button>
                </>
              ) : (
                <>
                  {(data.assignedTo || data.software) && (
                    <div className="space-y-1">
                      {data.assignedTo && (
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <User className="w-3 h-3 text-blue-500" />
                          <span className="truncate">{data.assignedTo}</span>
                        </div>
                      )}
                      {data.software && (
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <Laptop className="w-3 h-3 text-blue-500" />
                          <span className="truncate">{data.software}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingAssignments(true)}
                      className="flex-1 text-xs"
                    >
                      {data.assignedTo || data.software ? 'Edit' : 'Assign'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDropdown(true)}
                      className="flex-1 text-xs"
                    >
                      Change
                    </Button>
                  </div>
                </>
              )}
            </div>
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
