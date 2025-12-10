'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { WorkflowCanvas } from './WorkflowCanvas';
import { NodePalette } from './NodePalette';
import { Node, Edge } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface WorkflowEditorProps {
  workflowId: string;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  onSave: () => void;
  onNodeDoubleClick?: (nodeId: string, nodeData: any) => void;
}

export function WorkflowEditor({
  workflowId,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onSave,
  onNodeDoubleClick
}: WorkflowEditorProps) {
  // Add _onDoubleClick to node data
  const enrichedNodes = useMemo(() =>
    nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        _onDoubleClick: onNodeDoubleClick
      }
    })),
    [nodes, onNodeDoubleClick]
  );

  const handleNodesChange = useCallback((changes: any) => {
    const { applyNodeChanges } = require('reactflow');
    onNodesChange(applyNodeChanges(changes, nodes));
  }, [nodes, onNodesChange]);

  const handleEdgesChange = useCallback((changes: any) => {
    const { applyEdgeChanges } = require('reactflow');
    onEdgesChange(applyEdgeChanges(changes, edges));
  }, [edges, onEdgesChange]);

  const handleConnect = useCallback((connection: any) => {
    console.log('handleConnect called with:', connection);
    const { addEdge } = require('reactflow');
    const newEdges = addEdge(connection, edges);
    console.log('New edges after addEdge:', newEdges);
    onEdgesChange(newEdges);
  }, [edges, onEdgesChange]);

  // Detect if there are unsaved changes by comparing with a snapshot
  // For simplicity, we'll just show save button when user makes changes
  // (In a real app, you'd compare current state with last saved state)
  const hasChanges = nodes.length > 0 || edges.length > 0;

  return (
    <div className="h-[calc(100vh-300px)] relative">
      <WorkflowCanvas
        nodes={enrichedNodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeDoubleClick={onNodeDoubleClick}
      />

      {/* Node Palette */}
      <NodePalette />

      {/* Floating Save Button - always show when there are nodes */}
      {hasChanges && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={onSave}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
