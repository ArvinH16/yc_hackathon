"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";
import { AppBreadcrumbs } from "@/components/navigation/AppBreadcrumbs";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <div className="min-h-screen">
      <Navbar onMenuClick={() => setOpen((v) => !v)} />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 md:grid-cols-[18rem_1fr] md:gap-6 lg:max-w-full lg:px-6">
        <Sidebar open={open} onClose={() => setOpen(false)} collapsed={false} />
        {/* Mobile overlay to close sidebar */}
        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}
        <main className="min-w-0 pb-12 md:pb-16">
          <div className="sticky top-14 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="py-2 md:py-3">
              <AppBreadcrumbs />
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
