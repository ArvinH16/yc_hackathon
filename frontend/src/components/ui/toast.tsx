"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/cn";

export type ToastVariant = "default" | "success" | "destructive" | "info" | "warning";

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number; // ms
  variant?: ToastVariant;
}

interface ToastItem extends Required<ToastOptions> {
  id: string;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function variantClasses(v: ToastVariant) {
  switch (v) {
    case "success":
      return "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800";
    case "destructive":
      return "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800";
    case "info":
      return "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800";
    case "warning":
      return "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-800";
    default:
      return "bg-card text-card-foreground border";
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => setItems((s) => s.filter((i) => i.id !== id)), []);

  const toast = useCallback((opts: ToastOptions) => {
    const it: ToastItem = {
      id: Math.random().toString(36).slice(2),
      title: opts.title ?? "",
      description: opts.description ?? "",
      duration: opts.duration ?? 3000,
      variant: opts.variant ?? "default",
    };
    setItems((s) => [...s, it]);
    if (it.duration > 0) setTimeout(() => remove(it.id), it.duration);
  }, [remove]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Container */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-end gap-2 p-4 sm:bottom-4 sm:right-4 sm:left-auto">
        {items.map((i) => (
          <div
            key={i.id}
            className={cn(
              "w-full max-w-sm rounded-md border p-3 shadow-md",
              "transition-all",
              variantClasses(i.variant)
            )}
            role="status"
            aria-live="polite"
          >
            {i.title && <div className="text-sm font-medium">{i.title}</div>}
            {i.description && <div className="text-sm opacity-90">{i.description}</div>}
            <div className="mt-2 text-right">
              <button className="text-xs underline opacity-70 hover:opacity-100" onClick={() => remove(i.id)}>
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

