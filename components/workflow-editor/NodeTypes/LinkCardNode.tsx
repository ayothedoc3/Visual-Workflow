'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Link as LinkIcon, ExternalLink, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LinkCardNode = memo(({ data, id, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(!data.url);
  const [urlInput, setUrlInput] = useState(data.url || '');
  const { setNodes } = useReactFlow();

  const handleSaveUrl = () => {
    if (!urlInput) {
      setIsEditing(false);
      return;
    }

    // Ensure URL has protocol
    let formattedUrl = urlInput.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              url: formattedUrl,
              label: formattedUrl,
            },
          };
        }
        return node;
      })
    );
    setIsEditing(false);
  };

  const handleNotesChange = (newNotes: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              notes: newNotes,
            },
          };
        }
        return node;
      })
    );
  };

  // Extract domain from URL for display
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <>
      <NodeResizer
        color="#8b5cf6"
        isVisible={selected}
        minWidth={250}
        minHeight={150}
      />
      <div
        className="shadow-md rounded-lg border-2 border-purple-200 bg-purple-50 p-3 h-full w-full"
        style={{ minWidth: '250px', minHeight: '150px' }}
      >
        {/* Optional Handles */}
        <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2 opacity-0 hover:opacity-100" />
        <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-2 !h-2 opacity-0 hover:opacity-100" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">Link Card</span>
          </div>
          {data.url && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-purple-100 rounded text-purple-600"
              title="Edit URL"
            >
              <Edit className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* URL Input/Display */}
        {isEditing ? (
          <div className="space-y-2 mb-3">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveUrl()}
              placeholder="https://example.com"
              className="w-full px-3 py-2 text-sm border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveUrl}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setUrlInput(data.url || '');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : data.url ? (
          <div className="mb-3">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white border border-purple-200 rounded hover:bg-purple-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                <LinkIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-purple-900 truncate">
                  {getDomain(data.url)}
                </p>
                <p className="text-xs text-purple-600 truncate">{data.url}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-600 flex-shrink-0" />
            </a>
          </div>
        ) : null}

        {/* Notes */}
        {data.url && (
          <textarea
            value={data.notes || ''}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add notes about this link..."
            className="w-full h-16 p-2 text-xs border border-purple-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        )}
      </div>
    </>
  );
});

LinkCardNode.displayName = 'LinkCardNode';
