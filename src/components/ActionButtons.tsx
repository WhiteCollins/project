import React from 'react';
import { Loader2, Download } from 'lucide-react';

interface ActionButtonsProps {
  onClassify: () => Promise<void>;
  onDownload: () => Promise<void>;
  loading: boolean;
  hasClassifiedImages: boolean;
}

export function ActionButtons({ onClassify, onDownload, loading, hasClassifiedImages }: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={onClassify}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        Clasificar Imágenes
      </button>
      <button
        onClick={onDownload}
        disabled={!hasClassifiedImages}
        className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
      >
        <Download className="w-5 h-5" />
        Descargar ZIP
      </button>
    </div>
  );
}