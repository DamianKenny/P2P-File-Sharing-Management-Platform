import Link from "next/link";
import { ArrowRight, Shield, Zap, Cloud, Users } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">P2P</span>
            </div>
            <span className="text-xl font-bold text-white">{APP_NAME}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Share files securely,
            <br />
            <span className="text-primary-400">anywhere, anytime</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Upload, manage, and share your files with enterprise-grade security.
            Support for files up to 5GB with resumable uploads.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30 text-lg font-medium"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all text-lg font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Cloud className="w-8 h-8" />}
            title="5GB File Support"
            description="Upload large files with chunked, resumable uploads that survive network interruptions."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Secure Storage"
            description="Your files are encrypted and stored securely in enterprise-grade cloud storage."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Lightning Fast"
            description="Direct browser-to-cloud uploads mean your files transfer at maximum speed."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Easy Sharing"
            description="Generate secure share links with optional expiration for any file."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-10 border-t border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-400 text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-400 text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
      <div className="w-14 h-14 bg-primary-600/20 rounded-xl flex items-center justify-center text-primary-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
