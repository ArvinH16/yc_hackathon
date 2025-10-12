export type BusinessType = 'salon' | 'medspa' | 'barber' | 'spa' | 'hair' | 'nails';

// Simplified business model for mock/frontend usage
export interface SimplifiedBusiness {
  businessName: string;
  phone: string;
  email?: string;
  industry: BusinessType;
  services: string[]; // List of service names
  prices: Record<string, number>; // Map service name -> price
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Service {
  id: string;
  name: string;
  normalizedName: string;
  price: number;
  priceRange?: { min: number; max: number };
  duration?: number;
  category: string;
  description?: string;
}

export interface Availability {
  isAvailable: boolean;
  nextAvailable?: string; // ISO date string
  responseTime?: number; // minutes
  bookingMethod: 'phone' | 'online' | 'both' | 'unknown';
}

export interface AIDetection {
  isAI: boolean;
  confidence: number; // 0-1
  detectionMethod: 'voice_pattern' | 'response_time' | 'conversation_flow';
  aiProvider?: string; // "Beam Bell" | "Other" | "Unknown"
  issuesFound?: string[];
}

export interface CompetitiveEdge {
  advantages: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
}

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  location: Location;
  phone: string;
  email?: string;
  website?: string;
  services: Service[];
  availability: Availability;
  aiDetection: AIDetection;
  competitiveEdge?: CompetitiveEdge;
  lastUpdated: string; // ISO date string
  dataQuality: number; // 0-1
}
