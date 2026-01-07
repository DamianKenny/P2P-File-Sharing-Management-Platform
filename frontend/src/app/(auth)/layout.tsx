"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/lib/constants";
import { PageSpinner } from "@/components/ui/Spinner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized, initialize } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return <PageSpinner />;
  }

  if (isAuthenticated) {
    return <PageSpinner />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">P2P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
          </Link>

          {children}
        </div>
      </div>

      {/* Right side - Image/Pattern */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto">
              <span className="text-4xl font-bold text-white">P2P</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Secure File Sharing Made Simple
          </h2>
          <p className="text-primary-100 text-lg">
            Upload, organize, and share your files with confidence.
            Enterprise-grade security meets intuitive design.
          </p>
        </div>
      </div>
    </div>
  );
}
