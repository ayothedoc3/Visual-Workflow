'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Pen, Eraser, Trash2 } from 'lucide-react';

const BRUSH_SIZES = [
  { label: 'Thin', value: 2 },
  { label: 'Medium', value: 4 },
  { label: 'Thick', value: 8 },
  { label: 'XL', value: 12 },
];

const BRUSH_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#9CA3AF' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#F59E0B' },
];

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
}

export const DrawingNode = memo(({ data, id, selected }: NodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(data.brushSize || 4);
  const [brushColor, setBrushColor] = useState(data.brushColor || '#000000');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [strokes, setStrokes] = useState<Stroke[]>(data.strokes || []);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const { setNodes } = useReactFlow();

  // Redraw canvas whenever strokes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.stroke();
    });

    // Draw current stroke in progress
    if (currentStroke.length > 1) {
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : brushColor;
      ctx.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);

      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }

      ctx.stroke();
    }
  }, [strokes, currentStroke, brushColor, brushSize, tool]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentStroke((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    const newStroke: Stroke = {
      points: currentStroke,
      color: tool === 'eraser' ? '#FFFFFF' : brushColor,
      size: tool === 'eraser' ? brushSize * 2 : brushSize,
    };

    const updatedStrokes = [...strokes, newStroke];
    setStrokes(updatedStrokes);
    setCurrentStroke([]);
    setIsDrawing(false);

    // Save to node data
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              strokes: updatedStrokes,
              brushSize,
              brushColor,
            },
          };
        }
        return node;
      })
    );
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              strokes: [],
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
        color="#F97316"
        isVisible={selected}
        minWidth={300}
        minHeight={200}
      />
      <div
        className="bg-white border-2 border-orange-200 rounded-lg shadow-md overflow-hidden h-full w-full"
        style={{ minWidth: '300px', minHeight: '200px' }}
      >
        {/* Toolbar */}
        <div className="bg-orange-50 border-b border-orange-200 p-2 flex items-center gap-2 flex-wrap">
          {/* Tool Selection */}
          <div className="flex gap-1">
            <button
              onClick={() => setTool('pen')}
              className={`p-1.5 rounded ${
                tool === 'pen' ? 'bg-orange-200' : 'hover:bg-orange-100'
              }`}
              title="Pen"
            >
              <Pen className="w-4 h-4 text-orange-700" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-1.5 rounded ${
                tool === 'eraser' ? 'bg-orange-200' : 'hover:bg-orange-100'
              }`}
              title="Eraser"
            >
              <Eraser className="w-4 h-4 text-orange-700" />
            </button>
          </div>

          {/* Brush Size */}
          {tool === 'pen' && (
            <select
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="text-xs border border-orange-300 rounded px-2 py-1 bg-white"
            >
              {BRUSH_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          )}

          {/* Color Picker */}
          {tool === 'pen' && (
            <div className="flex gap-1">
              {BRUSH_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setBrushColor(color.value)}
                  className={`w-5 h-5 rounded-full border-2 ${
                    brushColor === color.value
                      ? 'border-orange-600 ring-2 ring-orange-300'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          )}

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="ml-auto p-1.5 hover:bg-orange-100 rounded flex items-center gap-1 text-xs text-orange-700"
            title="Clear drawing"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full cursor-crosshair bg-white"
          style={{ touchAction: 'none' }}
        />
      </div>
    </>
  );
});

DrawingNode.displayName = 'DrawingNode';
