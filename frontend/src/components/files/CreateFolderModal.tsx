"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FolderPlus } from "lucide-react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  onCreate,
}: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Folder name is required");
      return;
    }

    if (name.includes("/")) {
      setError('Folder name cannot contain "/"');
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onCreate(name.trim());
      setName("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create folder");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Folder"
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Folder Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter folder name"
            error={error}
            autoFocus
            leftIcon={<FolderPlus className="w-4 h-4" />}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Folder
          </Button>
        </div>
      </form>
    </Modal>
  );
}
