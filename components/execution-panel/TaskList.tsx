'use client';

import { useState } from 'react';
import { Plus, Check, Circle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  description: string;
  status: string;
  assignee: string | null;
  due_date: string | null;
  priority: string;
}

interface TaskListProps {
  executionId: string;
  tasks: Task[];
  onUpdate: () => void;
}

export function TaskList({ executionId, tasks, onUpdate }: TaskListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const handleAddTask = async () => {
    if (!newTaskDesc.trim()) return;

    try {
      const response = await fetch(`/api/executions/${executionId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newTaskDesc,
          assignee: newTaskAssignee || null,
          status: 'not-started',
          priority: 'medium'
        })
      });

      if (response.ok) {
        setNewTaskDesc('');
        setNewTaskAssignee('');
        setShowAddForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'not-started' : 'completed';

    try {
      const response = await fetch(`/api/executions/${executionId}/tasks?taskId=${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          completedDate: newStatus === 'completed' ? new Date().toISOString() : null
        })
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;

    try {
      const response = await fetch(`/api/executions/${executionId}/tasks?taskId=${taskId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Circle className="w-5 h-5 text-blue-600" />;
      case 'blocked':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-blue-600 bg-blue-50';
      case 'low':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Button
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium mb-3">New Task</h4>
          <div className="space-y-3">
            <Input
              placeholder="Task description"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Assignee (optional)"
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddTask} size="sm">
                Add Task
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setNewTaskDesc('');
                  setNewTaskAssignee('');
                }}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No tasks yet. Add your first task to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <button
                onClick={() => handleToggleTask(task.id, task.status)}
                className="flex-shrink-0 hover:scale-110 transition-transform"
              >
                {getStatusIcon(task.status)}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {task.description}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  {task.assignee && <span>👤 {task.assignee}</span>}
                  {task.due_date && (
                    <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
                  )}
                  <span className={`px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
