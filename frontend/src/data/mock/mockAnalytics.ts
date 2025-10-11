import type { PricingAnalytics, RevenueOpportunity } from '@/types/analytics';

export const mockPricingAnalytics: PricingAnalytics[] = [
  {
    serviceName: "Women's Haircut",
    normalizedName: "women's haircut",
    category: 'Hair Cut',
    areaStats: { average: 82, median: 80, min: 45, max: 150, stdDev: 18 },
    yourPrice: 75,
    recommendation: {
      suggestedPrice: 85,
      reasoning:
        'Your pricing is ~8.5% below market average. Increasing to $85 maintains competitiveness while capturing additional revenue.',
      potentialRevenue: 1200,
    },
  },
  {
    serviceName: 'Balayage',
    normalizedName: 'hand-painted highlights',
    category: 'Hair Color',
    areaStats: { average: 235, median: 230, min: 150, max: 400, stdDev: 45 },
    yourPrice: 200,
    recommendation: {
      suggestedPrice: 225,
      reasoning:
        'Competitors in your tier charge $220-$260. Adjust to $225 to improve margins while staying attractive.',
      potentialRevenue: 1800,
    },
  },
];

export const mockRevenueOpportunities: RevenueOpportunity[] = [
  {
    id: 'opp-1',
    title: 'Add Keratin Treatment Service',
    description:
      '3 nearby competitors offer keratin treatments at $325-375. High demand service with strong margins.',
    type: 'new_service',
    estimatedRevenue: 5000,
    confidence: 0.85,
    actionSteps: [
      'Source keratin product supplier (e.g., Brazilian Blowout or Cezanne)',
      'Train 2 stylists on application technique',
      'Set competitive price at $340',
      'Market to existing balayage customers',
    ],
    competitors: ['comp-1', 'comp-4', 'comp-5'],
  },
];
