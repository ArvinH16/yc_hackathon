"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import { useViewMode } from "@/components/providers/view-mode-provider";

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";
  const { mode, setMode } = useViewMode();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button className="md:hidden" aria-label="Toggle sidebar" onClick={onMenuClick}>
            {/* menu icon */}
            <svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
          </button>
          <span className="text-sm font-semibold">Beam Bell</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-label="Toggle view mode"
            onClick={() => setMode(mode === 'customer' ? 'admin' : 'customer')}
            title={`Switch to ${mode === 'customer' ? 'Admin' : 'Customer'} view`}
          >
            {mode === 'customer' ? 'Salon View' : 'BeamBell View'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(nextTheme)}
            title={`Switch to ${nextTheme} mode`}
          >
            {theme === "dark" ? (
              // sun icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>
            ) : (
              // moon icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </Button>
          <div className="hidden text-xs text-muted-foreground sm:block">UI Preview</div>
        </div>
      </div>
    </header>
  );
}
