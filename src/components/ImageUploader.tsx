import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function ImageUploader({ onUpload, fileInputRef }: ImageUploaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div 
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-purple-400 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600">Haz clic para subir imágenes o arrastra y suelta aquí</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </div>
    </div>
  );
}