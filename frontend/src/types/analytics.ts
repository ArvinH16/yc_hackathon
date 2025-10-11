export interface PricingAnalytics {
  serviceName: string;
  normalizedName: string;
  category: string;
  areaStats: {
    average: number;
    median: number;
    min: number;
    max: number;
    stdDev: number;
  };
  yourPrice?: number;
  recommendation: {
    suggestedPrice: number;
    reasoning: string;
    potentialRevenue: number; // per month
  };
}

export interface MarketTrendPoint {
  date: string; // ISO date
  averagePrice: number;
  competitors: number;
}

export interface MarketTrend {
  serviceName: string;
  data: MarketTrendPoint[];
  trend: 'increasing' | 'decreasing' | 'stable';
  percentageChange: number;
}

export interface RevenueOpportunity {
  id: string;
  title: string;
  description: string;
  type: 'new_service' | 'price_increase' | 'market_gap';
  estimatedRevenue: number; // per month
  confidence: number; // 0-1
  actionSteps: string[];
  competitors: string[]; // Business IDs
}

