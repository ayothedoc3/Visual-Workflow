'use client';

import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { StickyNote as StickyNoteIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const StickyNote = memo(({ data, id }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(!data.text);
  const [text, setText] = useState(data.text || '');
  const [color, setColor] = useState(data.color || '#fef3c7'); // Default yellow
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setNodes, deleteElements } = useReactFlow();

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              text,
              color,
            },
          };
        }
        return node;
      })
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const colors = [
    { name: 'Yellow', value: '#fef3c7' },
    { name: 'Pink', value: '#fce7f3' },
    { name: 'Blue', value: '#dbeafe' },
    { name: 'Green', value: '#d1fae5' },
    { name: 'Purple', value: '#e9d5ff' },
  ];

  return (
    <div
      className="px-4 py-3 shadow-lg rounded-lg border-2 border-gray-300 min-w-[250px] max-w-[300px]"
      style={{ backgroundColor: color }}
    >
      {/* Sticky notes don't connect to workflow - no handles */}

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <StickyNoteIcon className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-semibold text-gray-600">Sticky Note</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-6 w-6 p-0 hover:bg-gray-200"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your note here..."
            className="w-full min-h-[100px] p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
            style={{ backgroundColor: 'transparent' }}
          />

          <div className="flex gap-1 mb-2">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-6 h-6 rounded border-2 ${
                  color === c.value ? 'border-gray-600' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>

          <Button
            onClick={handleSave}
            size="sm"
            className="w-full bg-gray-700 hover:bg-gray-800"
          >
            Save Note
          </Button>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-pointer min-h-[100px] text-sm text-gray-800 whitespace-pre-wrap break-words"
        >
          {text || 'Click to add note...'}
        </div>
      )}
    </div>
  );
});

StickyNote.displayName = 'StickyNote';
