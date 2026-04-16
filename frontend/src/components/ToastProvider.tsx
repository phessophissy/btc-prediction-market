"use client";

import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

const variantIcon: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantStyle: Record<ToastVariant, string> = {
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  error: "border-red-400/30 bg-red-500/10 text-red-200",
  warning: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  info: "border-sky-400/30 bg-sky-500/10 text-sky-200",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = variantIcon[toast.variant];
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-lg animate-in slide-in-from-right ${variantStyle[toast.variant]}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">{toast.message}</span>
              <button onClick={() => dismiss(toast.id)} className="ml-2 shrink-0 opacity-60 hover:opacity-100">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
