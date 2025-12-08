'use client';

import { useState } from 'react';
import { Plus, ExternalLink, FileText, User, DollarSign, Package, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Resource {
  id: string;
  name: string;
  type: string;
  status: string;
  url: string | null;
  notes: string | null;
}

interface ResourceListProps {
  executionId: string;
  resources: Resource[];
  onUpdate: () => void;
}

export function ResourceList({ executionId, resources, onUpdate }: ResourceListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceType, setNewResourceType] = useState('document');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceNotes, setNewResourceNotes] = useState('');

  const handleAddResource = async () => {
    if (!newResourceName.trim()) {
      alert('Resource name is required');
      return;
    }

    try {
      const response = await fetch(`/api/executions/${executionId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newResourceName,
          type: newResourceType,
          url: newResourceUrl || null,
          notes: newResourceNotes || null,
          status: 'available'
        })
      });

      if (response.ok) {
        setNewResourceName('');
        setNewResourceType('document');
        setNewResourceUrl('');
        setNewResourceNotes('');
        setShowAddForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Failed to add resource');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('Delete this resource?')) return;

    try {
      const response = await fetch(`/api/executions/${executionId}/resources?resourceId=${resourceId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'tool':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'person':
        return <User className="w-5 h-5 text-purple-600" />;
      case 'budget':
        return <DollarSign className="w-5 h-5 text-yellow-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Resources</h3>
        <Button
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Add Resource Form */}
      {showAddForm && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium mb-3">New Resource</h4>
          <div className="space-y-3">
            <Input
              placeholder="Resource name"
              value={newResourceName}
              onChange={(e) => setNewResourceName(e.target.value)}
              className="w-full"
            />
            <select
              value={newResourceType}
              onChange={(e) => setNewResourceType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="tool">Tool</option>
              <option value="document">Document</option>
              <option value="person">Person</option>
              <option value="budget">Budget</option>
              <option value="other">Other</option>
            </select>
            <Input
              placeholder="URL (optional)"
              value={newResourceUrl}
              onChange={(e) => setNewResourceUrl(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Notes (optional)"
              value={newResourceNotes}
              onChange={(e) => setNewResourceNotes(e.target.value)}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddResource} size="sm">
                Add Resource
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setNewResourceName('');
                  setNewResourceType('document');
                  setNewResourceUrl('');
                  setNewResourceNotes('');
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

      {/* Resource List */}
      {resources.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No resources added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <div className="flex items-start gap-3">
                {getResourceIcon(resource.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{resource.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 capitalize mb-2">{resource.type}</p>

                  {resource.notes && (
                    <p className="text-xs text-gray-600 mb-2">{resource.notes}</p>
                  )}

                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open resource
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteResource(resource.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
