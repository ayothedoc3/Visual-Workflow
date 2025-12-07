'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { WorkflowCanvas } from '@/components/workflow-editor/WorkflowCanvas';
import { NodeSelector } from '@/components/workflow-editor/NodeSelector';
import { AIGenerateDialog } from '@/components/workflow-editor/AIGenerateDialog';
import { WorkflowCopilot } from '@/components/workflow-editor/WorkflowCopilot';
import { Button } from '@/components/ui/button';
import { Save, Download, ArrowLeft, Check, Sparkles, Brain } from 'lucide-react';
import Link from 'next/link';
import { Node, Edge } from 'reactflow';
import { useRouter, useParams } from 'next/navigation';
import { workflowsApi } from '@/lib/api-client';
// Import seed-templates to auto-seed templates in localStorage
import '@/lib/seed-templates';

export default function WorkflowEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const paramId = params?.id;
  const [workflowId, setWorkflowId] = useState<string | null>(
    paramId === 'new' ? null : paramId || null
  );
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(paramId !== 'new');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showCopilot, setShowCopilot] = useState(true);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load workflow if editing existing
  useEffect(() => {
    if (paramId && paramId !== 'new') {
      loadWorkflow(paramId);
    }
  }, [paramId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!autoSaveEnabled || !workflowId) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      handleSave(true); // Pass true for auto-save
    }, 30000); // 30 seconds

    // Cleanup
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [nodes, edges, workflowName, workflowId, autoSaveEnabled]);

  const loadWorkflow = async (id: string) => {
    try {
      setLoading(true);
      const workflow = await workflowsApi.get(id);

      if (!workflow) {
        throw new Error('Failed to load workflow');
      }

      setWorkflowName(workflow.name);
      setNodes((workflow.nodes as Node[]) || []);
      setEdges((workflow.edges as Edge[]) || []);
      setLastSaved(workflow.updatedAt ? new Date(workflow.updatedAt) : null);
    } catch (error) {
      console.error('Error loading workflow:', error);
      alert('Failed to load workflow');
      router.push('/workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = useCallback(async (isAutoSave = false) => {
    if (!isAutoSave) {
      setSaving(true);
    }

    try {
      const workflowData = {
        name: workflowName,
        nodes,
        edges,
      };

      let savedWorkflow;
      if (workflowId) {
        // Update existing workflow
        savedWorkflow = await workflowsApi.update(workflowId, workflowData);
      } else {
        // Create new workflow
        savedWorkflow = await workflowsApi.create(workflowData);
      }

      if (!savedWorkflow) {
        throw new Error('Failed to save workflow');
      }

      // If this was a new workflow, update the ID and URL
      if (!workflowId) {
        setWorkflowId(savedWorkflow.id);
        router.replace(`/workflows/${savedWorkflow.id}`);
      }

      setLastSaved(savedWorkflow.updatedAt ? new Date(savedWorkflow.updatedAt) : new Date());

      if (!isAutoSave) {
        // Show success message for manual saves
        alert('Workflow saved successfully!');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      if (!isAutoSave) {
        alert('Failed to save workflow');
      }
    } finally {
      setSaving(false);
    }
  }, [workflowId, workflowName, nodes, edges, router]);

  const handleExport = async () => {
    try {
      const { toPng } = await import('html-to-image');
      const canvasElement = document.querySelector('.react-flow') as HTMLElement;

      if (!canvasElement) {
        throw new Error('Canvas element not found');
      }

      // Generate PNG
      const dataUrl = await toPng(canvasElement, {
        backgroundColor: '#ffffff',
        quality: 1.0,
        pixelRatio: 2, // Higher resolution
      });

      // Download
      const link = document.createElement('a');
      link.download = `${workflowName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      alert('Workflow exported successfully!');
    } catch (error) {
      console.error('Error exporting workflow:', error);
      alert('Failed to export workflow. Please try again.');
    }
  };

  const handleAIGenerate = (workflow: any) => {
    // Set generated workflow name and data
    if (workflow.name) {
      setWorkflowName(workflow.name);
    }
    setNodes(workflow.nodes || []);
    setEdges(workflow.edges || []);

    // Show success message with suggestions
    const suggestions = workflow.metadata?.suggestions || [];
    if (suggestions.length > 0) {
      alert(`Workflow generated successfully!\n\n${suggestions.slice(0, 3).join('\n')}`);
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';

    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;

    return lastSaved.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading workflow...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/workflows">
            <Button variant="ghost" size="sm" aria-label="Go back to workflows list">
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Back
            </Button>
          </Link>
          <div>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              aria-label="Workflow name"
              className="text-xl font-semibold border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            />
            <div className="flex items-center gap-2 px-2">
              <p className="text-xs text-gray-600">
                {workflowId ? `ID: ${workflowId.slice(0, 8)}...` : 'New workflow'}
              </p>
              {lastSaved && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Check className="w-3 h-3 text-green-600" aria-hidden="true" />
                  <span>Saved {formatLastSaved()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-700 mr-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="rounded"
                aria-label="Enable auto-save"
              />
              Auto-save
            </label>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCopilot(!showCopilot)}
            className="border-purple-300 hover:bg-purple-50 text-purple-700"
            aria-label={showCopilot ? 'Hide AI Co-Pilot' : 'Show AI Co-Pilot'}
          >
            <Brain className="w-4 h-4 mr-2" aria-hidden="true" />
            Co-Pilot
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAIDialog(true)}
            className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300 hover:from-purple-100 hover:to-blue-100 text-purple-700"
            aria-label="Generate workflow with AI"
          >
            <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
            Generate with AI
          </Button>
          <Button variant="outline" onClick={handleExport} aria-label="Export workflow as image">
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            Export
          </Button>
          <Button onClick={() => handleSave(false)} disabled={saving} aria-label="Save workflow">
            <Save className="w-4 h-4 mr-2" aria-hidden="true" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        <NodeSelector />
        <div className="flex-1">
          <WorkflowCanvas
            initialNodes={nodes}
            initialEdges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
          />
        </div>
        {showCopilot && (
          <WorkflowCopilot
            nodes={nodes}
            edges={edges}
            onClose={() => setShowCopilot(false)}
          />
        )}
      </main>

      {/* AI Generate Dialog */}
      {showAIDialog && (
        <AIGenerateDialog
          onClose={() => setShowAIDialog(false)}
          onGenerate={handleAIGenerate}
        />
      )}
    </div>
  );
}
