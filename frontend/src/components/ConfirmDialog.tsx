"use client";

import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title = "Confirm action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  const btnColor =
    variant === "danger"
      ? "bg-rose-500 hover:bg-rose-600 text-white"
      : variant === "warning"
        ? "bg-amber-500 hover:bg-amber-600 text-black"
        : "bg-sky-500 hover:bg-sky-600 text-white";

  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <div className="space-y-4">
        {variant !== "default" && (
          <div className="flex justify-center">
            <div className={`rounded-full p-3 ${variant === "danger" ? "bg-rose-500/10" : "bg-amber-500/10"}`}>
              <AlertTriangle className={`h-6 w-6 ${variant === "danger" ? "text-rose-400" : "text-amber-400"}`} />
            </div>
          </div>
        )}
        <p className="text-center text-sm text-white/70">{message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${btnColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
