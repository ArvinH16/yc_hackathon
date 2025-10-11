import type { MarketTrend } from '@/types/analytics';

export const mockTrends: MarketTrend[] = [
  {
    serviceName: "Women's Haircut",
    data: [
      { date: '2025-06-01', averagePrice: 78, competitors: 20 },
      { date: '2025-07-01', averagePrice: 79, competitors: 21 },
      { date: '2025-08-01', averagePrice: 81, competitors: 22 },
      { date: '2025-09-01', averagePrice: 82, competitors: 23 },
      { date: '2025-10-01', averagePrice: 83, competitors: 23 },
    ],
    trend: 'increasing',
    percentageChange: 6.4,
  },
  {
    serviceName: 'Balayage',
    data: [
      { date: '2025-06-01', averagePrice: 225, competitors: 16 },
      { date: '2025-07-01', averagePrice: 228, competitors: 16 },
      { date: '2025-08-01', averagePrice: 232, competitors: 17 },
      { date: '2025-09-01', averagePrice: 235, competitors: 18 },
      { date: '2025-10-01', averagePrice: 235, competitors: 18 },
    ],
    trend: 'increasing',
    percentageChange: 4.4,
  },
  {
    serviceName: "Men's Haircut",
    data: [
      { date: '2025-06-01', averagePrice: 50, competitors: 18 },
      { date: '2025-07-01', averagePrice: 51, competitors: 19 },
      { date: '2025-08-01', averagePrice: 51, competitors: 20 },
      { date: '2025-09-01', averagePrice: 52, competitors: 21 },
      { date: '2025-10-01', averagePrice: 52, competitors: 21 },
    ],
    trend: 'increasing',
    percentageChange: 4,
  },
  {
    serviceName: 'HydraFacial',
    data: [
      { date: '2025-06-01', averagePrice: 220, competitors: 10 },
      { date: '2025-07-01', averagePrice: 225, competitors: 11 },
      { date: '2025-08-01', averagePrice: 230, competitors: 12 },
      { date: '2025-09-01', averagePrice: 235, competitors: 12 },
      { date: '2025-10-01', averagePrice: 235, competitors: 13 },
    ],
    trend: 'increasing',
    percentageChange: 6.8,
  },
  {
    serviceName: 'Deep Tissue',
    data: [
      { date: '2025-06-01', averagePrice: 138, competitors: 12 },
      { date: '2025-07-01', averagePrice: 139, competitors: 12 },
      { date: '2025-08-01', averagePrice: 141, competitors: 13 },
      { date: '2025-09-01', averagePrice: 142, competitors: 14 },
      { date: '2025-10-01', averagePrice: 140, competitors: 14 },
    ],
    trend: 'stable',
    percentageChange: 1.4,
  },
  {
    serviceName: 'Botox',
    data: [
      { date: '2025-06-01', averagePrice: 310, competitors: 7 },
      { date: '2025-07-01', averagePrice: 312, competitors: 8 },
      { date: '2025-08-01', averagePrice: 315, competitors: 8 },
      { date: '2025-09-01', averagePrice: 317, competitors: 9 },
      { date: '2025-10-01', averagePrice: 315, competitors: 9 },
    ],
    trend: 'increasing',
    percentageChange: 1.6,
  },
];
