"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FileItem } from "@/types";
import { Link, Copy, Check, ExternalLink, X } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import toast from "react-hot-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem;
  onShare: () => Promise<{ shareToken: string; shareUrl: string }>;
  onUnshare: () => Promise<void>;
}

export function ShareModal({
  isOpen,
  onClose,
  file,
  onShare,
  onUnshare,
}: ShareModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const fullShareUrl = file.shareToken
    ? `${window.location.origin}/shared/${file.shareToken}`
    : shareUrl;

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const result = await onShare();
      setShareUrl(`${window.location.origin}${result.shareUrl}`);
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnshare = async () => {
    setIsLoading(true);
    try {
      await onUnshare();
      setShareUrl("");
      onClose();
    } catch (error) {
      console.error("Unshare failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(fullShareUrl);
    if (success) {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share File" size="md">
      <div className="space-y-4">
        {/* File info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Link className="w-5 h-5 text-gray-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {file.isPublic ? "Currently shared" : "Not shared"}
            </p>
          </div>
        </div>

        {/* Share link */}
        {(file.isPublic || shareUrl) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Share Link
            </label>
            <div className="flex gap-2">
              <Input
                value={fullShareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <a
                href={fullShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0"
              >
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Anyone with this link can download the file
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {file.isPublic ? (
            <Button
              variant="danger"
              onClick={handleUnshare}
              isLoading={isLoading}
              leftIcon={<X className="w-4 h-4" />}
            >
              Stop Sharing
            </Button>
          ) : (
            <Button
              onClick={handleShare}
              isLoading={isLoading}
              leftIcon={<Link className="w-4 h-4" />}
            >
              Create Share Link
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
