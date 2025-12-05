'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { WorkflowCanvas } from '@/components/workflow-editor/WorkflowCanvas';
import { NodeSelector } from '@/components/workflow-editor/NodeSelector';
import { Button } from '@/components/ui/button';
import { Save, Download, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { Node, Edge } from 'reactflow';
import { useRouter } from 'next/navigation';

export default function WorkflowEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [workflowId, setWorkflowId] = useState<string | null>(
    params.id === 'new' ? null : params.id
  );
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(params.id !== 'new');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load workflow if editing existing
  useEffect(() => {
    if (params.id !== 'new') {
      loadWorkflow(params.id);
    }
  }, [params.id]);

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
      const response = await fetch(`/api/workflows/${id}`);

      if (!response.ok) {
        throw new Error('Failed to load workflow');
      }

      const workflow = await response.json();
      setWorkflowName(workflow.name);
      setNodes(workflow.nodes || []);
      setEdges(workflow.edges || []);
      setLastSaved(new Date(workflow.updatedAt));
    } catch (error) {
      console.error('Error loading workflow:', error);
      alert('Failed to load workflow');
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

      let response;

      if (workflowId) {
        // Update existing workflow
        response = await fetch(`/api/workflows/${workflowId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workflowData),
        });
      } else {
        // Create new workflow
        response = await fetch('/api/workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workflowData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save workflow');
      }

      const savedWorkflow = await response.json();

      // If this was a new workflow, update the ID and URL
      if (!workflowId) {
        setWorkflowId(savedWorkflow.id);
        router.replace(`/workflows/${savedWorkflow.id}`);
      }

      setLastSaved(new Date());

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

  const handleExport = () => {
    console.log('Exporting workflow');
    // TODO: Implement export functionality (Phase 4)
    alert('Export feature coming in Phase 4!');
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
            <div className="flex items-center gap-2 px-2">
              <p className="text-xs text-gray-500">
                {workflowId ? `ID: ${workflowId.slice(0, 8)}...` : 'New workflow'}
              </p>
              {lastSaved && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Saved {formatLastSaved()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 mr-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="rounded"
              />
              Auto-save
            </label>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => handleSave(false)} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
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
