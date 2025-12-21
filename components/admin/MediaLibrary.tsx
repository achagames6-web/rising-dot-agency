'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Edit2,
  X,
  Check,
  Image as ImageIcon,
  Video,
  File,
  Download,
  Copy,
} from 'lucide-react';

interface MediaItem {
  id: number;
  url: string;
  alternative_text: string;
  width: number | null;
  height: number | null;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Fetch media
  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchQuery,
        mimeType: filterType,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`/api/admin/media?${params}`);
      if (!response.ok) throw new Error('Failed to fetch media');

      const data = await response.json();
      setMedia(data.media);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching media:', error);
      alert('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterType, offset]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Handle file upload
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alternativeText', file.name);

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');
        return response.json();
      });

      await Promise.all(uploadPromises);
      await fetchMedia();
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    handleUpload(files);
  };

  // Delete selected items
  const handleDelete = async () => {
    if (selectedItems.size === 0) return;

    if (!confirm(`Delete ${selectedItems.size} item(s)?`)) return;

    try {
      const response = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedItems) }),
      });

      if (!response.ok) throw new Error('Delete failed');

      await fetchMedia();
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Failed to delete media');
    }
  };

  // Update alt text
  const handleUpdateAltText = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/media/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alternative_text: editAltText }),
      });

      if (!response.ok) throw new Error('Update failed');

      await fetchMedia();
      setEditingItem(null);
      setEditAltText('');
    } catch (error) {
      console.error('Error updating media:', error);
      alert('Failed to update media');
    }
  };

  // Toggle selection
  const toggleSelection = (id: number) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  // Select all
  const selectAll = () => {
    if (selectedItems.size === media.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(media.map((item) => item.id)));
    }
  };

  // Copy URL to clipboard
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard');
  };

  // Get file icon
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-6 h-6" />;
    if (mimeType.startsWith('video/')) return <Video className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Media Library</h1>
          <p className="text-slate-600 mt-1">
            {total} file{total !== 1 ? 's' : ''} total
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by filename or alt text..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOffset(0);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter */}
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setOffset(0);
          }}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>

        {/* Bulk actions */}
        {selectedItems.size > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">
              {selectedItems.size} selected
            </span>
            <button
              onClick={handleDelete}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Select All */}
      {media.length > 0 && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedItems.size === media.length}
            onChange={selectAll}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-sm text-slate-600">Select All</label>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'}
        `}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center rounded-lg z-10">
            <div className="text-center">
              <Upload className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-medium text-blue-600">Drop files here</p>
            </div>
          </div>
        )}

        {/* Media Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600 mt-4">Loading media...</p>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No media files yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Upload files or drag and drop them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className={`
                  relative group bg-white rounded-lg border-2 overflow-hidden cursor-pointer
                  transition-all hover:shadow-lg
                  ${selectedItems.has(item.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'}
                `}
                onClick={() => toggleSelection(item.id)}
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-slate-100 flex items-center justify-center">
                  {item.mime_type.startsWith('image/') ? (
                    <Image
                      src={item.url}
                      alt={item.alternative_text || 'Media'}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-400">
                      {getFileIcon(item.mime_type)}
                    </div>
                  )}
                </div>

                {/* Selection checkbox */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelection(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingItem(item);
                      setEditAltText(item.alternative_text);
                    }}
                    className="p-1.5 bg-white rounded shadow-lg hover:bg-slate-50"
                    title="Edit alt text"
                  >
                    <Edit2 className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(item.url);
                    }}
                    className="p-1.5 bg-white rounded shadow-lg hover:bg-slate-50"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4 text-slate-600" />
                  </button>
                  <a
                    href={item.url}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-white rounded shadow-lg hover:bg-slate-50"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                  </a>
                </div>

                {/* Info */}
                <div className="p-2 bg-white">
                  <p className="text-xs text-slate-600 truncate" title={item.alternative_text}>
                    {item.alternative_text || 'No alt text'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatFileSize(item.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            {offset + 1} - {Math.min(offset + limit, total)} of {total}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Edit Alt Text</h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditAltText('');
                }}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="mb-4">
              {editingItem.mime_type.startsWith('image/') ? (
                <Image
                  src={editingItem.url}
                  alt={editingItem.alternative_text}
                  width={400}
                  height={300}
                  className="w-full h-48 object-contain bg-slate-100 rounded"
                />
              ) : (
                <div className="w-full h-48 bg-slate-100 rounded flex items-center justify-center">
                  {getFileIcon(editingItem.mime_type)}
                </div>
              )}
            </div>

            {/* Alt text input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Alternative Text
              </label>
              <input
                type="text"
                value={editAltText}
                onChange={(e) => setEditAltText(e.target.value)}
                placeholder="Describe this image..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">
                Provide a description for accessibility and SEO
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditAltText('');
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAltText}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
