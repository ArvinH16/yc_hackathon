export interface CompanyProfile {
  businessName: string;
  tagline?: string;
  description: string; // What they do
  specialties?: string[];
  categories?: string[]; // Sub-categories/verticals
  foundedYear?: number;
  employees?: number;
  hours?: Array<{ day: string; open: string; close: string }>;
  serviceAreas?: string[];
  social?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    yelp?: string;
    google?: string;
  };
  notes?: string[];
  defaultConfigId?: string;
}
