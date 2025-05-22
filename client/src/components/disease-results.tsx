import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  AlertTriangle, 
  Bug, 
  Droplets, 
  Leaf, 
  ShieldCheck,
  Clock,
  Target,
  Lightbulb,
  Share2,
  Plus,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";
import { PlantDiseaseResult } from "@/lib/types";

interface DiseaseResultsProps {
  result: PlantDiseaseResult;
  onDiagnoseAnother: () => void;
  onShareResult?: () => void;
}

export function DiseaseResults({ 
  result, 
  onDiagnoseAnother, 
  onShareResult 
}: DiseaseResultsProps) {
  const getSeverityColor = (severity: string) => {
    if (severity === 'mild') return "bg-yellow-500";
    if (severity === 'moderate') return "bg-orange-500";
    if (severity === 'severe') return "bg-red-500";
    return "bg-gray-500";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'disease': return <AlertTriangle className="h-5 w-5" />;
      case 'pest': return <Bug className="h-5 w-5" />;
      case 'deficiency': return <Droplets className="h-5 w-5" />;
      case 'environmental': return <Leaf className="h-5 w-5" />;
      case 'healthy': return <ShieldCheck className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'disease': return "from-red-600 to-red-700";
      case 'pest': return "from-orange-600 to-orange-700";
      case 'deficiency': return "from-blue-600 to-blue-700";
      case 'environmental': return "from-purple-600 to-purple-700";
      case 'healthy': return "from-green-600 to-green-700";
      default: return "from-gray-600 to-gray-700";
    }
  };

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
        <div className={`bg-gradient-to-r ${getTypeColor(result.diseaseType)} p-8 text-white`}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              {getTypeIcon(result.diseaseType)}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">{result.diseaseName}</h3>
              <p className="text-white/80 text-lg">{result.plantName}</p>
              <div className="flex items-center mt-3 space-x-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 capitalize">
                  {result.diseaseType}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 capitalize">
                  {result.severity} severity
                </Badge>
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
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Symptoms & Affected Parts */}
            <div>
              <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <Target className="text-red-600 mr-2 h-5 w-5" />
                Symptoms & Affected Areas
              </h4>
              
              {result.symptoms && result.symptoms.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-semibold text-slate-700 mb-2">Observed Symptoms:</h5>
                  <ul className="space-y-2">
                    {result.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="text-red-500 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span className="text-slate-600 text-sm">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.affectedParts && result.affectedParts.length > 0 && (
                <div>
                  <h5 className="font-semibold text-slate-700 mb-2">Affected Plant Parts:</h5>
                  <div className="flex flex-wrap gap-2">
                    {result.affectedParts.map((part, index) => (
                      <Badge key={index} variant="outline" className="text-red-600 border-red-200">
                        {part}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Causes */}
            <div>
              <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <Lightbulb className="text-amber-600 mr-2 h-5 w-5" />
                Potential Causes
              </h4>
              
              {result.causes && result.causes.length > 0 && (
                <ul className="space-y-2">
                  {result.causes.map((cause, index) => (
                    <li key={index} className="flex items-start">
                      <Zap className="text-amber-500 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span className="text-slate-600 text-sm">{cause}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

          {/* Immediate Actions */}
          {result.immediateActions && result.immediateActions.length > 0 && (
            <div className="mt-8 bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                <Clock className="text-red-600 mr-2 h-5 w-5" />
                Immediate Actions Required
              </h4>
              <ul className="space-y-2">
                {result.immediateActions.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="text-red-600 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Treatment Options */}
          {result.treatmentOptions && result.treatmentOptions.length > 0 && (
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                <Activity className="text-blue-600 mr-2 h-5 w-5" />
                Treatment Options
              </h4>
              <ul className="space-y-2">
                {result.treatmentOptions.map((treatment, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-blue-600 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{treatment}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prevention Tips */}
          {result.preventionTips && result.preventionTips.length > 0 && (
            <div className="mt-8 bg-green-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                <ShieldCheck className="text-green-600 mr-2 h-5 w-5" />
                Prevention Tips
              </h4>
              <ul className="space-y-2">
                {result.preventionTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-green-600 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {onShareResult && (
              <Button 
                onClick={onShareResult}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Diagnosis
              </Button>
            )}
            <Button 
              variant="secondary" 
              onClick={onDiagnoseAnother}
              className="flex-1"
            >
              <Plus className="mr-2 h-4 w-4" />
              Diagnose Another Plant
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}