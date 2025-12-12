'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Layers, Target, PlaySquare, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface SearchResult {
  id: string;
  type: 'campaign' | 'playbook' | 'execution' | 'node';
  title: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  layer: number;
  url: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'campaign':
        return <Layers className="w-4 h-4 text-blue-500" />;
      case 'playbook':
        return <Target className="w-4 h-4 text-purple-500" />;
      case 'execution':
        return <PlaySquare className="w-4 h-4 text-green-500" />;
      case 'node':
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLayerLabel = (layer: number) => {
    switch (layer) {
      case 1:
        return 'Campaign';
      case 2:
        return 'Playbook';
      case 3:
        return 'Execution';
      default:
        return 'Unknown';
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-shadow"
      >
        <Search className="w-4 h-4 mr-2" />
        Search All (⌘K)
      </Button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns, playbooks, executions, nodes..."
              className="flex-1 outline-none text-gray-900 placeholder-gray-400"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
                Searching...
              </div>
            )}

            {!loading && query.length > 0 && results.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No results found for &quot;{query}&quot;
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="p-2">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                  >
                    {getIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 truncate">
                          {result.title}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          Layer {result.layer}: {getLayerLabel(result.layer)}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {result.description}
                        </p>
                      )}
                      {result.parentName && (
                        <p className="text-xs text-gray-400 mt-1">
                          in {result.parentName}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>Type to search across all layers</span>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </>
  );
}
