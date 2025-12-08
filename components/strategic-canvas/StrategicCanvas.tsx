'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Save, Plus } from 'lucide-react';
import { StrategicNode } from './StrategicNode';

const nodeTypes = {
  strategicNode: StrategicNode,
};

interface StrategicCanvasProps {
  campaignId: string;
  initialNodes: any[];
  initialEdges: any[];
  onSave: (nodes: any[], edges: any[]) => void;
  onNodeDoubleClick?: (nodeId: string, nodeData: any) => void;
}

export function StrategicCanvas({
  campaignId,
  initialNodes,
  initialEdges,
  onSave,
  onNodeDoubleClick
}: StrategicCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Convert initial nodes to ReactFlow format
    const flowNodes = initialNodes.map((node) => ({
      id: node.id,
      type: 'strategicNode',
      position: node.position,
      data: {
        ...node,
        onDoubleClick: onNodeDoubleClick
      }
    }));

    const flowEdges = initialEdges.map((edge) => ({
      ...edge,
      type: edge.animated ? 'default' : 'smoothstep',
      animated: edge.animated || false
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges, onNodeDoubleClick]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      setHasChanges(true);
    },
    [setEdges]
  );

  const onNodeChange = useCallback(() => {
    setHasChanges(true);
  }, []);

  const addNewNode = () => {
    const nodeTypes = ['campaign', 'strategy', 'result'] as const;
    const typeIndex = nodes.length % 3;
    const type = nodeTypes[typeIndex];

    const newNode = {
      id: `node-${Date.now()}`,
      type: 'strategicNode',
      position: {
        x: 100 + (nodes.length * 50),
        y: 100 + (nodes.length * 50)
      },
      data: {
        id: `node-${Date.now()}`,
        type,
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: 'Double-click to add description',
        position: {
          x: 100 + (nodes.length * 50),
          y: 100 + (nodes.length * 50)
        },
        overallProgress: 0,
        status: 'not-started',
        onDoubleClick: onNodeDoubleClick
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setHasChanges(true);
  };

  const handleSave = () => {
    const strategicNodes = nodes.map((node) => ({
      id: node.id,
      type: node.data.type,
      label: node.data.label,
      description: node.data.description,
      position: node.position,
      linkedPlaybookId: node.data.linkedPlaybookId,
      overallProgress: node.data.overallProgress || 0,
      status: node.data.status || 'not-started'
    }));

    const strategicEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: edge.animated || false,
      type: edge.type,
      label: edge.label
    }));

    onSave(strategicNodes, strategicEdges);
    setHasChanges(false);
  };

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            onNodesChange(changes);
            onNodeChange();
          }}
          onEdgesChange={(changes) => {
            onEdgesChange(changes);
            onNodeChange();
          }}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(node: any) => {
              switch (node.data.type) {
                case 'campaign':
                  return '#3b82f6';
                case 'strategy':
                  return '#8b5cf6';
                case 'result':
                  return '#10b981';
                default:
                  return '#6b7280';
              }
            }}
          />
        </ReactFlow>

        {/* Floating Toolbar */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button
            onClick={addNewNode}
            size="sm"
            variant="outline"
            className="bg-white shadow-lg hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Node
          </Button>
          {hasChanges && (
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
