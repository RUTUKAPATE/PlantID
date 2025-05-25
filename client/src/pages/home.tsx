
import { PlantIdentifier } from "@/components/plant-identifier";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Zap, Database, Heart, Star, ArrowRight, Twitter, Instagram, Linkedin, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-green-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              Discover and Care for Your
              <span className="text-green-600 block">Plants with AI</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Upload a photo of any plant and get instant identification with detailed care instructions powered by advanced AI technology.
            </p>
            {!isAuthenticated && (
              <Link href="/auth">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          <section className="mb-20">
            <PlantIdentifier />
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
              Why Choose <span className="text-green-600">PlantID</span>?
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              <Card className="bg-white/50 backdrop-blur border-none hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-row items-start space-x-3">
                    <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="text-green-600 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3 self-center">Instant Results</h3>
                  </div>
                  <p className="text-slate-600">Get accurate plant identification results in seconds with our state-of-the-art AI technology.</p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur border-none hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-row items-start space-x-3">
                    <div className="w-12 h-12 bg-emerald-600/10 rounded-lg flex items-center justify-center mb-4">
                      <Database className="text-emerald-600 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3 self-center">Extensive Database</h3>
                  </div>
                  <p className="text-slate-600">Access information on thousands of plant species with detailed care guides and tips.</p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur border-none hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-row items-start space-x-3">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Heart className="text-amber-500 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3 self-center">Expert Care Guide</h3>
                  </div>
                  <p className="text-slate-600">Get personalized care instructions to help your plants thrive and stay healthy.</p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur border-none hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-row items-start space-x-3">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Stethoscope className="text-emerald-600 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3 self-center">Plant Health Diagnosis</h3>
                  </div>
                  <p className="text-slate-600 mb-1">
                    Get real-time health assessments and expert insights to treat your plants effectively.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="text-center pb-12">
            <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-4 py-2 mb-6">
              <Star className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Start Your Plant Journey Today</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Ready to Explore the World of Plants?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join our community of plant enthusiasts and start identifying and caring for your plants like never before.
            </p>
            <Link href={isAuthenticated ? "/my-plants" : "/auth"}>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                {isAuthenticated ? "View My Plants" : "Sign Up Now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white pt-12 pb-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid layout for content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            {/* Brand and description */}
            <div>
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer mb-3">
                  <Leaf className="h-8 w-8 text-green-600" />
                  <span className="text-2xl font-bold">PlantID</span>
                </div>
              </Link>
              <p className="text-green-100 leading-relaxed">
                Identify plants instantly and get expert care tips with our AI-powered tool.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-green-200">Home</Link></li>
                <li><Link href="/disease-diagnosis" className="hover:text-green-200">Plant Doctor</Link></li>
                <li><Link href="/my-plants" className="hover:text-green-200">My Plants</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-green-200">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-green-200">Terms of Service</Link></li>
                <li><Link href="/faq" className="hover:text-green-200">FAQs</Link></li>
                <li><Link href="/contact" className="hover:text-green-200">Contact Us</Link></li>
              </ul>
            </div>

            {/* Social Icons */}
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <p className="text-green-100 mb-4">Follow us on social media</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-green-200" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-green-200" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="hover:text-green-200" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          </div>

          {/* Divider and bottom section */}
          <div className="mt-10 border-t border-green-600 pt-4 text-center text-xs text-green-200">
            &copy; {new Date().getFullYear()} PlantID. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
