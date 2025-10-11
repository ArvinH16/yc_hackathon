import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MapLegend() {
  const items: { color: string; label: string }[] = [
    { color: '#3b82f6', label: 'AI receptionist' },
    { color: '#9ca3af', label: 'Human receptionist' },
    { color: '#10b981', label: 'Easy target' },
    { color: '#fbbf24', label: 'Similar' },
    { color: '#ef4444', label: 'Threat' },
  ];

  return (
    <div className="absolute bottom-4 right-4 w-56 text-sm">
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
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
    </div>
  );
}
