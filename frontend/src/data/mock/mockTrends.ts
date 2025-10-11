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
];

