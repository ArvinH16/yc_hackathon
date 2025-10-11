import type { SimplifiedBusiness } from '@/types/business';
import type { CIConfig } from '@/types/config';
import { mockAIStatus } from '@/data/mock/mockAIStatus';
import { mockLeads } from '@/data/mock/mockLeads';
import { mockCompetitors, mockCustomerBusiness } from '@/data/mock/mockBusinesses';

export type CompetitiveClass = 'easy_target' | 'similar' | 'threat';

export function averageServicePrice(b: SimplifiedBusiness): number | null {
  if (!b || !b.services || b.services.length === 0) return null;
  let sum = 0;
  let count = 0;
  for (const name of b.services) {
    const p = b.prices[name];
    if (typeof p === 'number' && !Number.isNaN(p)) {
      sum += p;
      count += 1;
    }
  }
  return count ? sum / count : null;
}

export function assessCompetitiveness(
  competitor: SimplifiedBusiness,
  customer: SimplifiedBusiness,
  cfg: CIConfig
): { class: CompetitiveClass; diffPct: number | null; competitorAvg: number | null; customerAvg: number | null } {
  const competitorAvg = averageServicePrice(competitor);
  const customerAvg = averageServicePrice(customer);
  if (competitorAvg == null || customerAvg == null || customerAvg === 0) {
    return { class: 'similar', diffPct: null, competitorAvg, customerAvg };
  }
  const diffPct = ((competitorAvg - customerAvg) / customerAvg) * 100;
  const easyBelow = cfg.thresholds.easyTargetBelowPct ?? 15;
  const similarBand = cfg.thresholds.similarBandPct ?? 15;
  if (diffPct <= -easyBelow) return { class: 'easy_target', diffPct, competitorAvg, customerAvg };
  if (Math.abs(diffPct) < similarBand) return { class: 'similar', diffPct, competitorAvg, customerAvg };
  return { class: 'threat', diffPct, competitorAvg, customerAvg };
}

export function suggestionsForClass(c: CompetitiveClass): string[] {
  switch (c) {
    case 'easy_target':
      return [
        'Consider targeted promotions to capture their customers',
        'Emphasize premium positioning and reviews to justify price',
      ];
    case 'similar':
      return [
        'Differentiate with memberships or bundles',
        'Highlight convenience: online booking, fast response, hours',
      ];
    case 'threat':
      return [
        'Evaluate selective price alignment on flagship services',
        'Improve perceived value: expertise, social proof, add-ons',
      ];
  }
}

export function getAIDetectionFor(name: string): 'ai' | 'human' | 'unknown' {
  return mockAIStatus[name] ?? 'unknown';
}

export function getLeadForBusiness(name: string) {
  return mockLeads.find((l) => l.businessName === name);
}

export function summarizeLeads() {
  const total = mockLeads.length;
  const avgLeadScore = total ? Math.round((mockLeads.reduce((a, b) => a + b.leadScore, 0) / total) * 10) / 10 : 0;
  const byStatus = new Map<string, number>();
  for (const l of mockLeads) {
    byStatus.set(l.outreachStatus, (byStatus.get(l.outreachStatus) ?? 0) + 1);
  }
  const topByConversion = [...mockLeads]
    .sort((a, b) => b.conversionProbability - a.conversionProbability)
    .slice(0, 10);
  return { total, avgLeadScore, byStatus, topByConversion };
}

export function getAIUsageCounts() {
  let ai = 0;
  let human = 0;
  for (const b of mockCompetitors) {
    const v = mockAIStatus[b.businessName];
    if (v === 'ai') ai += 1;
    else if (v === 'human') human += 1;
  }
  return { ai, human, total: ai + human };
}

export function defaultCustomer() {
  return mockCustomerBusiness;
}

