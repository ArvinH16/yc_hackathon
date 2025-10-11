import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type LegendMode = 'ai' | 'competitive' | 'both';

export function MapLegend({ className = "", mode = 'both' }: { className?: string; mode?: LegendMode }) {
  const aiItems: { color: string; label: string }[] = [
    { color: '#3b82f6', label: 'AI receptionist' },
    { color: '#22c55e', label: 'Human receptionist' },
  ];
  const compItems: { color: string; label: string }[] = [
    { color: '#10b981', label: 'Easy target' },
    { color: '#fbbf24', label: 'Similar' },
    { color: '#ef4444', label: 'Threat' },
  ];
  const items = mode === 'ai' ? aiItems : mode === 'competitive' ? compItems : [...aiItems, ...compItems];

  return (
    <Card className={cn("text-sm", className)}>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-sm">Legend</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-1">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: i.color }} />
            <span>{i.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
