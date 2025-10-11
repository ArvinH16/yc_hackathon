import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  description,
  actions,
  className = "",
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
      className
    )}>
      <div className="flex-1">
        <h1 className="text-xl font-semibold leading-tight md:text-2xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2 md:shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
