import React from 'react';
import { X } from 'lucide-react';
import { FlowerImage } from '../types';

interface ImageGridProps {
  images: FlowerImage[];
  onRemove: (index: number) => void;
}

export function ImageGrid({ images, onRemove }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative bg-white rounded-lg shadow-md overflow-hidden group">
          <button
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <img
            src={image.preview}
            alt={`Flower ${index + 1}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <p className="text-sm text-gray-600">
              {image.type ? `Tipo: ${image.type}` : 'Sin clasificar'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {image.file.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}