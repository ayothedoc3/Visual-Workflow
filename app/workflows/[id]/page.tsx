'use client';

import { useState } from 'react';
import { WorkflowCanvas } from '@/components/workflow-editor/WorkflowCanvas';
import { NodeSelector } from '@/components/workflow-editor/NodeSelector';
import { Button } from '@/components/ui/button';
import { Save, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Node, Edge } from 'reactflow';

export default function WorkflowEditorPage({ params }: { params: { id: string } }) {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleSave = () => {
    console.log('Saving workflow:', { nodes, edges });
    // TODO: Implement save functionality
  };

  const handleExport = () => {
    console.log('Exporting workflow');
    // TODO: Implement export functionality
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/workflows">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-xl font-semibold border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            />
            <p className="text-xs text-gray-500 px-2">
              {params.id === 'new' ? 'New workflow' : `Workflow ID: ${params.id}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <NodeSelector />
        <div className="flex-1">
          <WorkflowCanvas
            initialNodes={nodes}
            initialEdges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
          />
        </div>
      </div>
    </div>
  );
}
