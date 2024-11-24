import React, { useState, useRef } from 'react';
import { Flower2 } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ImageGrid } from './components/ImageGrid';
import { ActionButtons } from './components/ActionButtons';
import { classifyImage } from './utils/api';
import { downloadZip } from './utils/zip';
import { convertToJPG, createImagePreview } from './utils/imageProcessing';
import { FlowerImage } from './types';

function App() {
  const [images, setImages] = useState<FlowerImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setLoading(true);
    setError(null);

    try {
      const newImages: FlowerImage[] = await Promise.all(
        Array.from(event.target.files).map(async (file) => {
          const jpgFile = await convertToJPG(file);
          return {
            file: jpgFile,
            preview: createImagePreview(jpgFile)
          };
        })
      );
      
      setImages(prev => [...prev, ...newImages]);
    } catch (error) {
      setError('Error al procesar las imágenes');
      console.error(error);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleClassify = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const classifiedImages = await Promise.all(
        images.map(async (image) => {
          try {
            const type = await classifyImage(image.file);
            return { ...image, type };
          } catch (error) {
            console.error(`Error classifying image ${image.file.name}:`, error);
            return { ...image, type: 'No clasificada' };
          }
        })
      );
      setImages(classifiedImages);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al clasificar las imágenes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadZip(images);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al descargar el archivo ZIP');
    }
  };

  // Cleanup function to remove object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flower2 className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">Clasificador de Flores</h1>
          </div>
          <p className="text-gray-600">Sube imágenes de flores y las clasificaremos automáticamente</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <ImageUploader onUpload={handleFileUpload} fileInputRef={fileInputRef} />

        {images.length > 0 && (
          <div className="space-y-6">
            <ActionButtons
              onClassify={handleClassify}
              onDownload={handleDownload}
              loading={loading}
              hasClassifiedImages={images.some(img => img.type)}
            />
            <ImageGrid 
              images={images} 
              onRemove={handleRemoveImage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;