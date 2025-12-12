'use client';

import { memo, useState, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Paperclip, X, Download, Eye, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileData {
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export const FileAttachment = memo(({ data, id }: NodeProps) => {
  const [file, setFile] = useState<FileData | null>(data.file || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setNodes, deleteElements } = useReactFlow();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Check file size (max 10MB for now)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Upload file to API route
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      const fileData: FileData = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        url: result.url,
        uploadedAt: new Date().toISOString(),
      };

      setFile(fileData);

      // Update node data
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                file: fileData,
              },
            };
          }
          return node;
        })
      );
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const getFileIcon = () => {
    if (!file) return <File className="w-6 h-6" />;

    if (file.type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else {
      return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-gray-400 bg-white min-w-[250px] max-w-[300px]">
      {/* File attachments don't connect to workflow - no handles */}

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-semibold text-gray-600">File Attachment</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-6 w-6 p-0 hover:bg-gray-200"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {file ? (
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(file.url, '_blank')}
              className="flex-1"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const a = document.createElement('a');
                a.href = file.url;
                a.download = file.name;
                a.click();
              }}
              className="flex-1"
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Replace File
          </Button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full bg-gray-700 hover:bg-gray-800"
            size="sm"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Paperclip className="w-3 h-3 mr-2" />
                Attach File
              </>
            )}
          </Button>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            PDF, DOC, TXT, Images (max 10MB)
          </p>
        </div>
      )}
    </div>
  );
});

FileAttachment.displayName = 'FileAttachment';
