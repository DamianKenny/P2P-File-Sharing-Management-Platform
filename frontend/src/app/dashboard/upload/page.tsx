"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { UppyUploader } from "@/components/upload/UppyUploader";
import { Info, ArrowLeft, Cloud, Zap, Shield, RefreshCw } from "lucide-react";

export default function UploadPage() {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={folderId ? `/dashboard/files/${folderId}` : "/dashboard/files"}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Files</h1>
          <p className="text-gray-500 mt-1">
            {folderId
              ? "Upload to selected folder"
              : "Upload to your root folder"}
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FeatureCard
          icon={<Cloud className="w-5 h-5" />}
          title="5GB Max"
          description="Large file support"
          color="blue"
        />
        <FeatureCard
          icon={<RefreshCw className="w-5 h-5" />}
          title="Resumable"
          description="Pick up where you left off"
          color="green"
        />
        <FeatureCard
          icon={<Shield className="w-5 h-5" />}
          title="Secure"
          description="Encrypted uploads"
          color="purple"
        />
      </div>

      {/* Uploader */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <UppyUploader folderId={folderId} />
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Drag and drop multiple files at once for faster uploads</li>
              <li>
                • Large files are automatically split into chunks for reliable
                transfer
              </li>
              <li>
                • If your connection drops, the upload will resume automatically
              </li>
              <li>• All file types are supported up to 5GB each</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
      <div
        className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
