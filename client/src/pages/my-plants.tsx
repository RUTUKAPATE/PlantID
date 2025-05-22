import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Calendar, Eye, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { PlantIdentificationResult } from "@/lib/types";

export default function MyPlants() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    setLocation('/auth');
    return null;
  }

  const { data: plants, isLoading, error } = useQuery<PlantIdentificationResult[]>({
    queryKey: ['/api/identifications'],
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
              Your Plant Collection ({plants.length} {plants.length === 1 ? 'plant' : 'plants'})
            </h2>
            <p className="text-slate-600">
              Here are all the plants you've identified using PlantID.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <Card key={plant.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-800 flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{plant.commonName}</h4>
                      <p className="text-sm text-slate-600 italic font-normal">
                        {plant.scientificName}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getConfidenceColor(plant.confidence)} ml-2 mt-1 flex-shrink-0`}></div>
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
  );
}