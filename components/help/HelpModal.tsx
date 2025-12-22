'use client';

import { X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpSection {
  title: string;
  content: string;
}

interface HelpExample {
  title: string;
  description: string;
  steps: string[];
  result: string;
}

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  sections: HelpSection[];
  examples: HelpExample[];
}

export function HelpModal({ isOpen, onClose, title, description, sections, examples }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-blue-100 text-sm">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* How to Use Sections */}
          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">How to Use</h3>
            {sections.map((section, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {section.title}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Examples Section */}
          {examples.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Examples</h3>
              {examples.map((example, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-2 text-lg">{example.title}</h4>
                  <p className="text-gray-700 text-sm mb-4">{example.description}</p>

                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2 text-sm">Steps:</p>
                    <ol className="space-y-2">
                      {example.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-3 text-sm text-gray-700">
                          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </span>
                          <span className="flex-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-blue-300">
                    <p className="font-medium text-green-700 mb-1 text-sm flex items-center gap-2">
                      <span className="text-lg">✓</span>
                      Result:
                    </p>
                    <p className="text-gray-700 text-sm">{example.result}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
}
