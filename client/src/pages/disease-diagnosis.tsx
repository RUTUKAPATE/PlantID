import { useState } from "react";
import { PlantDiseaseDetector } from "@/components/plant-disease-detector";
import { DiseaseResults } from "@/components/disease-results";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Leaf, AlertTriangle, Menu, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { PlantDiseaseResult } from "@/lib/types";

export default function DiseaseDiagnosis() {
  const [diagnosisResult, setDiagnosisResult] = useState<PlantDiseaseResult | null>(null);

  const handleDiagnosisComplete = (diagnosis: PlantDiseaseResult) => {
    setDiagnosisResult(diagnosis);
  };

  const handleDiagnoseAnother = () => {
    setDiagnosisResult(null);
  };

  const handleShareResult = () => {
    if (!diagnosisResult) return;
    
    const shareUrl = `${window.location.origin}/diagnosis/${diagnosisResult.id}`;
    const shareData = {
      title: `Plant Health Diagnosis: ${diagnosisResult.diseaseName}`,
      text: `I diagnosed my plant and found: ${diagnosisResult.diseaseName} on ${diagnosisResult.plantName}`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Diagnosis page link copied to clipboard!');
        }).catch(() => {
          alert(`Share this link: ${shareUrl}`);
        });
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Diagnosis page link copied to clipboard!');
      }).catch(() => {
        alert(`Share this link: ${shareUrl}`);
      });
    }
  };

  // Show results if we have them
  if (diagnosisResult) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Activity className="text-white h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Plant Health Diagnosis</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/my-plants">
                  <Button variant="outline" size="sm" className="text-slate-600 hover:text-slate-800">
                    <Leaf className="h-4 w-4 mr-2" />
                    My Plants
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <DiseaseResults
            result={diagnosisResult}
            onDiagnoseAnother={handleDiagnoseAnother}
            onShareResult={handleShareResult}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Activity className="text-white h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Plant Health Diagnosis</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/my-plants">
                <Button variant="outline" size="sm" className="text-slate-600 hover:text-slate-800">
                  <Leaf className="h-4 w-4 mr-2" />
                  My Plants
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Diagnose Plant Health Issues</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Upload a photo of your plant to detect diseases, pests, nutrient deficiencies, and get expert treatment advice.
          </p>
        </section>

        {/* Disease Detector Component */}
        <section className="mb-12">
          <PlantDiseaseDetector onDiagnosisComplete={handleDiagnosisComplete} />
        </section>

        {/* Feature Highlights */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">What We Can Detect</h3>
          <div className="grid md:grid-cols-4 gap-6">
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600 h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Plant Diseases</h4>
              <p className="text-slate-600 text-sm">Fungal, bacterial, and viral infections affecting your plants.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-orange-600 h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Pest Infestations</h4>
              <p className="text-slate-600 text-sm">Insects, mites, and other pests damaging your plants.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-blue-600 h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Nutrient Issues</h4>
              <p className="text-slate-600 text-sm">Deficiencies and toxicities affecting plant health.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-purple-600 h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Environmental Stress</h4>
              <p className="text-slate-600 text-sm">Light, water, temperature, and soil-related problems.</p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold">Plant Health Diagnosis</h3>
          </div>
          <p className="text-slate-400">
            Get expert AI-powered diagnosis to keep your plants healthy and thriving.
          </p>
        </div>
      </footer>
    </div>
  );
}