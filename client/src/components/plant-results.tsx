import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Bookmark,
  Share2,
  Plus,
  CheckCircle
} from "lucide-react";
import { PlantIdentificationResult } from "@/lib/types";

interface PlantResultsProps {
  result: PlantIdentificationResult;
  onIdentifyAnother: () => void;
  onSaveResult?: () => void;
  onShareResult?: () => void;
}

export function PlantResults({ 
  result, 
  onIdentifyAnother, 
  onSaveResult, 
  onShareResult 
}: PlantResultsProps) {
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

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Leaf className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">{result.commonName}</h3>
              <p className="text-white/80 text-lg italic">{result.scientificName}</p>
              <div className="flex items-center mt-3 space-x-3">
                {result.family && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {result.family}
                  </Badge>
                )}
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getConfidenceColor(result.confidence)}`}></div>
                  <span className="text-sm">
                    {result.confidence}% confidence ({getConfidenceText(result.confidence)})
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
              <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <Info className="text-green-600 mr-2 h-5 w-5" />
                Basic Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Common Name</span>
                  <span className="font-medium text-slate-800">{result.commonName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Scientific Name</span>
                  <span className="font-medium text-slate-800 italic">{result.scientificName}</span>
                </div>
                {result.family && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Family</span>
                    <span className="font-medium text-slate-800">{result.family}</span>
                  </div>
                )}
                {result.origin && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Origin</span>
                    <span className="font-medium text-slate-800">{result.origin}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Confidence</span>
                  <span className="font-medium text-green-600">{result.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Care Guide */}
            <div>
              <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <Heart className="text-green-600 mr-2 h-5 w-5" />
                Care Guide
              </h4>
              <div className="space-y-4">
                
                {result.wateringInstructions && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Droplets className="text-blue-500 mr-2 h-4 w-4" />
                      <h5 className="font-semibold text-slate-800">Watering</h5>
                    </div>
                    <p className="text-slate-600 text-sm">{result.wateringInstructions}</p>
                  </div>
                )}

                {result.lightRequirements && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Sun className="text-yellow-500 mr-2 h-4 w-4" />
                      <h5 className="font-semibold text-slate-800">Light</h5>
                    </div>
                    <p className="text-slate-600 text-sm">{result.lightRequirements}</p>
                  </div>
                )}

                {result.temperatureRange && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Thermometer className="text-red-500 mr-2 h-4 w-4" />
                      <h5 className="font-semibold text-slate-800">Temperature</h5>
                    </div>
                    <p className="text-slate-600 text-sm">{result.temperatureRange}</p>
                  </div>
                )}

                {result.humidityRequirements && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Cloud className="text-green-500 mr-2 h-4 w-4" />
                      <h5 className="font-semibold text-slate-800">Humidity</h5>
                    </div>
                    <p className="text-slate-600 text-sm">{result.humidityRequirements}</p>
                  </div>
                )}

                {result.soilRequirements && (
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Sprout className="text-amber-600 mr-2 h-4 w-4" />
                      <h5 className="font-semibold text-slate-800">Soil</h5>
                    </div>
                    <p className="text-slate-600 text-sm">{result.soilRequirements}</p>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Pro Tips */}
          {result.careTips && result.careTips.length > 0 && (
            <div className="mt-8 bg-slate-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                <Lightbulb className="text-amber-500 mr-2 h-5 w-5" />
                Pro Tips
              </h4>
              <ul className="space-y-2 text-slate-600">
                {result.careTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-green-600 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {onSaveResult && (
              <Button 
                onClick={onSaveResult}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Save to My Plants
              </Button>
            )}
            {onShareResult && (
              <Button 
                variant="outline" 
                onClick={onShareResult}
                className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Result
              </Button>
            )}
            <Button 
              variant="secondary" 
              onClick={onIdentifyAnother}
              className="flex-1"
            >
              <Plus className="mr-2 h-4 w-4" />
              Identify Another
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
