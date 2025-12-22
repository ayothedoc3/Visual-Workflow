'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { Type } from 'lucide-react';

const FONT_SIZES = [
  { label: 'Small', value: 'text-sm', size: 12 },
  { label: 'Medium', value: 'text-base', size: 14 },
  { label: 'Large', value: 'text-lg', size: 16 },
  { label: 'XL', value: 'text-xl', size: 20 },
  { label: '2XL', value: 'text-2xl', size: 24 },
];

const TEXT_COLORS = [
  { name: 'Black', class: 'text-gray-900' },
  { name: 'Gray', class: 'text-gray-500' },
  { name: 'Red', class: 'text-red-600' },
  { name: 'Blue', class: 'text-blue-600' },
  { name: 'Green', class: 'text-green-600' },
  { name: 'Purple', class: 'text-purple-600' },
  { name: 'Orange', class: 'text-orange-600' },
];

export const AnnotationNode = memo(({ data, id, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(!data.text);
  const [text, setText] = useState(data.text || 'Click to edit');
  const [showToolbar, setShowToolbar] = useState(false);
  const { setNodes } = useReactFlow();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fontSize = data.fontSize || 'text-base';
  const textColor = data.textColor || 'text-gray-900';
  const isBold = data.isBold || false;
  const isItalic = data.isItalic || false;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              text: newText,
              label: newText.slice(0, 30),
            },
          };
        }
        return node;
      })
    );
  };

  const handleStyleChange = (updates: Partial<typeof data>) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      })
    );
  };

  const handleBlur = () => {
    if (text.trim()) {
      setIsEditing(false);
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
    >
      {/* Toolbar - Only visible on hover or when selected */}
      {(showToolbar || selected) && !isEditing && (
        <div className="absolute -top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-1.5 flex items-center gap-1 z-10">
          {/* Font Size */}
          <select
            value={fontSize}
            onChange={(e) => handleStyleChange({ fontSize: e.target.value })}
            className="text-xs border border-gray-300 rounded px-1.5 py-1 bg-white"
          >
            {FONT_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>

          {/* Bold */}
          <button
            onClick={() => handleStyleChange({ isBold: !isBold })}
            className={`px-2 py-1 rounded text-xs font-bold ${
              isBold ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Bold"
          >
            B
          </button>

          {/* Italic */}
          <button
            onClick={() => handleStyleChange({ isItalic: !isItalic })}
            className={`px-2 py-1 rounded text-xs italic ${
              isItalic ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Italic"
          >
            I
          </button>

          {/* Color Picker */}
          <div className="flex gap-0.5 ml-1 border-l pl-1">
            {TEXT_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleStyleChange({ textColor: color.class })}
                className={`w-4 h-4 rounded-full ${color.class} ${
                  textColor === color.class ? 'ring-2 ring-offset-1 ring-gray-600' : ''
                }`}
                style={{ backgroundColor: 'currentColor' }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Annotation Text */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleBlur();
            }
          }}
          className={`${fontSize} ${textColor} ${isBold ? 'font-bold' : 'font-normal'} ${
            isItalic ? 'italic' : ''
          } bg-transparent border-none outline-none resize-none overflow-hidden min-w-[100px] min-h-[30px]`}
          style={{
            width: 'auto',
            height: 'auto',
          }}
          rows={1}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={`${fontSize} ${textColor} ${isBold ? 'font-bold' : 'font-normal'} ${
            isItalic ? 'italic' : ''
          } cursor-text whitespace-pre-wrap break-words min-w-[100px]`}
        >
          {text}
        </div>
      )}

      {/* Edit indicator on hover */}
      {!isEditing && (showToolbar || selected) && (
        <div className="absolute -right-6 top-0 text-gray-400">
          <Type className="w-3 h-3" />
        </div>
      )}
    </div>
  );
});

AnnotationNode.displayName = 'AnnotationNode';
