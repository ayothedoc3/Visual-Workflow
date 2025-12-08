'use client';

import { useState, useCallback, useEffect } from 'react';
import { WorkflowCanvas } from './WorkflowCanvas';
import { Node, Edge } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Save, Plus } from 'lucide-react';

interface WorkflowEditorProps {
  workflowId: string;
  initialNodes: any[];
  initialEdges: any[];
  onSave: (nodes: any[], edges: any[]) => void;
  onNodeDoubleClick?: (nodeId: string, nodeData: any) => void;
}

export function WorkflowEditor({
  workflowId,
  initialNodes,
  initialEdges,
  onSave,
  onNodeDoubleClick
}: WorkflowEditorProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Convert workflow nodes to ReactFlow format
    const flowNodes: Node[] = initialNodes.map((node) => ({
      id: node.id,
      type: node.type, // issue, action, resource, deliverable
      position: node.position,
      data: {
        ...node,
        _onDoubleClick: onNodeDoubleClick
      }
    }));

    const flowEdges: Edge[] = initialEdges.map((edge) => ({
      ...edge
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [initialNodes, initialEdges, onNodeDoubleClick]);

  const handleNodesChange = useCallback((changes: any) => {
    setNodes((nds) => {
      // Apply changes using react-flow's helper
      const { applyNodeChanges } = require('reactflow');
      return applyNodeChanges(changes, nds);
    });
    setHasChanges(true);
  }, []);

  const handleEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => {
      const { applyEdgeChanges } = require('reactflow');
      return applyEdgeChanges(changes, eds);
    });
    setHasChanges(true);
  }, []);

  const handleConnect = useCallback((connection: any) => {
    setEdges((eds) => {
      const { addEdge } = require('reactflow');
      return addEdge(connection, eds);
    });
    setHasChanges(true);
  }, []);

  const handleSave = () => {
    // Convert back to storage format
    const workflowNodes = nodes.map((node) => {
      const { _onDoubleClick, ...data } = node.data;
      return {
        id: node.id,
        type: node.data.type,
        label: node.data.label,
        description: node.data.description,
        category: node.data.category,
        position: node.position,
        linkedExecutionId: node.data.linkedExecutionId,
        status: node.data.status || 'not-started',
        progress: node.data.progress || 0,
        primaryAssignee: node.data.primaryAssignee,
        templateId: node.data.templateId,
        data: node.data.data
      };
    });

    const workflowEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      animated: edge.animated,
      label: edge.label
    }));

    onSave(workflowNodes, workflowEdges);
    setHasChanges(false);
  };

  return (
    <div className="h-[calc(100vh-300px)] relative">
      <WorkflowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeDoubleClick={onNodeDoubleClick}
      />

      {/* Floating Save Button */}
      {hasChanges && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={handleSave}
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
