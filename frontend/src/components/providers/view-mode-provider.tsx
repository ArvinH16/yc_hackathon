"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ViewMode = "customer" | "admin"; // Salon vs BeamBell

interface ViewModeContextValue {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextValue | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>("customer");

  useEffect(() => {
    const stored = (localStorage.getItem("view-mode") as ViewMode | null) ?? "customer";
    setModeState(stored);
  }, []);

  const setMode = (m: ViewMode) => {
    localStorage.setItem("view-mode", m);
    setModeState(m);
  };

  const value = useMemo(() => ({ mode, setMode }), [mode]);
  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error("useViewMode must be used within ViewModeProvider");
  return ctx;
}

