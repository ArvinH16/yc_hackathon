"use client";

import { MapView } from './MapView';

export function MapViewCompetitive() {
  // Force remount when switching to Competitive mode
  return <MapView colorBy="competitive" key="competitive-mode" />;
}

