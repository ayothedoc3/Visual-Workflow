'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Copy, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Workflow } from '@/lib/schema';
import { useRouter } from 'next/navigation';

export default function WorkflowsPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    filterWorkflows();
  }, [searchQuery, workflows]);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows');
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data);
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterWorkflows = () => {
    if (!searchQuery) {
      setFilteredWorkflows(workflows);
      return;
    }

    const filtered = workflows.filter((w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredWorkflows(filtered);
  };

  const handleDuplicate = async (id: string, name: string) => {
    if (!confirm(`Duplicate workflow "${name}"?`)) return;

    try {
      const response = await fetch(`/api/workflows/${id}/duplicate`, {
        method: 'POST',
      });

      if (response.ok) {
        const newWorkflow = await response.json();
        router.push(`/workflows/${newWorkflow.id}`);
      } else {
        alert('Failed to duplicate workflow');
      }
    } catch (error) {
      console.error('Error duplicating workflow:', error);
      alert('Failed to duplicate workflow');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete workflow "${name}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchWorkflows();
      } else {
        alert('Failed to delete workflow');
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
      alert('Failed to delete workflow');
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading workflows...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Workflows</h1>
            <p className="text-gray-600">
              {workflows.length} workflow{workflows.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <Link href="/workflows/new">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Workflow
            </Button>
          </Link>
        </div>

        {/* Search */}
        {workflows.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Workflow List */}
        {filteredWorkflows.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">
              {workflows.length === 0
                ? 'No workflows yet'
                : 'No workflows match your search'}
            </p>
            <Link href="/workflows/new">
              <Button>Create your first workflow</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Thumbnail placeholder */}
                <div className="h-40 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center border-b border-gray-200">
                  <div className="text-gray-400 text-sm">
                    {(workflow.nodes as any[])?.length || 0} nodes
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">
                    {workflow.name}
                  </h3>

                  {workflow.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {workflow.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Updated {formatDate(workflow.updatedAt)}</span>
                    <span>
                      {(workflow.edges as any[])?.length || 0} connections
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/workflows/${workflow.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(workflow.id, workflow.name)}
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(workflow.id, workflow.name)}
                      title="Delete"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
