import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Calendar, Eye, AlertTriangle, Twitter, Instagram, Linkedin, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { PlantIdentificationResult } from "@/lib/types";
import { useEffect } from "react";

export default function MyPlants() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/auth');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  const { data: plants, isLoading, error } = useQuery<PlantIdentificationResult[]>({
    queryKey: ["api/my-plants"],
  queryFn: async () => {
    const res = await fetch("/api/my-plants", { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch saved plants");
    return res.json();
  },
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/my-plants/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to delete plant");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-plants'] });
    },
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredPlants = (plants ?? []).filter(Boolean);

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load your plants. Please try again later.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!plants || plants.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Plants Yet</h3>
            <p className="text-slate-600 mb-6">
              You haven't identified any plants yet. Start by uploading a photo!
            </p>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700">
                <Leaf className="mr-2 h-4 w-4" />
                Identify Your First Plant
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">
                Your Plant Collection ({filteredPlants.length} {filteredPlants.length === 1 ? 'plant' : 'plants'})
              </h2>
              <p className="text-slate-600">
                Here are all the plants you've identified using PlantID.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlants.map((plant) => (
                <Card key={plant.id} className="shadow-sm hover:shadow-md transition-shadow">
                  {plant.imageUrl && (
                    <div className="relative h-48 w-full">
                      <img
                        src={plant.imageUrl}
                        alt={plant.commonName}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-slate-800 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start flex-row">
                          <div className={`w-3 h-3 rounded-full ${getConfidenceColor(plant.confidence)} mr-2 mt-2 flex-shrink-0`}></div>
                          <h4 className="font-semibold mb-1 truncate whitespace-nowrap max-w-[120px] sm:max-w-[160px]">{plant.commonName}</h4>
                        </div>
                        <p className="text-sm text-slate-600 italic font-normal truncate whitespace-nowrap max-w-[120px] sm:max-w-[160px]">
                          {plant.scientificName}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteMutation.mutate(plant.id.toString())}
                        className="ml-2 mt-1 text-red-500 hover:text-red-700"
                        title="Delete plant"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Confidence:</span>
                        <span className="font-medium text-slate-800">{plant.confidence}%</span>
                      </div>

                      {plant.family && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Family:</span>
                          <Badge variant="secondary" className="text-xs">
                            {plant.family}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(plant.createdAt)}
                      </div>

                      <Link href={`/plant/${plant.id}`}>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
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
    </>
  );
}