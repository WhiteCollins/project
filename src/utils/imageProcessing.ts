import imageCompression from 'browser-image-compression';

export const convertToJPG = async (file: File): Promise<File> => {
  try {
    // Compression options
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg'
    };

    // Compress and convert to JPG
    const compressedFile = await imageCompression(file, options);
    
    // Create new file with .jpg extension
    const fileName = file.name.replace(/\.[^/.]+$/, "") + '.jpg';
    return new File([compressedFile], fileName, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error converting image:', error);
    throw new Error('Failed to convert image to JPG');
  }
};

export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};