"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";

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
        <main className="min-w-0 pb-12 md:pb-16">{children}</main>
      </div>
    </div>
  );
}
