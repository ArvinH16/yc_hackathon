"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useViewMode } from "@/components/providers/view-mode-provider";

export function Sidebar({ open, onClose, collapsed = false }: { open: boolean; onClose: () => void; collapsed?: boolean }) {
  const pathname = usePathname();
  const { mode } = useViewMode();
  const NAV = [
    { label: "Overview", href: "/dashboard/customer" },
    { label: "Map", href: "/dashboard/customer/map" },
    { label: "Analytics", href: "/dashboard/customer/analytics" },
    { label: "Monitoring", href: "/dashboard/customer/monitoring" },
    // Leads visible only in admin (BeamBell) view
    ...(mode === 'admin' ? [{ label: "Leads", href: "/dashboard/crm/leads" }] : []),
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 border-r bg-background p-4 transition-all duration-300 md:static md:block",
        open ? "block w-64" : "hidden",
        collapsed ? "md:w-16" : "md:w-72"
      )}
      aria-label="Sidebar"
    >
      <div className={cn(
        "mb-4 text-xs font-semibold uppercase text-muted-foreground",
        collapsed ? "md:hidden" : "hidden md:block"
      )}>Navigation</div>
      <nav className="flex flex-col gap-1">
        {NAV.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm hover:bg-muted flex items-center gap-2",
              pathname.startsWith(i.href) && "bg-muted"
            )}
            onClick={onClose}
          >
            <span className={collapsed ? "md:hidden" : ""}>{i.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
