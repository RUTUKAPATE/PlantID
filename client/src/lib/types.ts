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

export interface PlantDiseaseResult {
  id: number;
  plantName: string;
  diseaseName: string;
  diseaseType: 'disease' | 'pest' | 'deficiency' | 'environmental' | 'healthy';
  severity: 'mild' | 'moderate' | 'severe';
  confidence: number;
  symptoms: string[];
  causes: string[];
  treatmentOptions: string[];
  preventionTips: string[];
  immediateActions: string[];
  affectedParts: string[];
  imageUrl?: string;
  createdAt: string;
}

export interface DiagnosisResponse {
  success: boolean;
  diagnosis: PlantDiseaseResult;
}