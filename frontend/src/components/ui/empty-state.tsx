import { cn } from "@/lib/cn";

export function EmptyState({
  title = "No data",
  description = "There is nothing to show right now.",
  action,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-10 text-center", className)}>
      <div className="text-base font-semibold">{title}</div>
      <div className="max-w-md text-sm text-muted-foreground">{description}</div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

