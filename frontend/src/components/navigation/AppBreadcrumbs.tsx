"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const LABEL_MAP: Record<string, string> = {
  "": "Home",
  home: "Home",
  dashboard: "Dashboard",
  customer: "Customer",
  business: "Business",
  businesses: "Businesses",
  crm: "CRM",
  leads: "Leads",
  analytics: "Analytics",
  monitoring: "Monitoring",
  map: "Map",
};

function toTitleCase(segment: string) {
  return segment
    .replaceAll("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function labelForSegment(segment: string) {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  // Dynamic routes (e.g., ids) – show raw value or prettified
  if (/^\d+$/.test(segment)) return segment; // numeric id
  if (segment.length > 24) return segment.slice(0, 24) + "…"; // long ids
  return toTitleCase(segment);
}

export function AppBreadcrumbs() {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);

  // No breadcrumbs on the landing page
  if (parts.length === 0) return null;

  const items = ["", ...parts];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((seg, idx) => {
          const href = "/" + items.slice(1, idx + 1).join("/");
          const isLast = idx === items.length - 1;
          const label = labelForSegment(seg);

          return (
            <Fragment key={href || "/"}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <Link
                    href={href || "/"}
                    className="transition-colors hover:text-foreground/90 text-foreground/70"
                  >
                    {label}
                  </Link>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
