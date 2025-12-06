'use client';

import { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { IssueNode } from './NodeTypes/IssueNode';
import { ActionNode } from './NodeTypes/ActionNode';
import { ResourceNode } from './NodeTypes/ResourceNode';
import { DeliverableNode } from './NodeTypes/DeliverableNode';

const nodeTypes = {
  issue: IssueNode,
  action: ActionNode,
  resource: ResourceNode,
  deliverable: DeliverableNode,
};

const defaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',
  style: { stroke: '#94A3B8', strokeWidth: 3 },
  markerEnd: {
    type: 'arrowclosed' as const,
    color: '#94A3B8',
  },
};

interface WorkflowCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
}

export function WorkflowCanvas({
  initialNodes = [],
  initialEdges = [],
  onNodesChange: onNodesChangeExternal,
  onEdgesChange: onEdgesChangeExternal,
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Notify parent when nodes change
  useEffect(() => {
    if (onNodesChangeExternal) {
      onNodesChangeExternal(nodes);
    }
  }, [nodes, onNodesChangeExternal]);

  // Notify parent when edges change
  useEffect(() => {
    if (onEdgesChangeExternal) {
      onEdgesChangeExternal(edges);
    }
  }, [edges, onEdgesChangeExternal]);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );


  return (
    <div className="w-full h-full bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        snapToGrid={true}
        snapGrid={[15, 15]}
        connectionLineStyle={{ stroke: '#94A3B8', strokeWidth: 3 }}
        connectionLineType="smoothstep"
        deleteKeyCode="Delete"
        selectNodesOnDrag={true}
        panOnDrag={[1, 2]}
        zoomOnScroll={true}
        zoomOnPinch={true}
        className="bg-gray-50"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#E5E7EB" />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'issue':
                return '#EF4444';
              case 'action':
                return '#3B82F6';
              case 'resource':
                return '#10B981';
              case 'deliverable':
                return '#8B5CF6';
              default:
                return '#94A3B8';
            }
          }}
          className="bg-white border border-gray-300"
        />
      </ReactFlow>
    </div>
  );
}
