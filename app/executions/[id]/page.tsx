'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, CheckCircle2, Circle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskList } from '@/components/execution-panel/TaskList';
import { BlockerList } from '@/components/execution-panel/BlockerList';
import { ResourceList } from '@/components/execution-panel/ResourceList';

interface Execution {
  id: string;
  name: string;
  status: string;
  progress: number;
  primary_assignee: string | null;
  team_members: string[];
  start_date: string | null;
  due_date: string | null;
  completed_date: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  playbook_name: string;
  playbook_id: string;
  campaign_id: string;
  tasks: any[];
  blockers: any[];
  resources: any[];
}

export default function ExecutionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const executionId = params.id as string;

  const [execution, setExecution] = useState<Execution | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'blockers' | 'resources'>('tasks');

  useEffect(() => {
    if (executionId) {
      fetchExecution();
    }
  }, [executionId]);

  const fetchExecution = async () => {
    try {
      const response = await fetch(`/api/executions/${executionId}`);
      if (response.ok) {
        const data = await response.json();
        setExecution(data);
      }
    } catch (error) {
      console.error('Error fetching execution:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Circle className="w-5 h-5 text-blue-600" />;
      case 'blocked':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading execution...</p>
        </div>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="text-center py-12">
          <p className="text-red-600">Execution not found</p>
          <Button onClick={() => router.push('/campaigns')} className="mt-4">
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  const completedTasks = execution.tasks.filter(t => t.status === 'completed').length;
  const totalTasks = execution.tasks.length;
  const activeBlockers = execution.blockers.filter(b => b.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => router.push('/campaigns')}
            className="hover:text-blue-600 hover:underline"
          >
            Campaigns
          </button>
          <span>/</span>
          <button
            onClick={() => router.push(`/campaigns/${execution.campaign_id}`)}
            className="hover:text-blue-600 hover:underline"
          >
            Campaign
          </button>
          <span>/</span>
          <button
            onClick={() => router.push(`/playbooks/${execution.playbook_id}`)}
            className="hover:text-blue-600 hover:underline"
          >
            {execution.playbook_name}
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{execution.name}</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/playbooks/${execution.playbook_id}`)}
            className="mb-4 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Playbook
          </Button>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(execution.status)}
                  <h1 className="text-3xl font-semibold">{execution.name}</h1>
                </div>
                <p className="text-gray-600 mb-4">Playbook: {execution.playbook_name}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Primary Assignee</p>
                    <p className="font-medium">{execution.primary_assignee || 'Unassigned'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Team Members</p>
                    <p className="font-medium">{execution.team_members.length} member{execution.team_members.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Due Date</p>
                    <p className="font-medium">
                      {execution.due_date ? new Date(execution.due_date).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Hours</p>
                    <p className="font-medium">
                      {execution.actual_hours || 0} / {execution.estimated_hours || 0}h
                    </p>
                  </div>
                </div>
              </div>

              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(execution.status)}`}>
                {execution.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    Tasks: {completedTasks} / {totalTasks} completed
                  </span>
                  {activeBlockers > 0 && (
                    <span className="flex items-center text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {activeBlockers} active blocker{activeBlockers !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">{execution.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${execution.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>Layer 3: Execution View</strong> - Manage individual tasks, track blockers, and organize resources. This is where the actual work gets done.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow-lg border border-gray-200 border-b-0">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tasks ({totalTasks})
            </button>
            <button
              onClick={() => setActiveTab('blockers')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'blockers'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Blockers ({activeBlockers})
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'resources'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Resources ({execution.resources.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-lg p-6 border border-gray-200">
          {activeTab === 'tasks' && (
            <TaskList
              executionId={executionId}
              tasks={execution.tasks}
              onUpdate={fetchExecution}
            />
          )}
          {activeTab === 'blockers' && (
            <BlockerList
              executionId={executionId}
              blockers={execution.blockers}
              onUpdate={fetchExecution}
            />
          )}
          {activeTab === 'resources' && (
            <ResourceList
              executionId={executionId}
              resources={execution.resources}
              onUpdate={fetchExecution}
            />
          )}
        </div>
      </div>
    </div>
  );
}
