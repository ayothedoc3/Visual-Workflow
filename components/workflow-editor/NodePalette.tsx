'use client';

import { AlertCircle, Play, FileText, CheckCircle, StickyNote, Shield, Type, Image, Link, Folder, MessageSquare, ArrowRight, Pencil } from 'lucide-react';

interface NodePaletteProps {
  viewMode?: 'workflow' | 'board';
}

export function NodePalette({ viewMode = 'workflow' }: NodePaletteProps) {
  const nodeTypes = [
    {
      type: 'issue' as const,
      label: 'Issue',
      icon: AlertCircle,
      color: 'bg-red-100 border-red-300 hover:bg-red-200 text-red-700',
      description: 'Problem or challenge'
    },
    {
      type: 'action' as const,
      label: 'Action',
      icon: Play,
      color: 'bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-700',
      description: 'Executable task'
    },
    {
      type: 'resource' as const,
      label: 'Resource',
      icon: FileText,
      color: 'bg-green-100 border-green-300 hover:bg-green-200 text-green-700',
      description: 'Supporting material & files'
    },
    {
      type: 'deliverable' as const,
      label: 'Deliverable',
      icon: CheckCircle,
      color: 'bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-700',
      description: 'Output or result'
    },
    {
      type: 'gate' as const,
      label: 'Gate',
      icon: Shield,
      color: 'bg-indigo-100 border-indigo-300 hover:bg-indigo-200 text-indigo-700',
      description: 'EMOS gate checkpoint'
    },
    {
      type: 'sticky' as const,
      label: 'Note',
      icon: StickyNote,
      color: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200 text-yellow-700',
      description: 'Sticky note'
    },
    {
      type: 'text-card' as const,
      label: 'Text Card',
      icon: Type,
      color: 'bg-orange-100 border-orange-300 hover:bg-orange-200 text-orange-700',
      description: 'Freeform text card'
    },
    {
      type: 'image-card' as const,
      label: 'Image Card',
      icon: Image,
      color: 'bg-cyan-100 border-cyan-300 hover:bg-cyan-200 text-cyan-700',
      description: 'Image with caption'
    },
    {
      type: 'link-card' as const,
      label: 'Link Card',
      icon: Link,
      color: 'bg-violet-100 border-violet-300 hover:bg-violet-200 text-violet-700',
      description: 'URL link with notes'
    },
    {
      type: 'section' as const,
      label: 'Section',
      icon: Folder,
      color: 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700',
      description: 'Group container'
    },
    {
      type: 'annotation' as const,
      label: 'Annotation',
      icon: MessageSquare,
      color: 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700',
      description: 'Floating text label'
    },
    {
      type: 'arrow' as const,
      label: 'Arrow',
      icon: ArrowRight,
      color: 'bg-indigo-100 border-indigo-300 hover:bg-indigo-200 text-indigo-700',
      description: 'Visual direction arrow'
    },
    {
      type: 'drawing' as const,
      label: 'Drawing',
      icon: Pencil,
      color: 'bg-pink-100 border-pink-300 hover:bg-pink-200 text-pink-700',
      description: 'Freehand sketch'
    }
  ];

  // Reorder nodes based on view mode
  const displayedNodes = viewMode === 'board'
    ? [
        ...nodeTypes.filter(n => ['text-card', 'image-card', 'link-card', 'section', 'annotation', 'arrow', 'drawing', 'sticky'].includes(n.type)),
        ...nodeTypes.filter(n => !['text-card', 'image-card', 'link-card', 'section', 'annotation', 'arrow', 'drawing', 'sticky'].includes(n.type))
      ]
    : nodeTypes;

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-xl shadow-xl border-2 border-gray-300 p-3 w-48">
      <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
        {viewMode === 'board' ? 'Add Card' : 'Add Node'}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {displayedNodes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(e) => onDragStart(e, nodeType.type)}
              className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 transition-all cursor-grab active:cursor-grabbing hover:scale-105 ${nodeType.color}`}
              title={`Drag to add ${nodeType.label}`}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              <span className="text-xs font-semibold">{nodeType.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-[10px] text-gray-400 text-center">
          Drag to canvas • Select & Delete to remove
        </p>
      </div>
    </div>
  );
}
