import { PlantIdentifier } from "@/components/plant-identifier";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Zap, Database, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Identify Any Plant Instantly</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Upload a photo of any plant and get instant identification with detailed care instructions powered by AI.
          </p>
        </section>

        {/* Plant Identifier Component */}
        <section className="mb-12">
          <PlantIdentifier />
        </section>

        {/* Feature Highlights */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">Why Choose PlantID?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-green-600 h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Instant Results</h4>
              <p className="text-slate-600">Get plant identification results in seconds with our advanced AI technology.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="text-emerald-600 h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Comprehensive Database</h4>
              <p className="text-slate-600">Access information on thousands of plant species with detailed care instructions.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-amber-500 h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Care Made Easy</h4>
              <p className="text-slate-600">Get personalized care instructions to keep your plants healthy and thriving.</p>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}