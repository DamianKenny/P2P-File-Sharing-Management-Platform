"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  Upload,
  FolderOpen,
  Share2,
  Clock,
  TrendingUp,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  MoreHorizontal,
  ArrowUpRight,
  Plus,
  File,
} from "lucide-react";
import api from "@/lib/api";

interface FileItem {
  _id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
  isPublic: boolean;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalFolders: 0,
    sharedFiles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [filesRes, foldersRes] = await Promise.all([
        api.get("/files?limit=5"),
        api.get("/folders"),
      ]);

      const files = filesRes.data.data || [];
      const folders = foldersRes.data.data || [];

      setRecentFiles(files.slice(0, 5));
      setStats({
        totalFiles: files.length,
        totalFolders: folders.length,
        sharedFiles: files.filter((f: FileItem) => f.isPublic).length,
      });
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/"))
      return <Image className="w-5 h-5 text-pink-500" />;
    if (mimeType.startsWith("video/"))
      return <Video className="w-5 h-5 text-purple-500" />;
    if (mimeType.startsWith("audio/"))
      return <Music className="w-5 h-5 text-orange-500" />;
    if (mimeType.includes("zip") || mimeType.includes("rar"))
      return <Archive className="w-5 h-5 text-yellow-600" />;
    if (mimeType.includes("pdf") || mimeType.includes("document"))
      return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-blue-500" />;
  };

  const storagePercent = user
    ? Math.round((user.storageUsed / user.storageLimit) * 100)
    : 0;
  const storageUsedGB = (
    (user?.storageUsed || 0) /
    (1024 * 1024 * 1024)
  ).toFixed(2);
  const storageLimitGB = (
    (user?.storageLimit || 0) /
    (1024 * 1024 * 1024)
  ).toFixed(0);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your files today.
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          Upload Files
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          icon={<FileText className="w-6 h-6" />}
          label="Total Files"
          value={stats.totalFiles.toString()}
          trend="+12%"
          trendUp={true}
          color="blue"
        />
        <StatsCard
          icon={<FolderOpen className="w-6 h-6" />}
          label="Folders"
          value={stats.totalFolders.toString()}
          trend="+3"
          trendUp={true}
          color="yellow"
        />
        <StatsCard
          icon={<Share2 className="w-6 h-6" />}
          label="Shared Files"
          value={stats.sharedFiles.toString()}
          trend="+5"
          trendUp={true}
          color="green"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Storage Used"
          value={`${storageUsedGB} GB`}
          trend={`${storagePercent}%`}
          trendUp={false}
          color="purple"
          isStorage={true}
        />
      </div>

      {/* Quick Actions & Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <QuickActionCard
                href="/dashboard/upload"
                icon={<Upload className="w-6 h-6" />}
                label="Upload"
                color="blue"
              />
              <QuickActionCard
                href="/dashboard/files"
                icon={<FolderOpen className="w-6 h-6" />}
                label="Browse"
                color="yellow"
              />
              <QuickActionCard
                href="/dashboard/shared"
                icon={<Share2 className="w-6 h-6" />}
                label="Shared"
                color="green"
              />
              <QuickActionCard
                href="/dashboard/files"
                icon={<Clock className="w-6 h-6" />}
                label="Recent"
                color="purple"
              />
            </div>
          </div>
        </div>

        {/* Storage Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Storage</h2>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold">{storageUsedGB}</span>
              <span className="text-blue-200 mb-1">/ {storageLimitGB} GB</span>
            </div>
            <p className="text-blue-200 text-sm">Storage used</p>
          </div>

          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${storagePercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-200">
              {100 - storagePercent}% remaining
            </span>
            <Link
              href="/dashboard/settings"
              className="text-white font-medium hover:underline"
            >
              Upgrade →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Files</h2>
          <Link
            href="/dashboard/files"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View all
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No files yet
            </h3>
            <p className="text-gray-500 mb-4">
              Upload your first file to get started
            </p>
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentFiles.map((file) => (
              <div
                key={file._id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  {getFileIcon(file.mimeType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatBytes(file.size)} • {formatDate(file.createdAt)}
                  </p>
                </div>
                {file.isPublic && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Shared
                  </span>
                )}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TipCard
          title="Organize with Folders"
          description="Create folders to keep your files organized. Click 'My Files' and then 'New Folder' to get started."
          icon={<FolderOpen className="w-6 h-6" />}
          color="blue"
        />
        <TipCard
          title="Share Securely"
          description="Generate secure share links for any file. Recipients can download without creating an account."
          icon={<Share2 className="w-6 h-6" />}
          color="green"
        />
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  color,
  isStorage = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: "blue" | "yellow" | "green" | "purple";
  isStorage?: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center`}
        >
          {icon}
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isStorage
              ? "bg-gray-100 text-gray-600"
              : trendUp
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: "blue" | "yellow" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-200",
    yellow: "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200",
    green: "bg-green-100 text-green-600 group-hover:bg-green-200",
    purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-200",
  };

  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
    >
      <div
        className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center transition-colors`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </Link>
  );
}

// Tip Card Component
function TipCard({
  title,
  description,
  icon,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "green";
}) {
  const colorClasses = {
    blue: "from-blue-500 to-indigo-500",
    green: "from-green-500 to-emerald-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
