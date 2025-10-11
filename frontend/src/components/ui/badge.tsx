import { cn } from "@/lib/cn";

export function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: "default" | "secondary" | "outline"; className?: string; }) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const styles =
    variant === "secondary"
      ? "bg-secondary text-secondary-foreground"
      : variant === "outline"
        ? "border border-border"
        : "bg-primary/10 text-primary";
  return <span className={cn(base, styles, className)}>{children}</span>;
}

