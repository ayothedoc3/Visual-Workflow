'use client';

import { memo, useState } from 'react';
import { NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { ArrowRight, RotateCw } from 'lucide-react';

const ARROW_STYLES = [
  { name: 'Solid', class: 'border-solid', width: 3 },
  { name: 'Dashed', class: 'border-dashed', width: 3 },
  { name: 'Dotted', class: 'border-dotted', width: 3 },
  { name: 'Thick', class: 'border-solid', width: 5 },
];

const ARROW_COLORS = [
  { name: 'Black', class: 'border-gray-900', bg: 'bg-gray-900' },
  { name: 'Gray', class: 'border-gray-400', bg: 'bg-gray-400' },
  { name: 'Red', class: 'border-red-500', bg: 'bg-red-500' },
  { name: 'Blue', class: 'border-blue-500', bg: 'bg-blue-500' },
  { name: 'Green', class: 'border-green-500', bg: 'bg-green-500' },
  { name: 'Purple', class: 'border-purple-500', bg: 'bg-purple-500' },
  { name: 'Orange', class: 'border-orange-500', bg: 'bg-orange-500' },
];

const ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315];

export const ArrowNode = memo(({ data, id, selected }: NodeProps) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const { setNodes } = useReactFlow();

  const rotation = data.rotation || 0;
  const arrowStyle = data.arrowStyle || 'Solid';
  const arrowColor = data.arrowColor || 'Black';

  const currentStyle = ARROW_STYLES.find((s) => s.name === arrowStyle) || ARROW_STYLES[0];
  const currentColor = ARROW_COLORS.find((c) => c.name === arrowColor) || ARROW_COLORS[0];

  const handleRotate = () => {
    const currentIndex = ROTATIONS.indexOf(rotation);
    const nextRotation = ROTATIONS[(currentIndex + 1) % ROTATIONS.length];
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              rotation: nextRotation,
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

  return (
    <>
      <NodeResizer
        color={currentColor.bg.replace('bg-', '#')}
        isVisible={selected}
        minWidth={100}
        minHeight={40}
      />
      <div
        className="relative group h-full w-full"
        style={{ minWidth: '100px', minHeight: '40px' }}
        onMouseEnter={() => setShowToolbar(true)}
        onMouseLeave={() => setShowToolbar(false)}
      >
        {/* Toolbar */}
        {(showToolbar || selected) && (
          <div className="absolute -top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-1.5 flex items-center gap-2 z-10">
            {/* Rotate Button */}
            <button
              onClick={handleRotate}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-xs"
              title="Rotate 45°"
            >
              <RotateCw className="w-3 h-3" />
              {rotation}°
            </button>

            {/* Style Picker */}
            <select
              value={arrowStyle}
              onChange={(e) => handleStyleChange({ arrowStyle: e.target.value })}
              className="text-xs border border-gray-300 rounded px-1.5 py-1 bg-white"
            >
              {ARROW_STYLES.map((style) => (
                <option key={style.name} value={style.name}>
                  {style.name}
                </option>
              ))}
            </select>

            {/* Color Picker */}
            <div className="flex gap-0.5 border-l pl-2">
              {ARROW_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleStyleChange({ arrowColor: color.name })}
                  className={`w-4 h-4 rounded-full ${color.bg} ${
                    arrowColor === color.name ? 'ring-2 ring-offset-1 ring-gray-600' : ''
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Arrow Shape */}
        <div
          className="relative h-full w-full flex items-center justify-center"
          style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.2s' }}
        >
          {/* Arrow Line */}
          <div
            className={`absolute left-0 right-8 top-1/2 -translate-y-1/2 ${currentStyle.class} ${currentColor.class}`}
            style={{
              borderTopWidth: `${currentStyle.width}px`,
            }}
          />

          {/* Arrow Head */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: `16px solid currentColor`,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
            }}
          >
            <div className={currentColor.bg} style={{ width: 0, height: 0 }} />
          </div>
        </div>
      </div>
    </>
  );
});

ArrowNode.displayName = 'ArrowNode';
