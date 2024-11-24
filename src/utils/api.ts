import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../types';

const API_URL = 'https://iaflores-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/45d82ef8-d892-45be-86f8-256153d8a94a/classify/iterations/IAFlores/image';
const API_KEY = 'EQmaaaUlTdz9ci5PTIhsEQD7ezwl1Xf2zvPgR84yjA4eqYx6YbqTJQQJ99AKACYeBjFXJ3w3AAAIACOGWYNg';

export const classifyImage = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.post<ApiResponse>(API_URL, arrayBuffer, {
      headers: {
        'Prediction-Key': API_KEY,
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!response.data.predictions?.length) {
      throw new Error('No predictions received from API');
    }

    const topPrediction = response.data.predictions[0];
    if (topPrediction.probability < 0.5) {
      throw new Error('Low confidence prediction');
    }

    return topPrediction.tagName;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error de API: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};