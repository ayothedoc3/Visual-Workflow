'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Sparkles, FileText, MessageSquare, Loader2 } from 'lucide-react';

interface AIGenerateDialogProps {
  onClose: () => void;
  onGenerate: (workflow: any) => void;
}

export function AIGenerateDialog({ onClose, onGenerate }: AIGenerateDialogProps) {
  const [mode, setMode] = useState<'prompt' | 'meeting'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [transcript, setTranscript] = useState('');
  const [attendees, setAttendees] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (mode === 'prompt' && !prompt.trim()) {
      setError('Please enter a workflow description');
      return;
    }

    if (mode === 'meeting' && !transcript.trim()) {
      setError('Please enter meeting transcript');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/workflows/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          prompt: mode === 'prompt' ? prompt : undefined,
          transcript: mode === 'meeting' ? transcript : undefined,
          attendees: mode === 'meeting' ? attendees.split(',').map(a => a.trim()) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate workflow');
      }

      const workflow = await response.json();
      onGenerate(workflow);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate workflow');
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    'Create a client onboarding workflow',
    'Build a content creation process',
    'Design a support ticket workflow',
    'Create a sales pipeline',
    'Build a hiring process',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Generate Workflow with AI</h2>
              <p className="text-sm text-gray-500">Describe your workflow or paste a meeting transcript</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('prompt')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                mode === 'prompt'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="font-medium">Text Prompt</span>
            </button>
            <button
              onClick={() => setMode('meeting')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                mode === 'meeting'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">Meeting Transcript</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'prompt' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Description
                </label>
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a client onboarding workflow"
                  className="w-full"
                  autoFocus
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Transcript
                </label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste your meeting transcript here..."
                  className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attendees (optional)
                </label>
                <Input
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder="e.g., Dra, John, Azeez"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated list of meeting attendees</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• AI analyzes your input to understand the workflow type</li>
              <li>• Generates appropriate nodes (Issues, Actions, Resources, Deliverables)</li>
              <li>• Creates connections between nodes automatically</li>
              <li>• You can customize the generated workflow afterward</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading || (mode === 'prompt' && !prompt.trim()) || (mode === 'meeting' && !transcript.trim())}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Workflow
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
