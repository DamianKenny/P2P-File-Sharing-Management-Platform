"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Upload,
  FolderPlus,
  Clock,
  HardDrive,
  TrendingUp,
  FileText,
  Image,
  Video,
  Music,
  Archive,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  formatBytes,
  calculateStoragePercentage,
  formatRelativeTime,
} from "@/lib/utils";
import api from "@/lib/api";
import { FileItem } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        const response = await api.get("/files/recent?limit=5");
        setRecentFiles(response.data.data);
      } catch (error) {
        console.error("Failed to fetch recent files:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentFiles();
  }, []);

  const storagePercentage = user
    ? calculateStoragePercentage(user.storageUsed, user.storageLimit)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your files.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          href="/dashboard/upload"
          icon={<Upload className="w-6 h-6" />}
          title="Upload Files"
          description="Upload new files"
          color="bg-primary-500"
        />
        <QuickActionCard
          href="/dashboard/files"
          icon={<FolderPlus className="w-6 h-6" />}
          title="My Files"
          description="Browse your files"
          color="bg-emerald-500"
        />
        <QuickActionCard
          href="/dashboard/shared"
          icon={<TrendingUp className="w-6 h-6" />}
          title="Shared Files"
          description="View shared files"
          color="bg-amber-500"
        />
        <QuickActionCard
          href="/dashboard/files"
          icon={<Clock className="w-6 h-6" />}
          title="Recent"
          description="Recently accessed"
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Usage */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Storage</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium">
                    {formatBytes(user?.storageUsed || 0)} /{" "}
                    {formatBytes(user?.storageLimit || 0)}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      storagePercentage > 90
                        ? "bg-red-500"
                        : storagePercentage > 70
                        ? "bg-amber-500"
                        : "bg-primary-500"
                    }`}
                    style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  {100 - storagePercentage}% of storage remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Files */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-900">Recent Files</h2>
              </div>
              <Link href="/dashboard/files">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recentFiles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No files yet</p>
                <Link href="/dashboard/upload" className="mt-2 inline-block">
                  <Button size="sm">Upload your first file</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <RecentFileItem key={file._id} file={file} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card hover className="h-full">
        <CardContent className="flex items-center gap-4 py-5">
          <div
            className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function RecentFileItem({ file }: { file: FileItem }) {
  const getIcon = () => {
    if (file.mimeType.startsWith("image/"))
      return <Image className="w-5 h-5 text-pink-500" />;
    if (file.mimeType.startsWith("video/"))
      return <Video className="w-5 h-5 text-purple-500" />;
    if (file.mimeType.startsWith("audio/"))
      return <Music className="w-5 h-5 text-orange-500" />;
    if (file.mimeType.includes("zip") || file.mimeType.includes("rar"))
      return <Archive className="w-5 h-5 text-yellow-600" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatBytes(file.size)} • {formatRelativeTime(file.createdAt)}
        </p>
      </div>
    </div>
  );
}
