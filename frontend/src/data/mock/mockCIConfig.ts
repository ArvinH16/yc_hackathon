import type { CIConfig } from "@/types/config";

export const defaultCIConfig: CIConfig = {
  id: 'default-ci',
  label: 'Default Competitive Intelligence',
  searchRadiusMiles: 10,
  includeTypes: ['salon', 'spa', 'barber', 'medspa'],
  aiTakesPrecedence: true,
  thresholds: {
    easyTargetBelowPct: 15, // competitor 15% cheaper -> easy target
    similarBandPct: 15, // +/- 15% is considered similar
  },
  analytics: {
    defaultPageSize: 10,
    kpis: ['Competitors Analyzed', 'Services Tracked', 'Opportunities'],
  },
  map: { showLegend: true },
  crm: { defaultPageSize: 10 },
  monitoring: { maxRows: 20 },
};
