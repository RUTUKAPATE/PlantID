import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Leaf, 
  Info, 
  Heart, 
  Droplets, 
  Sun, 
  Thermometer, 
  Cloud, 
  Sprout,
  Lightbulb,
  Share2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Copy
} from "lucide-react";
import { Link } from "wouter";
import { PlantIdentificationResult } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function PlantDetail() {
  const [match, params] = useRoute("/plant/:id");
  const { toast } = useToast();
  const plantId = params?.id;

  const { data: plant, isLoading, error } = useQuery<PlantIdentificationResult>({
    queryKey: ['/api/identifications', plantId],
    enabled: !!plantId,
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return "High";
    if (confidence >= 60) return "Medium";
    return "Low";
  };

  const handleShare = () => {
    if (!plant) return;
    
    const shareUrl = `${window.location.origin}/plant/${plant.id}`;
    const shareData = {
      title: `Plant Identification: ${plant.commonName}`,
      text: `Check out this plant I identified: ${plant.commonName} (${plant.scientificName})`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // Fallback to copying URL
        copyToClipboard(shareUrl);
      });
    } else {
      // Copy URL to clipboard for non-mobile devices
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied!",
        description: "The plant page link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Share this link",
        description: url,
        variant: "default",
      });
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <Link href="/my-plants">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Plants
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8">
              <Skeleton className="h-8 w-64 bg-white/20 mb-2" />
              <Skeleton className="h-6 w-48 bg-white/20 mb-4" />
              <div className="flex space-x-3">
                <Skeleton className="h-6 w-20 bg-white/20" />
                <Skeleton className="h-6 w-24 bg-white/20" />
              </div>
            </div>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-4">
                      <Skeleton className="h-5 w-20 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <Link href="/my-plants">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Plants
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Plant not found or failed to load. Please try again.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/my-plants">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Plants
            </Button>
          </Link>
        </div>
        <Card className="overflow-hidden shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{plant.commonName}</h1>
                <p className="text-white/80 text-xl italic">{plant.scientificName}</p>
                <div className="flex items-center mt-3 space-x-3">
                  {plant.family && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {plant.family}
                    </Badge>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getConfidenceColor(plant.confidence)}`}></div>
                    <span className="text-sm">
                      {plant.confidence}% confidence ({getConfidenceText(plant.confidence)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <Info className="text-green-600 mr-2 h-5 w-5" />
                  Basic Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Common Name</span>
                    <span className="font-medium text-slate-800">{plant.commonName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Scientific Name</span>
                    <span className="font-medium text-slate-800 italic">{plant.scientificName}</span>
                  </div>
                  {plant.family && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-600">Family</span>
                      <span className="font-medium text-slate-800">{plant.family}</span>
                    </div>
                  )}
                  {plant.origin && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-600">Origin</span>
                      <span className="font-medium text-slate-800">{plant.origin}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Confidence</span>
                    <span className="font-medium text-green-600">{plant.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Care Guide */}
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <Heart className="text-green-600 mr-2 h-5 w-5" />
                  Care Guide
                </h2>
                <div className="space-y-4">
                  
                  {plant.wateringInstructions && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Droplets className="text-blue-500 mr-2 h-4 w-4" />
                        <h3 className="font-semibold text-slate-800">Watering</h3>
                      </div>
                      <p className="text-slate-600 text-sm">{plant.wateringInstructions}</p>
                    </div>
                  )}

                  {plant.lightRequirements && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Sun className="text-yellow-500 mr-2 h-4 w-4" />
                        <h3 className="font-semibold text-slate-800">Light</h3>
                      </div>
                      <p className="text-slate-600 text-sm">{plant.lightRequirements}</p>
                    </div>
                  )}

                  {plant.temperatureRange && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Thermometer className="text-red-500 mr-2 h-4 w-4" />
                        <h3 className="font-semibold text-slate-800">Temperature</h3>
                      </div>
                      <p className="text-slate-600 text-sm">{plant.temperatureRange}</p>
                    </div>
                  )}

                  {plant.humidityRequirements && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Cloud className="text-green-500 mr-2 h-4 w-4" />
                        <h3 className="font-semibold text-slate-800">Humidity</h3>
                      </div>
                      <p className="text-slate-600 text-sm">{plant.humidityRequirements}</p>
                    </div>
                  )}

                  {plant.soilRequirements && (
                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Sprout className="text-amber-600 mr-2 h-4 w-4" />
                        <h3 className="font-semibold text-slate-800">Soil</h3>
                      </div>
                      <p className="text-slate-600 text-sm">{plant.soilRequirements}</p>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Pro Tips */}
            {plant.careTips && plant.careTips.length > 0 && (
              <div className="mt-8 bg-slate-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                  <Lightbulb className="text-amber-500 mr-2 h-5 w-5" />
                  Pro Tips
                </h2>
                <ul className="space-y-2 text-slate-600">
                  {plant.careTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="text-green-600 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Share Button */}
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleShare}
                className="bg-green-600 hover:bg-green-700"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Plant Details
              </Button>
            </div>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}