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
  {
    serviceName: "Men's Haircut",
    normalizedName: "men's haircut",
    category: 'Hair Cut',
    areaStats: { average: 52, median: 50, min: 35, max: 85, stdDev: 10 },
    yourPrice: undefined,
    recommendation: {
      suggestedPrice: 52,
      reasoning: 'Consider adding a men\'s cut offering to capture incremental foot traffic from barber competition.',
      potentialRevenue: 900,
    },
  },
  {
    serviceName: 'Beard Trim',
    normalizedName: 'beard trim',
    category: 'Grooming',
    areaStats: { average: 22, median: 20, min: 10, max: 40, stdDev: 6 },
    yourPrice: undefined,
    recommendation: {
      suggestedPrice: 22,
      reasoning: 'Low-time, high-throughput add-on increases ticket size for male clientele.',
      potentialRevenue: 400,
    },
  },
  {
    serviceName: 'Swedish Massage',
    normalizedName: 'swedish massage',
    category: 'Massage',
    areaStats: { average: 122, median: 120, min: 80, max: 180, stdDev: 18 },
    recommendation: {
      suggestedPrice: 120,
      reasoning: 'Area average supports a $120 price point with strong demand.',
      potentialRevenue: 1600,
    },
  },
  {
    serviceName: 'Deep Tissue',
    normalizedName: 'deep tissue massage',
    category: 'Massage',
    areaStats: { average: 140, median: 140, min: 95, max: 210, stdDev: 22 },
    recommendation: {
      suggestedPrice: 145,
      reasoning: 'Premium positioning aligns with category; emphasize therapist specialization.',
      potentialRevenue: 1900,
    },
  },
  {
    serviceName: 'HydraFacial',
    normalizedName: 'hydrafacial',
    category: 'Facials',
    areaStats: { average: 235, median: 230, min: 160, max: 360, stdDev: 42 },
    recommendation: {
      suggestedPrice: 235,
      reasoning: 'High-demand treatment with clear market anchors; pair with membership.',
      potentialRevenue: 2500,
    },
  },
  {
    serviceName: 'Keratin Treatment',
    normalizedName: 'keratin smoothing treatment',
    category: 'Treatments',
    areaStats: { average: 340, median: 335, min: 250, max: 520, stdDev: 60 },
    recommendation: {
      suggestedPrice: 340,
      reasoning: 'Material cost supports premium; upsell to color clients.',
      potentialRevenue: 3200,
    },
  },
  {
    serviceName: 'Botox',
    normalizedName: 'botox',
    category: 'Injectables',
    areaStats: { average: 315, median: 320, min: 240, max: 450, stdDev: 50 },
    recommendation: {
      suggestedPrice: 320,
      reasoning: 'Competitive at market median; reinforce expertise to support price.',
      potentialRevenue: 4200,
    },
  },
  {
    serviceName: 'Manicure',
    normalizedName: 'manicure',
    category: 'Nails',
    areaStats: { average: 30, median: 28, min: 18, max: 55, stdDev: 7 },
    recommendation: {
      suggestedPrice: 30,
      reasoning: 'Add-on service to boost weekday utilization.',
      potentialRevenue: 600,
    },
  },
  {
    serviceName: 'Pedicure',
    normalizedName: 'pedicure',
    category: 'Nails',
    areaStats: { average: 42, median: 40, min: 28, max: 70, stdDev: 9 },
    recommendation: {
      suggestedPrice: 42,
      reasoning: 'Pairs well with manicure bundles; steady local demand.',
      potentialRevenue: 850,
    },
  },
  {
    serviceName: 'Blowout',
    normalizedName: 'blowout',
    category: 'Styling',
    areaStats: { average: 58, median: 55, min: 40, max: 85, stdDev: 10 },
    recommendation: {
      suggestedPrice: 58,
      reasoning: 'Useful filler service to maximize chair time between color services.',
      potentialRevenue: 700,
    },
  },
  {
    serviceName: 'Microneedling',
    normalizedName: 'microneedling',
    category: 'Skin',
    areaStats: { average: 305, median: 300, min: 220, max: 450, stdDev: 45 },
    recommendation: {
      suggestedPrice: 310,
      reasoning: 'Strong recurring treatment with package potential.',
      potentialRevenue: 3500,
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
    competitors: ['Luxe Hair Studio', 'Bay Beauty MedSpa', 'Sunset Styles'],
  },
  {
    id: 'opp-2',
    title: 'Introduce Membership for Blowouts',
    description: 'Weekly blowout pass at a discounted monthly rate increases retention and smooths demand.',
    type: 'market_gap',
    estimatedRevenue: 1200,
    confidence: 0.7,
    actionSteps: [
      'Define 2 membership tiers (2x/mo, 4x/mo)',
      'Add usage tracking in POS',
      'Promote to color clients',
    ],
    competitors: ['Marina Glow Salon', 'Ocean Avenue Salon'],
  },
  {
    id: 'opp-3',
    title: 'Price Align Botox to Market Median',
    description: 'Raise price $10 to match neighborhood median without affecting conversion.',
    type: 'price_increase',
    estimatedRevenue: 900,
    confidence: 0.6,
    actionSteps: ['Update price sheet', 'Announce upcoming change in newsletter'],
    competitors: ['Pacific Heights Aesthetics', 'Mission Med Aesthetics'],
  },
];
