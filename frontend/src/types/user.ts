import type { Business } from './business';

export interface CustomerBusiness extends Business {
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired';
  searchRadius: number; // miles
  autoRefreshEnabled: boolean;
  refreshFrequency: 'daily' | 'weekly' | 'monthly';
}

