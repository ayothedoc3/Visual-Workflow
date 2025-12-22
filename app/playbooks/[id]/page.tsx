'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Target, Settings, Shield, HelpCircle, Workflow, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkflowEditor } from '@/components/workflow-editor/WorkflowEditor';
import { HelpModal } from '@/components/help/HelpModal';
import { Node, Edge } from 'reactflow';
import { generateNineGates } from '@/lib/emosSystem';
import { PLAYBOOK_HELP } from '@/lib/helpContent';

interface Playbook {
  id: string;
  name: string;
  description: string;
  workflow_nodes: any[];
  workflow_edges: any[];
  overall_status: string;
  progress: number;
  campaign_name: string;
  campaign_id: string;
  execution_count: number;
}

export default function PlaybookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const playbookId = params.id as string;

  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLoadedGates, setHasLoadedGates] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [viewMode, setViewMode] = useState<'workflow' | 'board'>('workflow');

  // Lift canvas state to parent (n8n pattern)
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (playbookId) {
      fetchPlaybook();
    }
  }, [playbookId]);

  const fetchPlaybook = async () => {
    try {
      const response = await fetch(`/api/playbooks/${playbookId}`);
      if (response.ok) {
        const data = await response.json();
        setPlaybook(data);

        // Initialize canvas state from fetched data
        const flowNodes: Node[] = (data.workflow_nodes || []).map((node: any) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: { ...node }
        }));

        const flowEdges: Edge[] = (data.workflow_edges || []).map((edge: any) => ({
          ...edge
        }));

        // Auto-load 9 Gates if playbook is empty
        if (flowNodes.length === 0 && !hasLoadedGates) {
          const { nodes: gateNodes, edges: gateEdges } = generateNineGates();

          const initialGateNodes: Node[] = gateNodes.map((node: any) => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: { ...node.data }
          }));

          setNodes(initialGateNodes);
          setEdges(gateEdges);
          setHasLoadedGates(true);
        } else {
          setNodes(flowNodes);
          setEdges(flowEdges);
        }
      }
    } catch (error) {
      console.error('Error fetching playbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Convert canvas nodes/edges to storage format
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

    try {
      const response = await fetch(`/api/playbooks/${playbookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowNodes,
          workflowEdges
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setPlaybook(updated);
      }
    } catch (error) {
      console.error('Error saving playbook:', error);
      alert('Failed to save playbook');
    }
  };

  const handleLoadNineGates = () => {
    const { nodes: gateNodes, edges: gateEdges } = generateNineGates();

    const newGateNodes: Node[] = gateNodes.map((node: any) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: { ...node.data }
    }));

    // Add gates to existing nodes
    setNodes((prevNodes) => [...prevNodes, ...newGateNodes]);
    setEdges((prevEdges) => [...prevEdges, ...gateEdges]);
    setHasLoadedGates(true);
  };

  const handleActionNodeDoubleClick = async (nodeId: string, nodeData: any) => {
    // Only Action nodes can have executions
    if (nodeData.type !== 'action') {
      alert('Only Action nodes can be drilled down into Executions');
      return;
    }

    // Check if this node already has a linked execution
    if (nodeData.linkedExecutionId) {
      router.push(`/executions/${nodeData.linkedExecutionId}`);
      return;
    }

    // Ask user if they want to create an execution
    const createExecution = confirm(`Create an execution for "${nodeData.label}"?`);
    if (!createExecution) return;

    try {
      const response = await fetch('/api/executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nodeData.label,
          parentPlaybookId: playbookId,
          parentNodeId: nodeId,
          status: 'not-started',
          progress: 0,
          primaryAssignee: nodeData.primaryAssignee || null,
          teamMembers: []
        })
      });

      if (response.ok) {
        const newExecution = await response.json();

        // Update the current nodes state with the linked execution ID
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  data: { ...node.data, linkedExecutionId: newExecution.id }
                }
              : node
          )
        );

        // Save will be triggered automatically by hasChanges detection

        // Navigate to the new execution
        router.push(`/executions/${newExecution.id}`);
      }
    } catch (error) {
      console.error('Error creating execution:', error);
      alert('Failed to create execution');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading playbook...</p>
        </div>
      </div>
    );
  }

  if (!playbook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="text-center py-12">
          <p className="text-red-600">Playbook not found</p>
          <Button onClick={() => router.push('/campaigns')} className="mt-4">
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Compact Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Navigation + Title */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/campaigns/${playbook.campaign_id}`)}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                <button onClick={() => router.push('/campaigns')} className="hover:text-blue-600">
                  Campaigns
                </button>
                <span>/</span>
                <button onClick={() => router.push(`/campaigns/${playbook.campaign_id}`)} className="hover:text-blue-600 max-w-[100px] truncate">
                  {playbook.campaign_name}
                </button>
                <span>/</span>
              </div>

              <h1 className="text-lg font-semibold truncate">{playbook.name}</h1>

              {playbook.description && (
                <p className="text-xs text-gray-500 truncate max-w-[200px]">{playbook.description}</p>
              )}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-500">{playbook.progress}%</span>

              <div className="w-20 bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${playbook.progress}%` }}
                />
              </div>

              {!hasLoadedGates && nodes.length === 0 && (
                <Button
                  onClick={handleLoadNineGates}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 h-7 text-xs"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Load Gates
                </Button>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('workflow')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === 'workflow'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Workflow className="w-3 h-3" />
                  Workflow
                </button>
                <button
                  onClick={() => setViewMode('board')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === 'board'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" />
                  Board
                </button>
              </div>

              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {playbook.overall_status}
              </span>

              <Button variant="ghost" size="sm" onClick={() => setShowHelp(true)} className="h-7 w-7 p-0">
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Inline Info Banner */}
          {viewMode === 'workflow' ? (
            <div className="mt-2 bg-purple-50 border border-purple-200 rounded px-3 py-1.5">
              <p className="text-xs text-purple-800">
                <strong>Workflow Mode:</strong> Structured workflow with 9 EMOS Gates (Strategy Entry → Learning Loop)
              </p>
            </div>
          ) : (
            <div className="mt-2 bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded px-3 py-1.5">
              <p className="text-xs text-orange-800">
                <strong>Board Mode:</strong> Freeform canvas for brainstorming, moodboards, and collecting ideas
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Canvas - Full Height */}
      <div style={{ height: 'calc(100vh - 100px)' }}>
        <WorkflowEditor
          workflowId={playbookId}
          nodes={nodes}
          edges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
          onSave={handleSave}
          onNodeDoubleClick={handleActionNodeDoubleClick}
          viewMode={viewMode}
        />
      </div>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title={PLAYBOOK_HELP.title}
        description={PLAYBOOK_HELP.description}
        sections={PLAYBOOK_HELP.sections}
        examples={PLAYBOOK_HELP.examples}
      />
    </div>
  );
}
