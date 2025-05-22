import { useEffect } from "react";
import { useLocation } from "wouter";
import { AuthForm } from "@/components/auth-form";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (isAuthenticated) {
    return null;
  }

  return <AuthForm onSuccess={() => setLocation("/")} />;
}