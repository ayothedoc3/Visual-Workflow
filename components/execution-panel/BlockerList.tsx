'use client';

import { useState } from 'react';
import { Plus, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Blocker {
  id: string;
  description: string;
  blocker_type: string;
  status: string;
  reported_by: string;
  assigned_to: string | null;
  created_at: string;
}

interface BlockerListProps {
  executionId: string;
  blockers: Blocker[];
  onUpdate: () => void;
}

export function BlockerList({ executionId, blockers, onUpdate }: BlockerListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBlockerDesc, setNewBlockerDesc] = useState('');
  const [newBlockerType, setNewBlockerType] = useState('other');
  const [reportedBy, setReportedBy] = useState('');

  const handleAddBlocker = async () => {
    if (!newBlockerDesc.trim() || !reportedBy.trim()) {
      alert('Description and reporter are required');
      return;
    }

    try {
      const response = await fetch(`/api/executions/${executionId}/blockers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newBlockerDesc,
          blockerType: newBlockerType,
          reportedBy,
          status: 'active'
        })
      });

      if (response.ok) {
        setNewBlockerDesc('');
        setNewBlockerType('other');
        setReportedBy('');
        setShowAddForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding blocker:', error);
      alert('Failed to add blocker');
    }
  };

  const handleResolveBlocker = async (blockerId: string) => {
    try {
      const response = await fetch(`/api/executions/${executionId}/blockers?blockerId=${blockerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          resolvedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error resolving blocker:', error);
    }
  };

  const handleDeleteBlocker = async (blockerId: string) => {
    if (!confirm('Delete this blocker?')) return;

    try {
      const response = await fetch(`/api/executions/${executionId}/blockers?blockerId=${blockerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting blocker:', error);
    }
  };

  const getBlockerTypeColor = (type: string) => {
    switch (type) {
      case 'waiting-on-person':
        return 'bg-purple-100 text-purple-800';
      case 'missing-resource':
        return 'bg-red-100 text-red-800';
      case 'external-dependency':
        return 'bg-orange-100 text-orange-800';
      case 'technical-issue':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Blockers</h3>
        <Button
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Report Blocker
        </Button>
      </div>

      {/* Add Blocker Form */}
      {showAddForm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium mb-3">Report New Blocker</h4>
          <div className="space-y-3">
            <Input
              placeholder="Blocker description"
              value={newBlockerDesc}
              onChange={(e) => setNewBlockerDesc(e.target.value)}
              className="w-full"
            />
            <select
              value={newBlockerType}
              onChange={(e) => setNewBlockerType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="waiting-on-person">Waiting on Person</option>
              <option value="missing-resource">Missing Resource</option>
              <option value="external-dependency">External Dependency</option>
              <option value="technical-issue">Technical Issue</option>
              <option value="other">Other</option>
            </select>
            <Input
              placeholder="Reported by"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddBlocker} size="sm">
                Report Blocker
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setNewBlockerDesc('');
                  setNewBlockerType('other');
                  setReportedBy('');
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

      {/* Blocker List */}
      {blockers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
          <p>No blockers! Everything is on track.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blockers.map((blocker) => (
            <div
              key={blocker.id}
              className={`p-4 rounded-lg border ${
                blocker.status === 'active'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                {blocker.status === 'active' ? (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${blocker.status === 'resolved' ? 'line-through' : ''}`}>
                    {blocker.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${getBlockerTypeColor(blocker.blocker_type)}`}>
                      {blocker.blocker_type.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      Reported by {blocker.reported_by}
                    </span>
                    {blocker.assigned_to && (
                      <span className="text-xs text-gray-500">
                        → Assigned to {blocker.assigned_to}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(blocker.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {blocker.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolveBlocker(blocker.id)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      Resolve
                    </Button>
                  )}
                  <button
                    onClick={() => handleDeleteBlocker(blocker.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
