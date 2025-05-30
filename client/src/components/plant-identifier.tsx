import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUpload } from "@/components/ui/file-upload";
import { PlantResults } from "./plant-results";
import { Loader2, AlertTriangle, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { PlantIdentificationResult, IdentificationResponse } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export function PlantIdentifier() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [identificationResult, setIdentificationResult] = useState<PlantIdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [savedPlantIds, setSavedPlantIds] = useState<number[]>([]);

  useEffect(() => {
  fetch("/api/my-plants", { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setSavedPlantIds(data.filter(Boolean).map((plant: any) => plant.id));
      } else {
        setSavedPlantIds([]);
      }
    });
}, []);

  const identifyMutation = useMutation({
    mutationFn: async (file: File): Promise<IdentificationResponse> => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch("/api/identify-plant", {
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
      const savedIdentification = data.identification;
      if (data.duplicate) {
        toast({
          title: "Plant Already Identified",
          description: "This plant has already been identified and saved.",
          variant: "destructive"
        });
        return;
      }
      setIdentificationResult(savedIdentification);
      queryClient.invalidateQueries({ queryKey: ["/api/identifications"] });
      setError(null);
    },
    onError: (error) => {
      console.error('Identification failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to identify plant');
      setIdentificationResult(null);
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setIdentificationResult(null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setError(null);
    setIdentificationResult(null);
  };

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [, setLocation] = useLocation();
  
  const handleIdentify = () => {
    if (!isAuthenticated) {
      setLocation('/auth');
      return;
    }

    if (selectedFile) {
      identifyMutation.mutate(selectedFile);
    }
  };

  const handleIdentifyAnother = () => {
    setSelectedFile(null);
    setIdentificationResult(null);
    setError(null);
  };

const handleSaveResult = async () => {
  if (!identificationResult) return;
  if (savedPlantIds.includes(identificationResult.id)) {
    toast({
      title: "Already Saved",
      description: "This plant is already in your collection.",
      variant: "default"
    });
    return;
  }
  try {
    const res = await fetch("/api/my-plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ plantIdentificationId: identificationResult.id }),
    });
    if (!res.ok) throw new Error("Failed to save plant");
    toast({
      title: "Plant Saved",
      description: 'Plant saved to your collection! Check "My Plants" to see all your saved plants.',
      variant: "default"
    });
    setSavedPlantIds((prev) => [...prev, identificationResult.id]); // update local state
    queryClient.invalidateQueries({ queryKey: ["/api/my-plants"] });
  } catch {
    toast({
      title: "Error",
      description: "Failed to save plant.",
      variant: "destructive"
    });
  }
};

  const handleShareResult = () => {
    if (!identificationResult) return;

    const shareUrl = `${window.location.origin}/plant/${identificationResult.id}`;
    const shareData = {
      title: `Plant Identification: ${identificationResult.commonName}`,
      text: `Check out this plant I identified: ${identificationResult.commonName} (${identificationResult.scientificName})`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // Fallback to copying URL
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Plant page link copied to clipboard!');
        }).catch(() => {
          alert(`Share this link: ${shareUrl}`);
        });
      });
    } else {
      // Copy URL to clipboard for non-mobile devices
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Plant page link copied to clipboard!');
      }).catch(() => {
        alert(`Share this link: ${shareUrl}`);
      });
    }
  };

  // Show results if we have them
  if (identificationResult) {
    return (
      <PlantResults
      result={identificationResult}
      onIdentifyAnother={handleIdentifyAnother}
      onSaveResult={handleSaveResult}
      onShareResult={handleShareResult}
      isAlreadySaved={savedPlantIds.includes(identificationResult.id)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardContent className="p-8">

          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onFileRemove={handleFileRemove}
            disabled={identifyMutation.isPending}
          />

          {/* Loading State */}
          {identifyMutation.isPending && (
            <div className="mt-8 text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
                <h4 className="text-lg font-semibold text-slate-800">Analyzing your plant...</h4>
                <p className="text-slate-600">Our AI is working hard to identify your plant. This may take a few seconds.</p>
              </div>
            </div>
          )}

          {/* Identify Button */}
          {selectedFile && !identifyMutation.isPending && (
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleIdentify}
                size="lg"
                className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Identify Plant
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
                  onClick={handleIdentifyAnother}
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