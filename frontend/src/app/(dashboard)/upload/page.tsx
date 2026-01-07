"use client";

import { useSearchParams } from "next/navigation";
import { UppyUploader } from "@/components/upload/UppyUploader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Upload, Info } from "lucide-react";

export default function UploadPage() {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Files</h1>
        <p className="text-gray-600 mt-1">
          Upload files to{" "}
          {folderId ? "the selected folder" : "your root folder"}
        </p>
      </div>

      {/* Info Card */}
      <Card>
        <CardContent className="flex items-start gap-4 py-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Upload Information</h3>
            <ul className="mt-1 text-sm text-gray-600 space-y-1">
              <li>• Maximum file size: 5 GB per file</li>
              <li>• Up to 20 files at once</li>
              <li>
                • Uploads are resumable - they'll continue if your connection
                drops
              </li>
              <li>• Files are uploaded directly to secure cloud storage</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Uploader */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Select Files</h2>
          </div>
        </CardHeader>
        <CardContent>
          <UppyUploader folderId={folderId} />
        </CardContent>
      </Card>
    </div>
  );
}
