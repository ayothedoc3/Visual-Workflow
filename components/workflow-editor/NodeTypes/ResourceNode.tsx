'use client';

import { memo, useState, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Wrench, Paperclip, X, Eye, Download, FileText, Image as ImageIcon, File, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateDropdown } from '../TemplateDropdown';
import type { Template } from '@/lib/storage';

interface FileData {
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export const ResourceNode = memo(({ data, id }: NodeProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditingSoftware, setIsEditingSoftware] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setNodes } = useReactFlow();

  const attachedFile: FileData | null = data.attachedFile || null;

  const handleTemplateSelect = (template: Template) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              templateId: template.id,
              label: template.name,
              description: template.description,
              category: template.category,
              tags: template.tags,
            },
          };
        }
        return node;
      })
    );
    setShowDropdown(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Upload failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const { url } = result;

      const fileData: FileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        uploadedAt: new Date().toISOString(),
      };

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                attachedFile: fileData,
              },
            };
          }
          return node;
        })
      );
    } catch (error) {
      console.error('File upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'File upload failed. Please try again.';
      alert(errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              attachedFile: null,
            },
          };
        }
        return node;
      })
    );
  };

  const isImage = (type: string) => type.startsWith('image/');
  const isPDF = (type: string) => type === 'application/pdf';

  const getFileIcon = (type: string) => {
    if (isImage(type)) return <ImageIcon className="w-4 h-4" />;
    if (isPDF(type)) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleSoftwareUpdate = (value: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              software: value,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <>
      <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-green-500 bg-white min-w-[200px] max-w-[250px]">
        {/* Resource is middle node - input from left, output to right */}
        <Handle type="target" position={Position.Left} className="!bg-green-500 !w-3 !h-3" />
        <Handle type="source" position={Position.Right} className="!bg-green-500 !w-3 !h-3" />

        <div className="flex items-center gap-2 mb-2">
          <Wrench className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-700">Resource</span>
        </div>

        {/* Template Section */}
        {data.templateId ? (
          <div className="mb-3 space-y-2">
            <p className="text-sm font-medium text-gray-900 break-words">{data.label}</p>
            {data.description && (
              <p className="text-xs text-gray-500 break-words">{data.description}</p>
            )}

            {/* Software Assignment */}
            <div className="pt-2 border-t">
              {isEditingSoftware ? (
                <>
                  <label className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <Laptop className="w-3 h-3" />
                    Software
                  </label>
                  <input
                    type="text"
                    value={data.software || ''}
                    onChange={(e) => handleSoftwareUpdate(e.target.value)}
                    placeholder="Tool or platform..."
                    className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 mb-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingSoftware(false)}
                    className="w-full text-xs"
                  >
                    Done
                  </Button>
                </>
              ) : (
                <>
                  {data.software && (
                    <div className="flex items-center gap-1 text-xs text-gray-700 mb-1">
                      <Laptop className="w-3 h-3 text-green-500" />
                      <span className="truncate">{data.software}</span>
                    </div>
                  )}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingSoftware(true)}
                      className="flex-1 text-xs"
                    >
                      {data.software ? 'Edit' : 'Add'} Software
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDropdown(true)}
                      className="flex-1 text-xs"
                    >
                      Change
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowDropdown(true)}
            className="w-full bg-green-500 hover:bg-green-600 mb-3"
            size="sm"
          >
            Select Template
          </Button>
        )}

        {/* File Attachment Section */}
        <div className="border-t pt-3">
          {attachedFile ? (
            <div className="space-y-2">
              {/* Image Preview */}
              {isImage(attachedFile.type) && (
                <div className="relative w-full h-32 bg-gray-50 rounded overflow-hidden">
                  <img
                    src={attachedFile.url}
                    alt={attachedFile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* File Info */}
              <div className="flex items-start gap-2">
                {getFileIcon(attachedFile.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {attachedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(attachedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Remove file"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1">
                <a
                  href={attachedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  <Eye className="w-3 h-3" />
                  View
                </a>
                <a
                  href={attachedFile.url}
                  download={attachedFile.name}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  <Download className="w-3 h-3" />
                  Download
                </a>
              </div>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full bg-green-100 hover:bg-green-200 text-green-700 border border-green-300"
                size="sm"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-700 mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Paperclip className="w-3 h-3 mr-2" />
                    Attach File
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {showDropdown && (
        <TemplateDropdown
          nodeType="resource"
          onSelect={handleTemplateSelect}
          onClose={() => setShowDropdown(false)}
          currentTemplateId={data.templateId}
        />
      )}
    </>
  );
});

ResourceNode.displayName = 'ResourceNode';
