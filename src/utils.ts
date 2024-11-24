import axios from 'axios';
import JSZip from 'jszip';

const API_URL = 'https://iaflores-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/45d82ef8-d892-45be-86f8-256153d8a94a/classify/iterations/IAFlores/image';
const API_KEY = 'EQmaaaUlTdz9ci5PTIhsEQD7ezwl1Xf2zvPgR84yjA4eqYx6YbqTJQQJ99AKACYeBjFXJ3w3AAAIACOGWYNg';

export const classifyImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(API_URL, file, {
      headers: {
        'Prediction-Key': API_KEY,
        'Content-Type': 'application/octet-stream',
      },
    });

    // Asumiendo que la API devuelve las predicciones ordenadas por probabilidad
    const topPrediction = response.data.predictions[0];
    return topPrediction.tagName;
  } catch (error) {
    console.error('Error calling Azure Custom Vision API:', error);
    throw new Error('Failed to classify image');
  }
};

export const downloadZip = async (images: Array<{ file: File; type?: string }>) => {
  const zip = new JSZip();

  // Agrupar imágenes por tipo
  const imagesByType: { [key: string]: File[] } = {};
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
        folder.file(`${type}_${index + 1}${getFileExtension(file.name)}`, file);
      });
    }
  });

  // Generar y descargar el ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'flores_clasificadas.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 1);
};