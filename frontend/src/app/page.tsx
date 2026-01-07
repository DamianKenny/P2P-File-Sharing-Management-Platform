import Link from "next/link";
import {
  Upload,
  Shield,
  Zap,
  Cloud,
  Users,
  Lock,
  Globe,
  CheckCircle,
  ArrowRight,
  FileText,
  FolderOpen,
  Share2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                CloudShare
              </span>
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#security"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Security
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full blur-3xl" />

        {/* Floating Elements */}
        <div className="absolute top-40 left-10 w-20 h-20 bg-white rounded-2xl shadow-xl shadow-gray-200/50 flex items-center justify-center floating">
          <FileText className="w-10 h-10 text-blue-500" />
        </div>
        <div className="absolute top-60 right-20 w-16 h-16 bg-white rounded-2xl shadow-xl shadow-gray-200/50 flex items-center justify-center floating-delayed">
          <FolderOpen className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="absolute bottom-40 left-1/4 w-14 h-14 bg-white rounded-xl shadow-xl shadow-gray-200/50 flex items-center justify-center floating">
          <Share2 className="w-7 h-7 text-green-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Lightning Fast File Sharing
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Share files with
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                anyone,{" "}
              </span>
              <br />
              anywhere
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              The most secure and fastest way to upload, organize, and share
              your files. Support for files up to{" "}
              <span className="font-semibold text-gray-900">5GB</span> with
              resumable uploads and enterprise-grade security.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/register"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              >
                Start Sharing Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Sign In to Dashboard
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free 5GB Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-700 rounded-lg px-4 py-1.5 text-gray-400 text-sm">
                    cloudshare.app/dashboard
                  </div>
                </div>
              </div>
              {/* App Preview */}
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-4 gap-4">
                  {/* Sidebar */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="space-y-3">
                      <div className="h-8 bg-blue-100 rounded-lg" />
                      <div className="h-6 bg-gray-100 rounded-lg" />
                      <div className="h-6 bg-gray-100 rounded-lg" />
                      <div className="h-6 bg-gray-100 rounded-lg" />
                    </div>
                  </div>
                  {/* Main Content */}
                  <div className="col-span-3 bg-white rounded-xl p-4 shadow-sm">
                    <div className="grid grid-cols-4 gap-3">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center"
                        >
                          {i % 3 === 0 ? (
                            <FolderOpen className="w-8 h-8 text-yellow-500" />
                          ) : (
                            <FileText className="w-8 h-8 text-blue-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage files
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make file sharing and collaboration
              effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Upload className="w-7 h-7" />}
              title="Large File Support"
              description="Upload files up to 5GB with our chunked upload technology. Never worry about file size limits again."
              color="blue"
            />
            <FeatureCard
              icon={<Zap className="w-7 h-7" />}
              title="Resumable Uploads"
              description="Lost connection? No problem. Our smart upload system picks up right where you left off."
              color="yellow"
            />
            <FeatureCard
              icon={<Shield className="w-7 h-7" />}
              title="Enterprise Security"
              description="Your files are encrypted at rest and in transit. Bank-level security for your peace of mind."
              color="green"
            />
            <FeatureCard
              icon={<Share2 className="w-7 h-7" />}
              title="Easy Sharing"
              description="Generate secure share links with one click. Control who can access your files and for how long."
              color="purple"
            />
            <FeatureCard
              icon={<FolderOpen className="w-7 h-7" />}
              title="Smart Organization"
              description="Create folders, organize files, and find what you need instantly with powerful search."
              color="orange"
            />
            <FeatureCard
              icon={<Globe className="w-7 h-7" />}
              title="Access Anywhere"
              description="Your files are available from any device, anywhere in the world. Always in sync."
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start sharing files in seconds with our simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Create Account"
              description="Sign up for free in seconds. No credit card required. Get 5GB of storage instantly."
              icon={<Users className="w-8 h-8" />}
            />
            <StepCard
              number="02"
              title="Upload Files"
              description="Drag and drop your files or browse to upload. Support for all file types up to 5GB."
              icon={<Upload className="w-8 h-8" />}
            />
            <StepCard
              number="03"
              title="Share & Collaborate"
              description="Generate secure links and share with anyone. They can download without signing up."
              icon={<Share2 className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                <Lock className="w-4 h-4" />
                Enterprise-Grade Security
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your files are safe with us
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We take security seriously. Your files are protected with the
                same level of encryption used by banks and government agencies.
              </p>

              <div className="space-y-4">
                <SecurityFeature
                  title="End-to-End Encryption"
                  description="Files are encrypted before they leave your device"
                />
                <SecurityFeature
                  title="Secure Data Centers"
                  description="Stored in SOC 2 compliant data centers"
                />
                <SecurityFeature
                  title="Access Controls"
                  description="Fine-grained permissions and share expiration"
                />
                <SecurityFeature
                  title="Regular Audits"
                  description="Continuous security monitoring and testing"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 rounded-3xl blur-3xl opacity-30" />
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">256-bit AES Encryption</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">TLS 1.3 in Transit</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">
                      Zero-Knowledge Architecture
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="5GB" label="Free Storage" />
            <StatCard number="99.9%" label="Uptime" />
            <StatCard number="256-bit" label="Encryption" />
            <StatCard number="24/7" label="Support" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to start sharing?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of users who trust CloudShare for their file sharing
            needs. Start free, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 text-gray-700 font-semibold hover:text-gray-900 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CloudShare</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The most secure and fastest way to share files with anyone,
                anywhere. Trusted by individuals and teams worldwide.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className="hover:text-white transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} CloudShare. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <div className="group p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1">
      <div
        className={`w-14 h-14 ${colorClasses[color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// Step Card Component
function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative p-8 bg-white rounded-2xl shadow-lg shadow-gray-200/50">
      <div className="absolute -top-4 left-8 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full">
        Step {number}
      </div>
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mt-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// Security Feature Component
function SecurityFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle className="w-4 h-4 text-green-600" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-white mb-2">{number}</div>
      <div className="text-blue-100">{label}</div>
    </div>
  );
}
