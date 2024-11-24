import JSZip from 'jszip';
import { FlowerImage } from '../types';

export const downloadZip = async (images: FlowerImage[]) => {
  try {
    const zip = new JSZip();
    const imagesByType: Record<string, File[]> = {};

    // Agrupar imágenes por tipo
    images.forEach(image => {
      if (image.type) {
        if (!imagesByType[image.type]) {
          imagesByType[image.type] = [];
        }
        imagesByType[image.type].push(image.file);
      }
    });

    // Crear carpetas y añadir archivos
    Object.entries(imagesByType).forEach(([type, files]) => {
      const folder = zip.folder(type);
      if (folder) {
        files.forEach((file, index) => {
          const extension = file.name.split('.').pop() || '';
          folder.file(`${type}_${index + 1}.${extension}`, file);
        });
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flores_clasificadas.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error('Error al crear el archivo ZIP');
  }
};