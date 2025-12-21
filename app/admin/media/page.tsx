'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Copy,
  Check,
  X,
  Search,
  Grid,
  List,
  RefreshCw,
  Download,
  ExternalLink,
  Folder,
  ChevronRight,
  Home,
  FolderOpen,
} from 'lucide-react';

interface MediaFile {
  publicId: string;
  url: string;
  format: string;
  width: number;
  height: number;
  size: number;
  type: string;
  createdAt: string;
  folder?: string;
}

interface CloudinaryFolder {
  name: string;
  path: string;
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [subfolders, setSubfolders] = useState<CloudinaryFolder[]>([]);

  // Fetch folders from Cloudinary
  const fetchFolders = useCallback(async (folder: string = '') => {
    setFoldersLoading(true);
    try {
      const response = await fetch(`/api/admin/media/folders?folder=${encodeURIComponent(folder)}`);
      const data = await response.json();
      setSubfolders(data.folders || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setSubfolders([]);
    } finally {
      setFoldersLoading(false);
    }
  }, []);

  // Fetch files from Cloudinary
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/media?type=${mediaType}&folder=${encodeURIComponent(currentFolder)}`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [mediaType, currentFolder]);

  // Fetch folders when current folder changes
  useEffect(() => {
    fetchFolders(currentFolder);
  }, [currentFolder, fetchFolders]);

  // Fetch files when media type or folder changes
  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const navigateToFolder = (folderPath: string) => {
    setCurrentFolder(folderPath);
    setSelectedFile(null);
  };

  const handleUpload = async (fileList: FileList) => {
    setUploading(true);
    const uploadPromises = Array.from(fileList).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', currentFolder || 'rising-dot');

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      return response.json();
    });

    try {
      await Promise.all(uploadPromises);
      fetchMedia();
      fetchFolders(currentFolder);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };


  const handleDelete = async (publicId: string, resourceType: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, resourceType }),
      });

      if (response.ok) {
        setFiles(files.filter((f) => f.publicId !== publicId));
        if (selectedFile?.publicId === publicId) {
          setSelectedFile(null);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredFiles = files.filter((file) =>
    file.publicId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get breadcrumb parts
  const breadcrumbs = currentFolder ? currentFolder.split('/') : [];

  return (
    <div className="min-h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Media Library</h1>
          <p className="text-slate-400 mt-1">
            Manage your images and videos with Cloudinary
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchMedia(); fetchFolders(currentFolder); }}
            className="p-2 bg-[#1E293B] border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload Files
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />
          </label>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-[#1E293B] rounded-lg border border-slate-700/50">
        <button
          onClick={() => navigateToFolder('')}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
            !currentFolder ? 'text-[#37AFE1]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Root</span>
        </button>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <button
              onClick={() => navigateToFolder(breadcrumbs.slice(0, index + 1).join('/'))}
              className={`px-2 py-1 rounded transition-colors ${
                index === breadcrumbs.length - 1 
                  ? 'text-[#37AFE1]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {crumb}
            </button>
          </div>
        ))}
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`mb-6 border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragActive ? 'border-[#37AFE1] bg-[#37AFE1]/10' : 'border-slate-700 bg-[#1E293B]'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
            <p className="text-slate-400">Uploading files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-10 h-10 text-slate-500" />
            <p className="text-slate-400">Drag and drop files here, or click "Upload Files"</p>
            {currentFolder && (
              <p className="text-xs text-[#37AFE1]">Uploading to: {currentFolder}</p>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex bg-[#1E293B] rounded-lg border border-slate-700 p-1">
          <button
            onClick={() => setMediaType('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              mediaType === 'image' ? 'bg-[#37AFE1] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Images
          </button>
          <button
            onClick={() => setMediaType('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              mediaType === 'video' ? 'bg-[#37AFE1] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            Videos
          </button>
        </div>
        
        <span className="text-slate-500 text-sm">
          {filteredFiles.length} files | {subfolders.length} folders
        </span>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
          />
        </div>

        <div className="flex bg-[#1E293B] rounded-lg border border-slate-700 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>


      <div className="flex gap-6">
        {/* Main Content - Folders and Files */}
        <div className="flex-1">
          {/* Subfolders */}
          {foldersLoading ? (
            <div className="flex items-center gap-2 mb-6 text-slate-400">
              <div className="w-4 h-4 border-2 border-slate-600 border-t-[#37AFE1] rounded-full animate-spin" />
              Loading folders...
            </div>
          ) : subfolders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Folders ({subfolders.length})
              </h3>
              <div className="grid grid-cols-6 gap-3">
                {subfolders.map((folder) => (
                  <button
                    key={folder.path}
                    onClick={() => navigateToFolder(folder.path)}
                    className="flex flex-col items-center gap-2 p-4 bg-[#1E293B] rounded-xl border border-slate-700/50 hover:border-[#37AFE1]/50 hover:bg-[#1E293B]/80 transition-all group"
                  >
                    <FolderOpen className="w-10 h-10 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                    <span className="text-sm text-slate-300 truncate w-full text-center">
                      {folder.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <ImageIcon className="w-16 h-16 mb-4" />
              <p>No {mediaType}s found in this folder</p>
              <p className="text-sm">Upload some files or navigate to another folder</p>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Files ({filteredFiles.length})
              </h3>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-5 gap-4">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.publicId}
                      onClick={() => setSelectedFile(file)}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedFile?.publicId === file.publicId
                          ? 'border-[#37AFE1]'
                          : 'border-transparent hover:border-slate-600'
                      }`}
                    >
                      <div className="aspect-square bg-[#0F172A]">
                        {file.type === 'video' ? (
                          <video src={file.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={file.url} alt={file.publicId} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(file.url); }}
                          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        >
                          {copiedUrl === file.url ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-white" />
                          )}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(file.publicId, file.type); }}
                          className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-xs text-white truncate">{file.publicId.split('/').pop()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-4 text-slate-400 font-medium">Preview</th>
                        <th className="text-left p-4 text-slate-400 font-medium">Name</th>
                        <th className="text-left p-4 text-slate-400 font-medium">Size</th>
                        <th className="text-left p-4 text-slate-400 font-medium">Dimensions</th>
                        <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr
                          key={file.publicId}
                          onClick={() => setSelectedFile(file)}
                          className={`border-b border-slate-700/50 cursor-pointer transition-colors ${
                            selectedFile?.publicId === file.publicId ? 'bg-[#37AFE1]/10' : 'hover:bg-slate-700/30'
                          }`}
                        >
                          <td className="p-4">
                            <div className="w-12 h-12 rounded overflow-hidden bg-[#0F172A]">
                              {file.type === 'video' ? (
                                <video src={file.url} className="w-full h-full object-cover" />
                              ) : (
                                <img src={file.url} alt={file.publicId} className="w-full h-full object-cover" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-white">{file.publicId.split('/').pop()}</td>
                          <td className="p-4 text-slate-400">{formatFileSize(file.size)}</td>
                          <td className="p-4 text-slate-400">{file.width} × {file.height}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); copyToClipboard(file.url); }}
                                className="p-2 hover:bg-slate-700 rounded transition-colors"
                              >
                                {copiedUrl === file.url ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(file.publicId, file.type); }}
                                className="p-2 hover:bg-red-500/20 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>


        {/* File Details Panel */}
        {selectedFile && (
          <div className="w-80 shrink-0 bg-[#1E293B] rounded-xl border border-slate-700/50 p-4 h-fit sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">File Details</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="aspect-video bg-[#0F172A] rounded-lg overflow-hidden mb-4">
              {selectedFile.type === 'video' ? (
                <video src={selectedFile.url} controls className="w-full h-full object-contain" />
              ) : (
                <img src={selectedFile.url} alt={selectedFile.publicId} className="w-full h-full object-contain" />
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">File Name</p>
                <p className="text-sm text-white break-all">{selectedFile.publicId.split('/').pop()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Folder</p>
                <p className="text-sm text-slate-400 break-all">{selectedFile.folder || 'Root'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Format</p>
                  <p className="text-sm text-white uppercase">{selectedFile.format}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Size</p>
                  <p className="text-sm text-white">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Width</p>
                  <p className="text-sm text-white">{selectedFile.width}px</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Height</p>
                  <p className="text-sm text-white">{selectedFile.height}px</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">URL</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedFile.url}
                    readOnly
                    className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-400"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedFile.url)}
                    className="p-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                  >
                    {copiedUrl === selectedFile.url ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href={selectedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
                <a
                  href={selectedFile.url}
                  download
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>

              <button
                onClick={() => handleDelete(selectedFile.publicId, selectedFile.type)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
