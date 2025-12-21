'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Shield, AlertCircle, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GateDefinition } from '@/lib/emosSystem';

export const GateNode = memo(({ data, id }: NodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { setNodes } = useReactFlow();

  // Gate data from EMOS system
  const gateNumber = data.gateNumber || 0;
  const gateName = data.gateName || 'Gate';
  const question = data.question || '';
  const action = data.action || '';
  const blockedIf = data.blockedIf || '';
  const escalateTo = data.escalateTo || '';
  const description = data.description || '';
  const isBlocked = data.isBlocked || false;

  const handleFieldUpdate = (field: string, value: string | boolean) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: value,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[280px] max-w-[350px] ${
        isBlocked
          ? 'border-red-500 bg-red-50'
          : 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50'
      }`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-purple-500"
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <Shield className={`w-5 h-5 ${isBlocked ? 'text-red-600' : 'text-purple-600'}`} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700">GATE {gateNumber}</span>
              {isBlocked && (
                <AlertCircle className="w-4 h-4 text-red-500" title="Gate is blocked" />
              )}
            </div>
            <h3 className="font-bold text-sm text-gray-800">{gateName}</h3>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-purple-600 hover:text-purple-800 font-medium"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Question (Always Visible) */}
      {question && (
        <div className="mb-2">
          <p className="text-xs text-gray-700 italic">"{question}"</p>
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-2 mt-3 pt-3 border-t border-purple-200">
          {/* Description */}
          {description && (
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
              <p className="text-xs text-gray-700">{description}</p>
            </div>
          )}

          {/* Action */}
          {isEditing ? (
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Action</label>
              <textarea
                value={action}
                onChange={(e) => handleFieldUpdate('action', e.target.value)}
                className="w-full text-xs p-2 border rounded resize-none"
                rows={2}
              />
            </div>
          ) : action ? (
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Action</label>
              <p className="text-xs text-gray-700">{action}</p>
            </div>
          ) : null}

          {/* Blocked If */}
          {isEditing ? (
            <div>
              <label className="text-xs font-semibold text-red-600 block mb-1">Blocked If</label>
              <textarea
                value={blockedIf}
                onChange={(e) => handleFieldUpdate('blockedIf', e.target.value)}
                className="w-full text-xs p-2 border border-red-300 rounded resize-none"
                rows={2}
              />
            </div>
          ) : blockedIf ? (
            <div>
              <label className="text-xs font-semibold text-red-600 block mb-1">Blocked If</label>
              <p className="text-xs text-red-700">{blockedIf}</p>
            </div>
          ) : null}

          {/* Escalate To */}
          {isEditing ? (
            <div>
              <label className="text-xs font-semibold text-orange-600 flex items-center gap-1 mb-1">
                <ArrowUp className="w-3 h-3" />
                Escalate To
              </label>
              <input
                type="text"
                value={escalateTo}
                onChange={(e) => handleFieldUpdate('escalateTo', e.target.value)}
                className="w-full text-xs p-2 border border-orange-300 rounded"
              />
            </div>
          ) : escalateTo ? (
            <div>
              <label className="text-xs font-semibold text-orange-600 flex items-center gap-1 mb-1">
                <ArrowUp className="w-3 h-3" />
                Escalate To
              </label>
              <p className="text-xs text-orange-700">{escalateTo}</p>
            </div>
          ) : null}

          {/* Block/Unblock Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              variant={isBlocked ? 'destructive' : 'outline'}
              onClick={() => handleFieldUpdate('isBlocked', !isBlocked)}
              className="text-xs h-7 flex-1"
            >
              {isBlocked ? 'Unblock Gate' : 'Block Gate'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs h-7 flex-1"
            >
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          </div>
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-purple-500"
      />
    </div>
  );
});

GateNode.displayName = 'GateNode';
