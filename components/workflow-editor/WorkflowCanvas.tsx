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
  MarkerType,
  ConnectionLineType,
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
  type: 'smoothstep' as const,
  style: { stroke: '#94A3B8', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#94A3B8',
  },
};

interface WorkflowCanvasProps {
  nodes?: Node[];
  edges?: Edge[];
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onConnect?: OnConnect;
  onNodeDoubleClick?: (nodeId: string, nodeData: any) => void;
}

export function WorkflowCanvas({
  nodes: externalNodes,
  edges: externalEdges,
  initialNodes = [],
  initialEdges = [],
  onNodesChange: onNodesChangeExternal,
  onEdgesChange: onEdgesChangeExternal,
  onConnect: onConnectExternal,
  onNodeDoubleClick,
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(externalNodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(externalEdges || initialEdges);

  // Sync external nodes with internal state
  useEffect(() => {
    if (externalNodes) {
      setNodes(externalNodes);
    }
  }, [externalNodes, setNodes]);

  // Sync external edges with internal state
  useEffect(() => {
    if (externalEdges) {
      setEdges(externalEdges);
    }
  }, [externalEdges, setEdges]);

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
      if (onConnectExternal) {
        onConnectExternal(connection);
      } else {
        setEdges((eds) => addEdge(connection, eds));
      }
    },
    [setEdges, onConnectExternal]
  );

  const onNodeDoubleClickHandler = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (onNodeDoubleClick) {
        onNodeDoubleClick(node.id, node.data);
      }
    },
    [onNodeDoubleClick]
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
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      // Create node with default name based on type
      const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
      const nodeId = `${type}-${Date.now()}`;

      const newNode: Node = {
        id: nodeId,
        type,
        position,
        data: {
          id: nodeId,
          type: type,
          label: `New ${typeLabel}`,
          description: '',
          category: type,
          status: 'not-started',
          progress: 0,
          _onDoubleClick: onNodeDoubleClick
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, onNodeDoubleClick]
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
        onNodeDoubleClick={onNodeDoubleClickHandler}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        snapToGrid={true}
        snapGrid={[20, 20]}
        connectionLineStyle={{ stroke: '#3B82F6', strokeWidth: 2 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        deleteKeyCode={["Delete", "Backspace"]}
        multiSelectionKeyCode="Control"
        selectNodesOnDrag={false}
        panOnDrag={[1, 2]}
        zoomOnScroll={true}
        zoomOnPinch={true}
        elevateEdgesOnSelect={true}
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
