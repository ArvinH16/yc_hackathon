import { cn } from "@/lib/cn";

export function Skeleton({ className = "h-4 w-full" }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

