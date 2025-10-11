"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV = [
  { label: "Customer — Map", href: "/dashboard/customer/map" },
  { label: "Customer — Analytics", href: "/dashboard/customer/analytics" },
  { label: "Customer — Monitoring", href: "/dashboard/customer/monitoring" },
  { label: "CRM — Leads", href: "/dashboard/crm/leads" },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r bg-background p-4 md:static md:block",
        open ? "block" : "hidden"
      )}
      aria-label="Sidebar"
    >
      <div className="mb-4 hidden text-xs font-semibold uppercase text-muted-foreground md:block">Navigation</div>
      <nav className="flex flex-col gap-1">
        <Link href="/" className={cn("rounded-md px-3 py-2 text-sm hover:bg-muted", pathname === "/" && "bg-muted")}>Home</Link>
        {NAV.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm hover:bg-muted",
              pathname.startsWith(i.href) && "bg-muted"
            )}
            onClick={onClose}
          >
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

