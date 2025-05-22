import { PlantIdentifier } from "@/components/plant-identifier";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Zap, Database, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
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

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Leaf className="text-white h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">PlantID</h3>
              </div>
              <p className="text-slate-400 mb-4">
                Helping plant lovers identify and care for their green friends with the power of AI.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.447 1.297-3.322c.806-.806 1.957-1.297 3.323-1.297s2.447.49 3.322 1.297c.806.806 1.297 1.957 1.297 3.322s-.49 2.447-1.297 3.322c-.806.806-1.957 1.297-3.322 1.297z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Plant Identification</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Care Instructions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Plant Database</a></li>
                <li><a href="#" className="hover:text-white transition-colors">My Plants</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 PlantID. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
