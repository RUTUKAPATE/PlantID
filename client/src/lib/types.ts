export interface PlantIdentificationResult {
  id: number;
  commonName: string;
  scientificName: string;
  family?: string;
  origin?: string;
  confidence: number;
  wateringInstructions?: string;
  lightRequirements?: string;
  temperatureRange?: string;
  humidityRequirements?: string;
  soilRequirements?: string;
  careTips?: string[];
  imageUrl?: string;
  createdAt: string;
}

export interface IdentificationResponse {
  success: boolean;
  identification: PlantIdentificationResult;
}
