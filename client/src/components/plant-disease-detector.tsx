import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUpload } from "@/components/ui/file-upload";
import { Loader2, AlertTriangle, Search, Activity } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { PlantDiseaseResult, DiagnosisResponse } from "@/lib/types";

interface PlantDiseaseDetectorProps {
  onDiagnosisComplete?: (diagnosis: PlantDiseaseResult) => void;
}

export function PlantDiseaseDetector({ onDiagnosisComplete }: PlantDiseaseDetectorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const diagnosisMutation = useMutation({
    mutationFn: async (file: File): Promise<DiagnosisResponse> => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/diagnose-plant', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      setError(null);
      if (onDiagnosisComplete) {
        onDiagnosisComplete(data.diagnosis);
      }
    },
    onError: (error) => {
      console.error('Plant diagnosis failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to diagnose plant health');
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleDiagnose = () => {
    if (selectedFile) {
      diagnosisMutation.mutate(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onFileRemove={handleFileRemove}
            disabled={diagnosisMutation.isPending}
          />

          {/* Loading State */}
          {diagnosisMutation.isPending && (
            <div className="mt-8 text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
                <h4 className="text-lg font-semibold text-slate-800">Analyzing plant health...</h4>
                <p className="text-slate-600">Our AI is examining your plant for diseases, pests, and health issues.</p>
              </div>
            </div>
          )}

          {/* Diagnose Button */}
          {selectedFile && !diagnosisMutation.isPending && (
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleDiagnose}
                size="lg"
                className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg"
              >
                <Activity className="mr-2 h-5 w-5" />
                Diagnose Plant Health
              </Button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-8">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedFile(null);
                    setError(null);
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}