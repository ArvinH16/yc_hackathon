"use client";

import { MapView } from './MapView';

export function MapViewAI() {
  // Force remount when switching to AI mode
  return <MapView colorBy="ai" key="ai-mode" />;
}

