'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  X,
  Download,
  FileText,
  CheckSquare,
  BarChart3,
  Code,
  BookOpen,
  HelpCircle,
  Target,
  Save,
} from 'lucide-react';

interface PlaybookOutput {
  type: string;
  title: string;
  content: string;
  format: string;
  description: string;
}

interface PlaybookViewerProps {
  playbook: {
    name: string;
    description: string;
    outputs: PlaybookOutput[];
    templates: any[];
    metadata: any;
  };
  onClose: () => void;
  onSaveTemplates?: (templates: any[]) => void;
}

const iconMap: Record<string, any> = {
  workflow: Code,
  sop: FileText,
  templates: BookOpen,
  clickup: CheckSquare,
  n8n: Code,
  'training-checklist': CheckSquare,
  'executive-summary': BarChart3,
  faq: HelpCircle,
  metrics: Target,
};

export function PlaybookViewer({ playbook, onClose, onSaveTemplates }: PlaybookViewerProps) {
  const [selectedOutput, setSelectedOutput] = useState(playbook.outputs[0]);

  const downloadOutput = (output: PlaybookOutput) => {
    const blob = new Blob([output.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const extension = output.format === 'json' ? 'json' : output.format === 'markdown' ? 'md' : 'txt';
    link.download = `${playbook.name}_${output.type}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllOutputs = () => {
    playbook.outputs.forEach(output => {
      setTimeout(() => downloadOutput(output), 100);
    });
  };

  const handleSaveTemplates = () => {
    if (onSaveTemplates && playbook.templates.length > 0) {
      onSaveTemplates(playbook.templates);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{playbook.name}</h2>
              <p className="text-sm text-gray-500">{playbook.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {playbook.templates.length > 0 && onSaveTemplates && (
              <Button variant="outline" onClick={handleSaveTemplates}>
                <Save className="w-4 h-4 mr-2" />
                Save {playbook.templates.length} Templates
              </Button>
            )}
            <Button variant="outline" onClick={downloadAllOutputs}>
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Output List */}
          <div className="w-64 border-r border-gray-200 overflow-y-auto bg-gray-50">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Playbook Contents</h3>
              <div className="space-y-1">
                {playbook.outputs.map((output, index) => {
                  const Icon = iconMap[output.type] || FileText;
                  const isSelected = selectedOutput === output;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedOutput(output)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'bg-white hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{output.title}</p>
                        <p
                          className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}
                        >
                          {output.format.toUpperCase()}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Playbook Stats</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Total Outputs</span>
                  <span className="font-semibold text-gray-900">{playbook.outputs.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Templates</span>
                  <span className="font-semibold text-gray-900">{playbook.templates.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Confidence</span>
                  <span className="font-semibold text-green-600">
                    {Math.round(playbook.metadata.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Content Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedOutput.title}</h3>
                <p className="text-sm text-gray-500">{selectedOutput.description}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => downloadOutput(selectedOutput)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl">
                {selectedOutput.format === 'markdown' ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                      {selectedOutput.content}
                    </pre>
                  </div>
                ) : selectedOutput.format === 'json' ? (
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(JSON.parse(selectedOutput.content), null, 2)}
                    </pre>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                    {selectedOutput.content}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Generated: {new Date(playbook.metadata.generatedAt).toLocaleString()} | Source:{' '}
            {playbook.metadata.source}
          </p>
        </div>
      </div>
    </div>
  );
}
