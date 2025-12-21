'use client';

import { useState, useEffect } from 'react';
import {
  Upload,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Cloud,
  HardDrive,
} from 'lucide-react';

interface MigrationStatus {
  migrated: boolean;
  migratedAt?: string;
  stats?: {
    total: number;
    success: number;
    failed: number;
  };
  urlMappingCount?: number;
}

interface ScanResult {
  totalFiles: number;
  files: {
    localPath: string;
    cloudinaryId: string;
    type: string;
    size: number;
  }[];
}

interface MigrationResult {
  stats: {
    total: number;
    uploaded: number;
    failed: number;
  };
  urlMapping: Record<string, string>;
  failed: { file: string; error: string }[];
}

export default function MigratePage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [updatingDb, setUpdatingDb] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/media/migrate');
      const data = await response.json();
      setStatus(data);
      if (data.migrated) {
        setCurrentStep(3);
      }
    } catch (err) {
      setError('Failed to check migration status');
    } finally {
      setLoading(false);
    }
  };

  const scanFiles = async () => {
    setScanning(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/media/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan' }),
      });
      const data = await response.json();
      setScanResult(data);
      setCurrentStep(2);
    } catch (err) {
      setError('Failed to scan files');
    } finally {
      setScanning(false);
    }
  };

  const migrateFiles = async () => {
    setMigrating(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/media/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'migrate' }),
      });
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setMigrationResult(data);
        setCurrentStep(3);
      }
    } catch (err) {
      setError('Failed to migrate files');
    } finally {
      setMigrating(false);
    }
  };

  const updateDatabase = async () => {
    setUpdatingDb(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/media/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-database' }),
      });
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setCurrentStep(4);
        checkStatus();
      }
    } catch (err) {
      setError('Failed to update database');
    } finally {
      setUpdatingDb(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Cloudinary Migration</h1>
        <p className="text-slate-400 mt-1">
          Migrate all local media files to Cloudinary for optimized delivery
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
            &times;
          </button>
        </div>
      )}

      {/* Migration Status */}
      {status?.migrated && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">Migration Completed</p>
                <p className="text-sm text-green-400/70">
                  {status.stats?.success} files migrated on {new Date(status.migratedAt!).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentStep(1);
                setScanResult(null);
                setMigrationResult(null);
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Re-migrate Files
            </button>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[
          { num: 1, label: 'Scan Files' },
          { num: 2, label: 'Upload to Cloudinary' },
          { num: 3, label: 'Update Database' },
          { num: 4, label: 'Complete' },
        ].map((step, index) => (
          <div key={step.num} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= step.num
                  ? 'bg-[#37AFE1] text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {currentStep > step.num ? <CheckCircle className="w-5 h-5" /> : step.num}
            </div>
            <span className={`ml-2 ${currentStep >= step.num ? 'text-white' : 'text-slate-500'}`}>
              {step.label}
            </span>
            {index < 3 && <ArrowRight className="w-5 h-5 mx-4 text-slate-600" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Step 1: Scan */}
        <div className={`bg-[#1E293B] rounded-xl border border-slate-700/50 p-6 ${currentStep !== 1 && currentStep !== 4 && 'opacity-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Step 1: Scan Local Files</h3>
              <p className="text-sm text-slate-400">Find all images and videos in /public</p>
            </div>
          </div>

          {scanResult && (
            <div className="mb-4 p-4 bg-[#0F172A] rounded-lg">
              <p className="text-white font-medium mb-2">Found {scanResult.totalFiles} files</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {scanResult.files.slice(0, 20).map((file, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-slate-400 truncate">{file.localPath}</span>
                    <span className="text-slate-500">{formatBytes(file.size)}</span>
                  </div>
                ))}
                {scanResult.totalFiles > 20 && (
                  <p className="text-slate-500 text-xs">...and {scanResult.totalFiles - 20} more</p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={scanFiles}
            disabled={scanning || (currentStep > 1 && currentStep < 4)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {scanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <HardDrive className="w-4 h-4" />
                Scan Files
              </>
            )}
          </button>
        </div>

        {/* Step 2: Migrate */}
        <div className={`bg-[#1E293B] rounded-xl border border-slate-700/50 p-6 ${currentStep !== 2 && 'opacity-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Cloud className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Step 2: Upload to Cloudinary</h3>
              <p className="text-sm text-slate-400">Upload all files to Cloudinary CDN</p>
            </div>
          </div>

          {migrationResult && (
            <div className="mb-4 p-4 bg-[#0F172A] rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{migrationResult.stats.total}</p>
                  <p className="text-xs text-slate-400">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{migrationResult.stats.uploaded}</p>
                  <p className="text-xs text-slate-400">Uploaded</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">{migrationResult.stats.failed}</p>
                  <p className="text-xs text-slate-400">Failed</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={migrateFiles}
            disabled={migrating || currentStep !== 2}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50"
          >
            {migrating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Uploading... (this may take a while)
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload to Cloudinary
              </>
            )}
          </button>
        </div>

        {/* Step 3: Update Database */}
        <div className={`bg-[#1E293B] rounded-xl border border-slate-700/50 p-6 ${currentStep !== 3 && 'opacity-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Step 3: Update Database</h3>
              <p className="text-sm text-slate-400">Replace local URLs with Cloudinary URLs</p>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-4">
            This will update all database records (team members, blogs, projects, services, content) 
            to use Cloudinary URLs instead of local paths.
          </p>

          <button
            onClick={updateDatabase}
            disabled={updatingDb || currentStep !== 3}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            {updatingDb ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Updating Database...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Update Database Records
              </>
            )}
          </button>
        </div>

        {/* Step 4: Complete */}
        <div className={`bg-[#1E293B] rounded-xl border border-slate-700/50 p-6 ${currentStep !== 4 && 'opacity-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Step 4: Migration Complete</h3>
              <p className="text-sm text-slate-400">All media is now served from Cloudinary</p>
            </div>
          </div>

          {currentStep === 4 && (
            <div className="space-y-3">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✓ All images and videos are now optimized and served via Cloudinary CDN
                </p>
              </div>
              <div className="text-sm text-slate-400">
                <p className="mb-2">Benefits you now have:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Automatic format conversion (WebP/AVIF)</li>
                  <li>Responsive image sizing</li>
                  <li>Global CDN delivery</li>
                  <li>Automatic quality optimization</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-[#1E293B] rounded-xl border border-slate-700/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <p className="text-white font-medium">Important Notes</p>
            <ul className="text-sm text-slate-400 mt-2 space-y-1">
              <li>• The migration process may take several minutes depending on the number of files</li>
              <li>• Original files in /public will remain as backup</li>
              <li>• After migration, new uploads will automatically go to Cloudinary</li>
              <li>• The CloudinaryImage component will automatically use optimized URLs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
