'use client';

import { memo, useState, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Image as ImageIcon, Upload, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ImageCardNode = memo(({ data, id, selected }: NodeProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setNodes } = useReactFlow();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();

        setNodes((nodes) =>
          nodes.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  imageUrl: url,
                  imageName: file.name,
                  label: file.name,
                },
              };
            }
            return node;
          })
        );
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              imageUrl: null,
              imageName: null,
              label: 'Image Card',
            },
          };
        }
        return node;
      })
    );
  };

  const handleCaptionChange = (newCaption: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              caption: newCaption,
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
        color="#10b981"
        isVisible={selected}
        minWidth={250}
        minHeight={200}
      />
      <div
        className="shadow-md rounded-lg border-2 border-gray-200 bg-white p-3 h-full w-full"
        style={{ minWidth: '250px', minHeight: '200px' }}
      >
        {/* Optional Handles */}
        <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2 opacity-0 hover:opacity-100" />
        <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-2 !h-2 opacity-0 hover:opacity-100" />

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-gray-600">Image Card</span>
          </div>
          {data.imageUrl && (
            <button
              onClick={handleRemoveImage}
              className="p-1 hover:bg-red-50 rounded text-red-500"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Image Display */}
        {data.imageUrl ? (
          <div className="space-y-2">
            <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden group">
              <img
                src={data.imageUrl}
                alt={data.imageName || 'Uploaded image'}
                className="w-full h-full object-cover"
              />
              <a
                href={data.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4 text-gray-600" />
              </a>
            </div>

            {/* Caption Input */}
            <input
              type="text"
              value={data.caption || ''}
              onChange={(e) => handleCaptionChange(e.target.value)}
              placeholder="Add caption..."
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded bg-gray-50">
            {isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">Uploading...</p>
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <p className="text-xs text-gray-400 mt-2">or drag & drop</p>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </>
  );
});

ImageCardNode.displayName = 'ImageCardNode';
