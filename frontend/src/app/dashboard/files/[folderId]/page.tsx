"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderOpen,
  File,
  Plus,
  Upload,
  ArrowLeft,
  Trash2,
  Home,
  Share2,
  Download,
  Link as LinkIcon,
  Copy,
  X,
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function FolderPage() {
  const params = useParams();
  const router = useRouter();
  const folderId = params.folderId as string;

  const [folder, setFolder] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");

  // Share modal state
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    file: any | null;
    shareUrl: string;
  }>({ isOpen: false, file: null, shareUrl: "" });

  useEffect(() => {
    fetchContents();
  }, [folderId]);

  const fetchContents = async () => {
    try {
      const [contentsRes, folderRes] = await Promise.all([
        api.get(`/folders/${folderId}/contents`),
        api.get(`/folders/${folderId}`),
      ]);
      setFolders(contentsRes.data.data.folders || []);
      setFiles(contentsRes.data.data.files || []);
      setFolder(folderRes.data.data);
    } catch (err) {
      toast.error("Failed to load folder");
    } finally {
      setIsLoading(false);
    }
  };

  const createFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    try {
      await api.post("/folders", {
        name: folderName.trim(),
        parentId: folderId,
      });
      toast.success("Folder created");
      setFolderName("");
      setShowModal(false);
      fetchContents();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const deleteFile = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(`/files/${id}`);
      toast.success("Deleted");
      fetchContents();
    } catch {
      toast.error("Failed");
    }
  };

  const downloadFile = async (fileId: string, fileName: string) => {
    try {
      const res = await api.get(`/files/${fileId}/download`);
      const downloadUrl = res.data.data.downloadUrl;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started");
    } catch (err) {
      toast.error("Failed to download");
    }
  };

  const shareFile = async (file: any) => {
    try {
      if (file.isPublic && file.shareToken) {
        const shareUrl = `${window.location.origin}/shared/${file.shareToken}`;
        setShareModal({ isOpen: true, file, shareUrl });
        return;
      }

      const res = await api.post(`/files/${file._id}/share`);
      const { shareToken } = res.data.data;
      const shareUrl = `${window.location.origin}/shared/${shareToken}`;

      setFiles((prev) =>
        prev.map((f) =>
          f._id === file._id ? { ...f, isPublic: true, shareToken } : f
        )
      );

      setShareModal({ isOpen: true, file: { ...file, shareToken }, shareUrl });
      toast.success("Share link created!");
    } catch (err) {
      toast.error("Failed to create share link");
    }
  };

  const stopSharing = async (fileId: string) => {
    try {
      await api.delete(`/files/${fileId}/share`);
      setFiles((prev) =>
        prev.map((f) =>
          f._id === fileId ? { ...f, isPublic: false, shareToken: null } : f
        )
      );
      setShareModal({ isOpen: false, file: null, shareUrl: "" });
      toast.success("Sharing disabled");
    } catch (err) {
      toast.error("Failed to stop sharing");
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareModal.shareUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/dashboard/files" className="hover:text-blue-600">
                <Home className="w-4 h-4" />
              </Link>
              <span>/</span>
              <span>{folder?.name}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{folder?.name}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 border rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Folder
          </button>
          <Link
            href={`/dashboard/upload?folderId=${folderId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload
          </Link>
        </div>
      </div>

      {/* New Folder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">New Folder</h2>
            <form onSubmit={createFolder}>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-4 py-2 border rounded-lg mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal.isOpen && shareModal.file && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Share File</h2>
              <button
                onClick={() =>
                  setShareModal({ isOpen: false, file: null, shareUrl: "" })
                }
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
              <File className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">
                  {shareModal.file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatBytes(shareModal.file.size)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareModal.shareUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={copyShareLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Anyone with this link can download the file
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => stopSharing(shareModal.file._id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Stop Sharing
              </button>
              <a
                href={shareModal.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Open Link
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {folders.length === 0 && files.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Empty folder</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {folders.map((f) => (
            <Link
              key={f._id}
              href={`/dashboard/files/${f._id}`}
              className="p-4 bg-white border rounded-xl hover:shadow-md text-center"
            >
              <FolderOpen className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm font-medium truncate">{f.name}</p>
            </Link>
          ))}

          {files.map((f) => (
            <div
              key={f._id}
              className="group relative p-4 bg-white border rounded-xl hover:shadow-md text-center"
            >
              {/* Share indicator */}
              {f.isPublic && (
                <div className="absolute top-2 left-2">
                  <div className="p-1 bg-green-100 rounded-full" title="Shared">
                    <LinkIcon className="w-3 h-3 text-green-600" />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => downloadFile(f._id, f.name)}
                  className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareFile(f)}
                  className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:text-green-600"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteFile(f._id)}
                  className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <File className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium truncate">{f.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(f.size)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
