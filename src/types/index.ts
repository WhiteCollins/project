export interface FlowerImage {
  file: File;
  preview: string;
  type?: string;
}

export interface ApiResponse {
  predictions: Array<{
    tagName: string;
    probability: number;
  }>;
}