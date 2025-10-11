"use client";

import * as React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/cn';

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  children,
  title
}: ResponsiveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "fixed inset-0 max-h-screen max-w-screen p-0",
        "md:relative md:inset-auto md:max-h-[85vh] md:max-w-2xl md:rounded-lg md:p-6"
      )}>
        <div className="flex h-full flex-col overflow-hidden">
          {title && (
            <div className="border-b p-4 md:hidden">
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4 md:p-0">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

