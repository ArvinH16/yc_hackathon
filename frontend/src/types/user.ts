import type { SimplifiedBusiness } from './business';

export interface CustomerBusiness extends SimplifiedBusiness {
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired';
  searchRadius: number; // miles
  autoRefreshEnabled: boolean;
  refreshFrequency: 'daily' | 'weekly' | 'monthly';
}
