"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  itemId: string;
  itemType: "entry" | "project";
  itemName: string;
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

export default function DeleteButton({
  itemId,
  itemType,
  itemName,
  onSuccess,
  redirectTo,
  className = "",
}: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const endpoint =
        itemType === "entry"
          ? `/api/entries/${itemId}`
          : `/api/projects/${itemId}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete");
        setIsDeleting(false);
        return;
      }

      // Success
      setShowConfirm(false);
      if (onSuccess) {
        onSuccess();
      }
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred while deleting");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className={
          className ||
          "text-red-600 hover:text-red-700 text-sm font-medium"
        }
        type="button"
      >
        🗑️ Delete
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-200 rounded-lg shadow-xl max-w-md w-full p-6 border-2 border-primary-300">
            <h2 className="text-xl font-bold text-primary-700 mb-4">
              Delete {itemType === "entry" ? "Entry" : "Project"}
            </h2>

            <div className="mb-6">
              <p className="text-primary-600 mb-2">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-primary-700">{itemName}</span>?
              </p>
              {itemType === "project" && (
                <p className="text-accent-500 text-sm font-medium mt-3">
                  ⚠️ This will also delete all entries, decks, categories, and
                  notes associated with this project.
                </p>
              )}
              {error && (
                <p className="text-accent-500 text-sm mt-3">❌ {error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setError("");
                }}
                className="flex-1 px-4 py-2 border-2 border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-accent-300 text-white rounded-lg hover:bg-accent-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

