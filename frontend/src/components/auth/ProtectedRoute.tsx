"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PageSpinner } from "@/components/ui/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized, initialize } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  //shows loading while checking auth
  if (!isInitialized) {
    return <PageSpinner />;
  }

  // wont render children without authentication
  if (!isAuthenticated) {
    return <PageSpinner />;
  }

  return <>{children}</>;
}
