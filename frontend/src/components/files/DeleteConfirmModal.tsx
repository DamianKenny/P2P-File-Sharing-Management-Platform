"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: "file" | "folder";
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  itemName,
  itemType,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p className="text-gray-900">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{itemName}</span>?
          </p>
          {itemType === "folder" && (
            <p className="text-sm text-gray-500 mt-1">
              This will permanently delete the folder and all its contents.
            </p>
          )}
          <p className="text-sm text-red-600 mt-2">
            This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} isLoading={isLoading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
