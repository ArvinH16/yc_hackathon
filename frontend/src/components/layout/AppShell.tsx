"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Navbar onMenuClick={() => setOpen((v) => !v)} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-[16rem_1fr]">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="pb-10 md:pb-16">{children}</main>
      </div>
    </div>
  );
}

