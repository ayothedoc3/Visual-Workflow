'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Type, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CARD_COLORS = [
  { name: 'Yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-gray-800' },
  { name: 'Blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-gray-800' },
  { name: 'Pink', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-gray-800' },
  { name: 'Green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-gray-800' },
  { name: 'Purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-gray-800' },
  { name: 'White', bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-800' },
];

export const TextCardNode = memo(({ data, id, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { setNodes } = useReactFlow();

  const currentColor = data.color || 'Yellow';
  const colorScheme = CARD_COLORS.find(c => c.name === currentColor) || CARD_COLORS[0];

  const handleTextChange = (newText: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              text: newText,
              label: newText.slice(0, 50) || 'Text Card',
            },
          };
        }
        return node;
      })
    );
  };

  const handleColorChange = (colorName: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              color: colorName,
            },
          };
        }
        return node;
      })
    );
    setShowColorPicker(false);
  };

  return (
    <>
      <NodeResizer
        color="#3b82f6"
        isVisible={selected}
        minWidth={200}
        minHeight={100}
      />
      <div
        className={`shadow-md rounded-lg border-2 ${colorScheme.bg} ${colorScheme.border} ${colorScheme.text} p-4 h-full w-full`}
        style={{ minWidth: '200px', minHeight: '100px' }}
      >
        {/* Optional Handles - only show if connected */}
        <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2 opacity-0 hover:opacity-100" />
        <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-2 !h-2 opacity-0 hover:opacity-100" />

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-500">Text Card</span>
          </div>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1 hover:bg-white/50 rounded"
            title="Change color"
          >
            <Palette className="w-3 h-3 text-gray-500" />
          </button>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10 flex gap-2">
            {CARD_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.name)}
                className={`w-6 h-6 rounded border-2 ${color.bg} ${color.border} hover:scale-110 transition-transform`}
                title={color.name}
              />
            ))}
          </div>
        )}

        {/* Content */}
        {isEditing ? (
          <textarea
            autoFocus
            value={data.text || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className={`w-full h-32 p-2 text-sm ${colorScheme.bg} border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Type your text here..."
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="w-full h-32 text-sm whitespace-pre-wrap overflow-auto cursor-text hover:bg-white/30 rounded p-1"
          >
            {data.text || <span className="text-gray-400 italic">Click to add text...</span>}
          </div>
        )}
      </div>
    </>
  );
});

TextCardNode.displayName = 'TextCardNode';
