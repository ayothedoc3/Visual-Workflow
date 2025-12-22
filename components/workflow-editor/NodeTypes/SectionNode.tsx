'use client';

import { memo, useState } from 'react';
import { NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Folder, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

const SECTION_COLORS = [
  { name: 'Blue', bg: 'bg-blue-50/80', border: 'border-blue-300', text: 'text-blue-700', header: 'bg-blue-100/80' },
  { name: 'Purple', bg: 'bg-purple-50/80', border: 'border-purple-300', text: 'text-purple-700', header: 'bg-purple-100/80' },
  { name: 'Green', bg: 'bg-green-50/80', border: 'border-green-300', text: 'text-green-700', header: 'bg-green-100/80' },
  { name: 'Orange', bg: 'bg-orange-50/80', border: 'border-orange-300', text: 'text-orange-700', header: 'bg-orange-100/80' },
  { name: 'Pink', bg: 'bg-pink-50/80', border: 'border-pink-300', text: 'text-pink-700', header: 'bg-pink-100/80' },
  { name: 'Gray', bg: 'bg-gray-50/80', border: 'border-gray-300', text: 'text-gray-700', header: 'bg-gray-100/80' },
];

export const SectionNode = memo(({ data, id, selected }: NodeProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(data.title || 'Section');
  const { setNodes } = useReactFlow();

  const currentColor = data.color || 'Blue';
  const colorScheme = SECTION_COLORS.find(c => c.name === currentColor) || SECTION_COLORS[0];
  const isCollapsed = data.collapsed || false;

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                title: titleInput.trim(),
                label: titleInput.trim(),
              },
            };
          }
          return node;
        })
      );
    }
    setIsEditingTitle(false);
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
  };

  const handleToggleCollapse = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              collapsed: !isCollapsed,
            },
            style: {
              ...node.style,
              height: !isCollapsed ? '60px' : (node.style?.height || '400px'),
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <>
      <NodeResizer
        color={colorScheme.border.replace('border-', '#')}
        isVisible={selected && !isCollapsed}
        minWidth={400}
        minHeight={300}
      />
      <div
        className={`rounded-lg border-2 ${colorScheme.border} ${colorScheme.bg} backdrop-blur-sm h-full w-full relative overflow-hidden`}
        style={{ minWidth: '400px', minHeight: isCollapsed ? '60px' : '300px' }}
      >
        {/* Header */}
        <div className={`${colorScheme.header} backdrop-blur-sm border-b-2 ${colorScheme.border} p-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2 flex-1">
            <Folder className={`w-5 h-5 ${colorScheme.text}`} />
            {isEditingTitle ? (
              <input
                autoFocus
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                className={`flex-1 px-2 py-1 text-sm font-semibold ${colorScheme.text} bg-white border ${colorScheme.border} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            ) : (
              <h3
                className={`text-sm font-bold ${colorScheme.text} flex-1 cursor-text`}
                onClick={() => setIsEditingTitle(true)}
              >
                {data.title || 'Section'}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Color Picker */}
            <div className="flex gap-1 mr-2">
              {SECTION_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.name)}
                  className={`w-4 h-4 rounded-full border-2 ${color.bg.replace('/80', '')} ${color.border} hover:scale-125 transition-transform ${
                    currentColor === color.name ? 'ring-2 ring-offset-1 ring-gray-600' : ''
                  }`}
                  title={color.name}
                />
              ))}
            </div>

            {/* Collapse Button */}
            <button
              onClick={handleToggleCollapse}
              className={`p-1 hover:bg-white/50 rounded ${colorScheme.text}`}
              title={isCollapsed ? 'Expand section' : 'Collapse section'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Content Area - Only show when expanded */}
        {!isCollapsed && (
          <div className="p-4 h-full">
            <div className="text-xs text-gray-400 italic text-center mt-8">
              Drag cards and nodes into this section to organize them
            </div>
          </div>
        )}

        {/* Collapsed State */}
        {isCollapsed && (
          <div className={`px-3 py-2 text-xs ${colorScheme.text} italic`}>
            Section collapsed
          </div>
        )}
      </div>
    </>
  );
});

SectionNode.displayName = 'SectionNode';
