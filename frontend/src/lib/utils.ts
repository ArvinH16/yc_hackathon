import type { Business } from '@/types/business';
import type { CustomerBusiness } from '@/types/user';
import { MARKER_COLORS } from '@/constants/colors';

// Calculate distance between two coordinates in miles (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // radius of Earth in miles
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function filterByRadius(
  competitors: Business[],
  centerLat: number,
  centerLng: number,
  radiusMiles: number
): Business[] {
  return competitors.filter((b) => {
    const d = calculateDistance(centerLat, centerLng, b.location.lat, b.location.lng);
    return d <= radiusMiles;
  });
}

function avgServicePrice(services: Business['services']): number | null {
  if (!services.length) return null;
  const sum = services.reduce((acc, s) => acc + (s.price ?? 0), 0);
  const count = services.filter((s) => typeof s.price === 'number').length;
  return count ? sum / count : null;
}

export function getCompetitorColor(business: Business, customer: CustomerBusiness): string {
  // AI presence takes precedence for visualization simplicity
  if (business.aiDetection?.isAI) return MARKER_COLORS.ai_agent;
  if (business.aiDetection && business.aiDetection.isAI === false) return MARKER_COLORS.human;

  const competitorAvg = avgServicePrice(business.services);
  const customerAvg = avgServicePrice(customer.services);

  if (competitorAvg != null && customerAvg != null) {
    const diffPct = ((competitorAvg - customerAvg) / customerAvg) * 100;
    if (diffPct <= -15) return MARKER_COLORS.easy_target;
    if (Math.abs(diffPct) < 15) return MARKER_COLORS.similar;
    return MARKER_COLORS.threat;
  }

  // Fallback
  return MARKER_COLORS.similar;
}

