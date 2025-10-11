export function MapLegend() {
  const items: { color: string; label: string }[] = [
    { color: '#3b82f6', label: 'AI receptionist' },
    { color: '#9ca3af', label: 'Human receptionist' },
    { color: '#10b981', label: 'Easy target' },
    { color: '#fbbf24', label: 'Similar' },
    { color: '#ef4444', label: 'Threat' },
  ];

  return (
    <div className="absolute bottom-4 right-4 rounded-md bg-white/90 dark:bg-black/70 p-3 shadow-md text-sm">
      <div className="font-medium mb-2">Legend</div>
      <div className="space-y-1">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: i.color }}
            />
            <span>{i.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

