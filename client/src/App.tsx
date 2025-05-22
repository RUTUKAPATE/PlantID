import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import MyPlants from "@/pages/my-plants";
import PlantDetail from "@/pages/plant-detail";
import DiseaseDiagnosis from "@/pages/disease-diagnosis";
import Auth from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/my-plants" component={MyPlants} />
      <Route path="/plant/:id" component={PlantDetail} />
      <Route path="/disease-diagnosis" component={DiseaseDiagnosis} />
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isLoading } = useAuth();
  const [location] = useLocation();

  // Only show loading for authenticated routes
  if (isLoading && location !== '/') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Router />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
