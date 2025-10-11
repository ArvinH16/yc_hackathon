import type { BusinessType } from "@/types/business";

export interface CIThresholds {
  easyTargetBelowPct: number; // competitor is this much cheaper than customer (negative)
  similarBandPct: number; // +/- band considered similar
}

export interface CIConfig {
  id: string;
  label: string;
  searchRadiusMiles: number;
  includeTypes: BusinessType[];
  aiTakesPrecedence: boolean;
  thresholds: CIThresholds;
  analytics: {
    defaultPageSize: number;
    kpis: string[];
  };
  map?: {
    showLegend: boolean;
  };
  crm?: {
    defaultPageSize: number;
  };
  monitoring?: {
    maxRows: number;
  };
}
