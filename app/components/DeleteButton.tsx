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
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!passcode) {
      setError("Please enter the admin passcode");
      return;
    }

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
        body: JSON.stringify({ passcode }),
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Delete {itemType === "entry" ? "Entry" : "Project"}
            </h2>

            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{itemName}</span>?
              </p>
              {itemType === "project" && (
                <p className="text-red-600 text-sm font-medium">
                  ⚠️ This will also delete all entries, decks, categories, and
                  notes associated with this project.
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="passcode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Admin Passcode
              </label>
              <input
                type="password"
                id="passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter admin passcode"
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">❌ {error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setPasscode("");
                  setError("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

