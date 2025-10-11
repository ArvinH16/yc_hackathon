import { cn } from "@/lib/cn";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'wide' | 'full';
}

export function PageContainer({ className = "", children, size = 'default', ...props }: PageContainerProps) {
  return (
    <div
      className={cn(
        "px-4 py-6 md:px-6 md:py-8",
        size === 'default' && "mx-auto max-w-7xl",
        size === 'wide' && "mx-auto max-w-[90rem]",
        size === 'full' && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
