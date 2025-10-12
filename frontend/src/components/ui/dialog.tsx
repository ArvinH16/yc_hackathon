"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

interface DialogContextValue {
  open: boolean;
  setOpen: (o: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

export function Dialog({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (o: boolean) => void; children: React.ReactNode; }) {
  const [internal, setInternal] = React.useState(!!open);
  const isControlled = open !== undefined;
  const val = isControlled ? !!open : internal;
  const setOpen = React.useCallback((o: boolean) => {
    if (!isControlled) setInternal(o);
    onOpenChange?.(o);
  }, [isControlled, onOpenChange]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (val) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [val, setOpen]);
  return <DialogContext.Provider value={{ open: val, setOpen }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children }: { children: React.ReactElement }) {
  const ctx = React.useContext(DialogContext)!;
  return React.cloneElement(children, { onClick: () => ctx.setOpen(true) } as React.HTMLAttributes<HTMLElement>);
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode; }) {
  const ctx = React.useContext(DialogContext)!;
  if (!ctx.open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => ctx.setOpen(false)} />
      <div className={cn("relative z-10 w-[92vw] max-w-xl rounded-lg border bg-card p-4 shadow-lg", className)}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-2", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4 flex items-center justify-end gap-2", className)} {...props} />;
}
