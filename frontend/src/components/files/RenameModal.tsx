"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Edit2 } from "lucide-react";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  itemType: "file" | "folder";
  onRename: (newName: string) => Promise<void>;
}

export function RenameModal({
  isOpen,
  onClose,
  currentName,
  itemType,
  onRename,
}: RenameModalProps) {
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(currentName);
    setError("");
  }, [currentName, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(`${itemType === "file" ? "File" : "Folder"} name is required`);
      return;
    }

    if (name.trim() === currentName) {
      onClose();
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onRename(name.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to rename");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rename ${itemType === "file" ? "File" : "Folder"}`}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="New Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter new ${itemType} name`}
            error={error}
            autoFocus
            leftIcon={<Edit2 className="w-4 h-4" />}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Rename
          </Button>
        </div>
      </form>
    </Modal>
  );
}
