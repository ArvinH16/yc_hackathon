# PRP: Competitive Intelligence Platform Frontend

## Executive Summary

Build a comprehensive dual-dashboard system for the Beam Bell Competitive Intelligence Platform using Next.js 15, React 19, TypeScript, and Tailwind CSS. The system consists of:

1. **Customer-Facing Dashboard** - For salon owners to analyze competitors and optimize their business
2. **Internal CRM Dashboard** - For Beam Bell's sales team to identify and track leads

### Key Features of This Implementation

🗺️ **Open-Source Maps** - Uses React Leaflet + OpenStreetMap (no API keys, no usage limits, completely free)

📍 **Auto Location Detection** - Browser geolocation API automatically detects user's actual location with fallback support

⭕ **50-Mile Radius Visualization** - Visual circle overlay showing the exact search area around user's location

🎯 **Distance-Based Filtering** - Competitors are automatically filtered to show only businesses within 50-mile radius

💰 **Zero Cost** - No Google Maps API keys, no billing surprises, no rate limits

---

## Technology Stack Research

### Core Framework
- **Next.js 15.5.4** with App Router (already installed)
- **React 19.1.0** (already installed)
- **TypeScript 5+** (already installed)
- **Tailwind CSS v4** (already installed)

### Required Dependencies

#### Maps Integration
**Library**: `react-leaflet` with OpenStreetMap (fully open-source, no API keys)
- **Why**: Free, open-source, no usage limits, works great with Next.js 15
- **Tile Provider**: OpenStreetMap (free public tile server)
- **Docs**: https://react-leaflet.js.org/
- **Installation**: `npm install react-leaflet leaflet leaflet-defaulticon-compatibility && npm install -D @types/leaflet`
- **Note**: Requires dynamic import or 'use client' directive due to DOM dependencies
- **Production Note**: For high-traffic production use, consider alternative tile providers like MapTiler (free tier available) or self-hosting tiles. OSM public tiles are perfect for development/demos.

#### Dashboard & Charts
**Library**: `tremor` (highly recommended for 2025)
- **Why**: 35+ open-source components built on React, Tailwind CSS, and Radix UI
- **Features**: Built on Recharts, production-ready, 250+ blocks/templates
- **Docs**: https://www.tremor.so/docs/getting-started/installation
- **Installation**: `npm install @tremor/react`

**Alternative Charting**: `recharts` v3.0 (if granular control needed)
- **Why**: Major 2025 update with enhanced accessibility, animations, TypeScript support
- **Docs**: https://recharts.org/
- **Installation**: `npm install recharts`

#### Data Tables
**Library**: `@tanstack/react-table` (industry standard)
- **Why**: Headless, TypeScript-first, powerful filtering/sorting/pagination
- **Docs**: https://tanstack.com/table/latest
- **Installation**: `npm install @tanstack/react-table`

#### UI Components
**Library**: `shadcn/ui` (recommended for Tailwind CSS projects)
- **Why**: Copy-paste components, full customization, works with Tremor
- **Docs**: https://ui.shadcn.com/docs/installation/next
- **Installation**: `npx shadcn@latest init`

#### Date/Time Handling
**Library**: `date-fns`
- **Installation**: `npm install date-fns`

---

## Codebase Context

### Current Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with Geist fonts
│   │   ├── page.tsx        # Homepage (to be replaced)
│   │   └── globals.css     # Tailwind v4 with CSS variables
│   └── ...
├── package.json            # Dependencies already include React 19, Next.js 15, Tailwind v4
└── tsconfig.json           # Configured with @/* path alias
```

### Existing Conventions
- **Styling**: Tailwind CSS v4 with CSS variables (`--background`, `--foreground`)
- **Fonts**: Geist Sans and Geist Mono from `next/font/google`
- **Path Aliases**: `@/*` maps to `./src/*`
- **Dark Mode**: Supported via `prefers-color-scheme`

---

## Mock Data Structures

### 1. Business/Competitor Data

```typescript
// src/types/business.ts

export type BusinessType = 'salon' | 'spa' | 'barber' | 'medspa';

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
  normalizedName: string; // AI-normalized (e.g., "Balayage" -> "hand-painted highlights")
  price: number;
  priceRange?: { min: number; max: number };
  duration?: number; // in minutes
  category: string; // e.g., "Hair Color", "Hair Cut", "Treatments"
  description?: string;
}

export interface Availability {
  isAvailable: boolean;
  nextAvailable?: string; // ISO date string
  responseTime?: number; // in minutes
  bookingMethod: 'phone' | 'online' | 'both' | 'unknown';
}

export interface AIDetection {
  isAI: boolean;
  confidence: number; // 0-1
  detectionMethod: 'voice_pattern' | 'response_time' | 'conversation_flow';
  aiProvider?: string; // "Beam Bell" | "Other" | "Unknown"
  issuesFound?: string[]; // Weakness/issues in competitor AI
}

export interface CompetitiveEdge {
  advantages: string[]; // What we do better
  opportunities: string[]; // What we can learn from them
  threats: string[]; // What they do better
  recommendations: string[]; // LLM-generated action items
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
  competitiveEdge?: CompetitiveEdge; // Only for customer dashboard
  lastUpdated: string; // ISO date string
  dataQuality: number; // 0-1, how complete is the data
}
```

### 2. Call/Transcription Data

```typescript
// src/types/call.ts

export interface CallTranscript {
  id: string;
  businessId: string;
  timestamp: string;
  duration: number; // in seconds
  transcript: string;
  sentimentScore?: number; // -1 to 1
  keyInsights: string[];
  questionsAsked: string[];
  answersReceived: string[];
}
```

### 3. Analytics Data

```typescript
// src/types/analytics.ts

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
    potentialRevenue: number;
  };
}

export interface MarketTrend {
  serviceName: string;
  data: {
    date: string;
    averagePrice: number;
    competitors: number;
  }[];
  trend: 'increasing' | 'decreasing' | 'stable';
  percentageChange: number; // Over time period
}

export interface RevenueOpportunity {
  id: string;
  title: string;
  description: string;
  type: 'new_service' | 'price_increase' | 'market_gap';
  estimatedRevenue: number; // per month
  confidence: number; // 0-1
  actionSteps: string[];
  competitors: string[]; // Business IDs offering this
}
```

### 4. CRM/Lead Data

```typescript
// src/types/crm.ts

export type OutreachStatus =
  | 'not_contacted'
  | 'email_sent'
  | 'follow_up_sent'
  | 'responded'
  | 'meeting_scheduled'
  | 'converted'
  | 'not_interested';

export interface Lead {
  businessId: string;
  business: Business;
  leadScore: number; // 0-100
  aiDetection: AIDetection;
  outreachStatus: OutreachStatus;
  emailsSent: number;
  lastContactDate?: string;
  nextFollowUp?: string;
  notes: string[];
  assignedTo?: string; // Sales rep name
  conversionProbability: number; // 0-1
}
```

### 5. User/Customer Data

```typescript
// src/types/user.ts

export interface CustomerBusiness extends Business {
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired';
  searchRadius: number; // in miles
  autoRefreshEnabled: boolean;
  refreshFrequency: 'daily' | 'weekly' | 'monthly';
}
```

---

## Mock Data Files

Create these files in `src/data/mock/`:

### `mockBusinesses.ts`
```typescript
import { Business } from '@/types/business';

export const mockCompetitors: Business[] = [
  {
    id: 'comp-1',
    name: "Luxe Hair Studio",
    type: 'salon',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "123 Market St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102"
    },
    phone: "(415) 555-0101",
    email: "info@luxehairstudio.com",
    website: "https://luxehairstudio.com",
    services: [
      {
        id: 's1',
        name: "Women's Haircut",
        normalizedName: "women's haircut",
        price: 85,
        duration: 60,
        category: "Hair Cut"
      },
      {
        id: 's2',
        name: "Balayage",
        normalizedName: "hand-painted highlights",
        price: 250,
        duration: 180,
        category: "Hair Color"
      },
      {
        id: 's3',
        name: "Keratin Treatment",
        normalizedName: "keratin smoothing treatment",
        price: 350,
        duration: 120,
        category: "Treatments"
      }
    ],
    availability: {
      isAvailable: true,
      nextAvailable: "2025-10-13T10:00:00Z",
      responseTime: 5,
      bookingMethod: 'both'
    },
    aiDetection: {
      isAI: false,
      confidence: 0.95,
      detectionMethod: 'voice_pattern'
    },
    competitiveEdge: {
      advantages: [
        "AI receptionist available 24/7 vs. their business hours only",
        "Online booking integrated vs. phone-only scheduling"
      ],
      opportunities: [
        "They offer keratin treatments which we don't - potential $5K/month revenue",
        "Their pricing for balayage is 15% higher - we could increase prices"
      ],
      threats: [
        "Located in high-traffic area with better foot traffic"
      ],
      recommendations: [
        "Add keratin treatment service with competitive pricing at $325",
        "Increase balayage pricing to $230 (still competitive, +$30 per service)",
        "Emphasize AI receptionist in marketing to differentiate"
      ]
    },
    lastUpdated: "2025-10-11T12:00:00Z",
    dataQuality: 0.92
  },
  // Add 15-20 more competitors with varying data...
];

export const mockCustomerBusiness: CustomerBusiness = {
  id: 'customer-1',
  name: "Your Salon Name",
  type: 'salon',
  location: {
    lat: 37.7849,
    lng: -122.4094,
    address: "456 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103"
  },
  phone: "(415) 555-0200",
  website: "https://yoursalon.com",
  services: [
    {
      id: 'ys1',
      name: "Women's Haircut",
      normalizedName: "women's haircut",
      price: 75,
      duration: 60,
      category: "Hair Cut"
    },
    {
      id: 'ys2',
      name: "Balayage",
      normalizedName: "hand-painted highlights",
      price: 200,
      duration: 180,
      category: "Hair Color"
    }
  ],
  availability: {
    isAvailable: true,
    bookingMethod: 'both'
  },
  aiDetection: {
    isAI: true,
    confidence: 1.0,
    detectionMethod: 'conversation_flow',
    aiProvider: 'Beam Bell'
  },
  lastUpdated: "2025-10-11T12:00:00Z",
  dataQuality: 1.0,
  subscriptionPlan: 'pro',
  subscriptionStatus: 'active',
  searchRadius: 50,
  autoRefreshEnabled: true,
  refreshFrequency: 'weekly'
};
```

### `mockAnalytics.ts`
```typescript
export const mockPricingAnalytics: PricingAnalytics[] = [
  {
    serviceName: "Women's Haircut",
    normalizedName: "women's haircut",
    category: "Hair Cut",
    areaStats: {
      average: 82,
      median: 80,
      min: 45,
      max: 150,
      stdDev: 18
    },
    yourPrice: 75,
    recommendation: {
      suggestedPrice: 85,
      reasoning: "Your pricing is 8.5% below market average. Competitors in similar quality tier charge $80-95. Increasing to $85 maintains competitiveness while capturing additional revenue.",
      potentialRevenue: 1200 // per month
    }
  },
  // More services...
];

export const mockRevenueOpportunities: RevenueOpportunity[] = [
  {
    id: 'opp-1',
    title: "Add Keratin Treatment Service",
    description: "3 nearby competitors offer keratin treatments at $325-375. High demand service with strong margins.",
    type: 'new_service',
    estimatedRevenue: 5000,
    confidence: 0.85,
    actionSteps: [
      "Source keratin product supplier (recommended: Brazilian Blowout or Cezanne)",
      "Train 2 stylists on application technique",
      "Set competitive price at $340",
      "Market to existing balayage customers"
    ],
    competitors: ['comp-1', 'comp-4', 'comp-7']
  },
  // More opportunities...
];
```

### `mockLeads.ts`
```typescript
export const mockLeads: Lead[] = [
  {
    businessId: 'comp-1',
    leadScore: 85,
    outreachStatus: 'email_sent',
    emailsSent: 1,
    lastContactDate: "2025-10-10T14:00:00Z",
    nextFollowUp: "2025-10-14T10:00:00Z",
    notes: [
      "High-quality salon using human receptionist",
      "Owner expressed interest in automation during discovery call"
    ],
    conversionProbability: 0.72
  },
  // More leads...
];
```

---

## Screen Architecture

### Customer-Facing Dashboard (at `/dashboard/customer`)

#### 1. **Map View** (`/dashboard/customer/map`)
**Purpose**: Visual radar of competitors around customer's salon

**Components**:
- `MapView.tsx` - Main map container with Leaflet/OpenStreetMap
- `CompetitorMarker.tsx` - Custom map markers with color coding
- `BusinessDetailModal.tsx` - Popup when clicking marker
- `MapControls.tsx` - Filters, refresh controls
- `MapLegend.tsx` - Color code explanation

**Features**:
- **Auto-detect user's location** using browser geolocation API
- **50-mile radius circle** overlay showing search area
- Center map on user's actual location (with fallback)
- Color-coded markers based on competitive positioning:
  - 🟢 Green: Easy to edge out (lower quality/service)
  - 🟡 Yellow: Similar competitive level
  - 🔴 Red: Strong competitor (threats)
  - 🔵 Blue: Using AI receptionist
  - ⚪ Gray: Using human receptionist
- Click marker → Show detailed findings page overlay
- Filter by: service type, AI detection, pricing level

#### 2. **Analytics Dashboard** (`/dashboard/customer/analytics`)
**Purpose**: Comprehensive analysis of market data

**Components**:
- `AnalyticsDashboard.tsx` - Main layout
- `PricingCard.tsx` - Per-service pricing breakdown
- `RevenueOpportunityCard.tsx` - Action items for revenue growth
- `ServiceComparison.tsx` - What you offer vs. competitors
- `MarketInsights.tsx` - LLM-generated recommendations (MOST IMPORTANT)

**Sections**:
1. **Overview Metrics**:
   - Total competitors analyzed
   - Average pricing vs. yours
   - Services you're missing
   - AI adoption rate in area

2. **Pricing Intelligence**:
   - Service-by-service table with area statistics
   - Your price vs. average/median/range
   - Recommended pricing with reasoning
   - Revenue simulation calculator

3. **Product Recommendations** ⭐:
   - LLM-powered strategic insights
   - "What can we do to edge out competitors?"
   - New service opportunities
   - Pricing optimization suggestions
   - Marketing differentiation ideas

#### 3. **Monitoring Dashboard** (`/dashboard/customer/monitoring`)
**Purpose**: Track market trends over time

**Components**:
- `TrendChart.tsx` - Time-series pricing charts
- `CompetitorTimeline.tsx` - New competitors, closures
- `PricingChangeAlerts.tsx` - Notification of market changes
- `HistoricalComparison.tsx` - Your performance vs. market

**Features**:
- Weekly/monthly trend visualization
- Automated alerts for significant market changes
- Historical data comparison
- Export functionality for reports

---

### Internal CRM Dashboard (at `/dashboard/crm`)

#### 1. **Leads Overview** (`/dashboard/crm/leads`)
**Purpose**: Track sales opportunities

**Components**:
- `LeadsTable.tsx` - Main table with TanStack Table
- `LeadDetailPanel.tsx` - Detailed view with transcripts
- `OutreachTracker.tsx` - Email status, follow-ups
- `LeadScoreCard.tsx` - Visual lead quality indicator

**Columns**:
- Business name
- AI/Human indicator (toggle/badge)
- Lead score (0-100)
- Outreach status
- Last contact date
- Next follow-up
- Assigned sales rep
- Actions (view details, send email, add note)

**Filters**:
- AI vs. Human
- Outreach status
- Lead score range
- Date range
- Assigned rep

#### 2. **AI Analysis** (`/dashboard/crm/ai-analysis`)
**Purpose**: Deep dive into competitor AI agents

**Components**:
- `AIAgentList.tsx` - Businesses using AI
- `TranscriptViewer.tsx` - Full conversation playback
- `IssueAnalyzer.tsx` - Identified AI weaknesses
- `CompetitorAICard.tsx` - AI provider detection

**Features**:
- Pull transcripts via Kova API
- LLM analysis of conversation quality
- Weakness identification (e.g., poor handling of edge cases)
- Generate sales ammunition for outreach

#### 3. **Outreach Dashboard** (`/dashboard/crm/outreach`)
**Purpose**: Manage sales campaigns

**Components**:
- `EmailTemplates.tsx` - Pre-built outreach templates
- `CampaignTracker.tsx` - Email campaign performance
- `ConversionFunnel.tsx` - Lead → Customer pipeline
- `AutomationRules.tsx` - Trigger-based email sequences

---

## File Structure

```
frontend/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (landing/login page)
│   ├── globals.css
│   ├── dashboard/
│   │   ├── customer/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (redirect to /map)
│   │   │   ├── map/
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   └── monitoring/
│   │   │       └── page.tsx
│   │   └── crm/
│   │       ├── layout.tsx
│   │       ├── page.tsx (redirect to /leads)
│   │       ├── leads/
│   │       │   └── page.tsx
│   │       ├── ai-analysis/
│   │       │   └── page.tsx
│   │       └── outreach/
│   │           └── page.tsx
│   └── api/ (if needed for server actions)
├── components/
│   ├── ui/ (shadcn components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ... (other shadcn components)
│   ├── dashboard/
│   │   ├── customer/
│   │   │   ├── MapView.tsx
│   │   │   ├── CompetitorMarker.tsx
│   │   │   ├── BusinessDetailModal.tsx
│   │   │   ├── MapControls.tsx
│   │   │   ├── MapLegend.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── PricingCard.tsx
│   │   │   ├── RevenueOpportunityCard.tsx
│   │   │   ├── ServiceComparison.tsx
│   │   │   ├── MarketInsights.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   ├── CompetitorTimeline.tsx
│   │   │   ├── PricingChangeAlerts.tsx
│   │   │   └── HistoricalComparison.tsx
│   │   └── crm/
│   │       ├── LeadsTable.tsx
│   │       ├── LeadDetailPanel.tsx
│   │       ├── OutreachTracker.tsx
│   │       ├── LeadScoreCard.tsx
│   │       ├── AIAgentList.tsx
│   │       ├── TranscriptViewer.tsx
│   │       ├── IssueAnalyzer.tsx
│   │       ├── CompetitorAICard.tsx
│   │       ├── EmailTemplates.tsx
│   │       ├── CampaignTracker.tsx
│   │       ├── ConversionFunnel.tsx
│   │       └── AutomationRules.tsx
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
├── lib/
│   ├── utils.ts (shadcn utils + distance calculations)
│   └── api/ (API client functions)
├── hooks/
│   ├── useGeolocation.ts
│   ├── useBusinesses.ts
│   ├── useAnalytics.ts
│   ├── useLeads.ts
│   └── useMapControls.ts
├── types/
│   ├── business.ts
│   ├── analytics.ts
│   ├── call.ts
│   ├── crm.ts
│   └── user.ts
├── data/
│   └── mock/
│       ├── mockBusinesses.ts
│       ├── mockAnalytics.ts
│       ├── mockLeads.ts
│       └── mockTrends.ts
└── constants/
    ├── colors.ts (marker colors, chart colors)
    └── config.ts (API keys, URLs)
```

---

## Implementation Blueprint

### Phase 1: Setup & Configuration (Tasks 1-5)

#### Task 1: Install Dependencies
```bash
cd frontend

# Core libraries
npm install react-leaflet leaflet leaflet-defaulticon-compatibility
npm install -D @types/leaflet
npm install @tremor/react
npm install @tanstack/react-table
npm install date-fns
npm install clsx tailwind-merge

# shadcn/ui setup
npx shadcn@latest init
# Select: Default style, Slate color, CSS variables

# Install specific shadcn components
npx shadcn@latest add button card dialog table badge tabs select input label
```

**Important**: Add Leaflet CSS to `src/app/layout.tsx`:
```typescript
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
```

#### Task 2: Create Type Definitions
- Create `src/types/` directory
- Copy all TypeScript interfaces from Mock Data Structures section above
- Create barrel exports in `src/types/index.ts`

#### Task 3: Create Mock Data Files
- Create `src/data/mock/` directory
- Implement `mockBusinesses.ts` with 15-20 competitors
  - **Important**: Generate competitor coordinates within 50-mile radius of a center point (e.g., San Francisco)
  - Vary distances (some close, some at edge of radius)
  - Use the `calculateDistance` utility to verify they're within 50 miles
- Implement `mockAnalytics.ts` with pricing data and opportunities
- Implement `mockLeads.ts` with 10-15 leads
- Implement `mockTrends.ts` with time-series data for monitoring

#### Task 4: Create Geolocation Hook
```typescript
// src/hooks/useGeolocation.ts
'use client';

import { useState, useEffect } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return location;
}
```

**Note**: This requires HTTPS in production and user permission.

#### Task 5: Create Constants & Utils
```typescript
// src/constants/colors.ts
export const MARKER_COLORS = {
  easy_target: '#10b981', // Green - easy to edge out
  similar: '#fbbf24',     // Yellow - similar level
  threat: '#ef4444',      // Red - strong competitor
  ai_agent: '#3b82f6',    // Blue - uses AI
  human: '#9ca3af'        // Gray - uses human
} as const;

export const SEARCH_RADIUS_MILES = 50;
export const MILES_TO_METERS = 1609.34; // For circle overlay

// src/lib/utils.ts (extend existing shadcn utils)
export function getCompetitorColor(business: Business, customerBusiness: CustomerBusiness) {
  // Logic to determine competitive positioning color
  // Consider: pricing, services offered, AI adoption, location
}

// Calculate distance between two coordinates in miles (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Filter competitors within radius
export function filterByRadius(
  competitors: Business[],
  centerLat: number,
  centerLng: number,
  radiusMiles: number
): Business[] {
  return competitors.filter((business) => {
    const distance = calculateDistance(
      centerLat,
      centerLng,
      business.location.lat,
      business.location.lng
    );
    return distance <= radiusMiles;
  });
}
```

---

### Phase 2: Shared Components (Tasks 6-9)

#### Task 6: Create Navigation Components
- `Navbar.tsx` - Top navigation with logo, user menu, notifications
- `Sidebar.tsx` - Side navigation for dashboard sections
- Both should adapt based on dashboard type (customer vs. CRM)

#### Task 7: Create Loading & Error States
- `LoadingSpinner.tsx` - Consistent loading animation
- `ErrorBoundary.tsx` - Graceful error handling
- `EmptyState.tsx` - When no data available

#### Task 8: Create Shadcn UI Extensions
Customize shadcn components with Tremor-compatible styling:
- Ensure cards have proper spacing
- Match color schemes from Tremor
- Add custom variants as needed

#### Task 9: Create Custom Hooks
```typescript
// src/hooks/useBusinesses.ts
export function useBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>(mockCompetitors);
  const [isLoading, setIsLoading] = useState(false);

  // In future, replace with API call

  return { businesses, isLoading, refetch: () => {} };
}

// Similar for useAnalytics, useLeads, useMapControls
```

---

### Phase 3: Customer Dashboard - Map View (Tasks 10-14)

#### Task 10: Create Map View Page
```typescript
// src/app/dashboard/customer/map/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { mockCompetitors } from '@/data/mock/mockBusinesses';

// Dynamic import to avoid SSR issues with Leaflet
const MapView = dynamic(
  () => import('@/components/dashboard/customer/MapView').then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <p>Loading map...</p>
      </div>
    ),
  }
);

export default function CustomerMapPage() {
  return (
    <div className="h-screen w-full">
      <MapView competitors={mockCompetitors} />
    </div>
  );
}
```

**Note**: Dynamic import with `ssr: false` is crucial to avoid Leaflet's DOM dependency issues in Next.js.

#### Task 11: Implement MapView Component
```typescript
// src/components/dashboard/customer/MapView.tsx
'use client';

import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import { useState, useMemo } from 'react';
import { icon } from 'leaflet';
import { useGeolocation } from '@/hooks/useGeolocation';
import { filterByRadius } from '@/lib/utils';
import { SEARCH_RADIUS_MILES, MILES_TO_METERS } from '@/constants/colors';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { BusinessDetailModal } from './BusinessDetailModal';
import type { Business } from '@/types/business';

interface MapViewProps {
  competitors: Business[];
}

export function MapView({ competitors }: MapViewProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [filters, setFilters] = useState({});
  const geolocation = useGeolocation();

  // Use geolocation or fallback to default location
  const center = useMemo(() => {
    if (geolocation.latitude && geolocation.longitude) {
      return [geolocation.latitude, geolocation.longitude] as [number, number];
    }
    // Default to San Francisco if geolocation unavailable
    return [37.7749, -122.4194] as [number, number];
  }, [geolocation.latitude, geolocation.longitude]);

  // Filter competitors within 50-mile radius
  const nearbyCompetitors = useMemo(() => {
    return filterByRadius(competitors, center[0], center[1], SEARCH_RADIUS_MILES);
  }, [competitors, center]);

  // Custom marker icon for user location
  const userIcon = icon({
    iconUrl: '/marker-user.png', // Create this asset
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  if (geolocation.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Getting your location...</p>
      </div>
    );
  }

  if (geolocation.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-2">Location Error: {geolocation.error}</p>
          <p className="text-sm text-gray-600">Using default location (San Francisco)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={10}
        className="h-full w-full"
        zoomControl={true}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 50-mile radius circle */}
        <Circle
          center={center}
          radius={SEARCH_RADIUS_MILES * MILES_TO_METERS}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 2,
          }}
        />

        {/* User's current location marker */}
        <Marker position={center} icon={userIcon}>
          <Popup>
            <strong>Your Location</strong>
            <br />
            {geolocation.latitude?.toFixed(4)}, {geolocation.longitude?.toFixed(4)}
          </Popup>
        </Marker>

        {/* Competitor markers within radius */}
        {nearbyCompetitors.map((competitor) => (
          <Marker
            key={competitor.id}
            position={[competitor.location.lat, competitor.location.lng]}
            eventHandlers={{
              click: () => setSelectedBusiness(competitor),
            }}
          >
            <Popup>
              <strong>{competitor.name}</strong>
              <br />
              {competitor.location.address}
              <br />
              <button
                onClick={() => setSelectedBusiness(competitor)}
                className="text-blue-600 hover:underline mt-2"
              >
                View Details
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <MapControls onFilterChange={setFilters} />
      <MapLegend />

      {/* Show count of competitors found */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 z-[1000]">
        <p className="text-sm font-medium">
          {nearbyCompetitors.length} competitors within {SEARCH_RADIUS_MILES} miles
        </p>
      </div>

      {selectedBusiness && (
        <BusinessDetailModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  );
}
```

**Note**: Create `/public/marker-user.png` for the user location marker, or use Leaflet's default markers.

#### Task 12: Implement CompetitorMarker
Custom marker with color coding logic based on competitive positioning.

#### Task 13: Implement BusinessDetailModal
Modal/overlay showing:
- Business name, address, contact
- Services offered with pricing comparison
- Availability status
- Competitive edge analysis (advantages, opportunities, threats)
- LLM recommendations

#### Task 14: Implement MapControls & MapLegend
- MapControls: Filters (AI detection, price range, service type), refresh button
- MapLegend: Color code explanation in corner of map

---

### Phase 4: Customer Dashboard - Analytics (Tasks 15-19)

#### Task 15: Create Analytics Page Layout
```typescript
// src/app/dashboard/customer/analytics/page.tsx
'use client';

import { AnalyticsDashboard } from '@/components/dashboard/customer/AnalyticsDashboard';
import { mockPricingAnalytics, mockRevenueOpportunities } from '@/data/mock/mockAnalytics';

export default function CustomerAnalyticsPage() {
  return <AnalyticsDashboard
    pricingAnalytics={mockPricingAnalytics}
    revenueOpportunities={mockRevenueOpportunities}
  />;
}
```

#### Task 16: Implement Overview Metrics Section
Using Tremor's `Card`, `Grid`, `Metric`, `Text` components:
```typescript
import { Card, Grid, Metric, Text } from '@tremor/react';

<Grid numItemsMd={4} className="gap-4">
  <Card>
    <Text>Competitors Analyzed</Text>
    <Metric>23</Metric>
  </Card>
  <Card>
    <Text>Avg Price vs. Yours</Text>
    <Metric>+12%</Metric>
  </Card>
  {/* More metrics... */}
</Grid>
```

#### Task 17: Implement Pricing Intelligence Table
Use Tremor's `Table` or TanStack Table with:
- Service name
- Your price
- Area average/median
- Recommended price
- Potential revenue gain
- Action button (update pricing)

#### Task 18: Implement Revenue Opportunities Cards
Most important section! Display LLM-generated recommendations:
- Card for each opportunity
- Estimated revenue impact
- Confidence score
- Actionable steps
- Related competitors

#### Task 19: Implement Service Comparison Visualization
- What services you offer vs. competitors
- Gap analysis (services they have that you don't)
- Market coverage percentage

---

### Phase 5: Customer Dashboard - Monitoring (Tasks 20-23)

#### Task 20: Create Monitoring Page
```typescript
// src/app/dashboard/customer/monitoring/page.tsx
```

#### Task 21: Implement TrendChart Component
Use Tremor's `LineChart` or Recharts:
- Time-series pricing data per service
- Multiple lines for different services
- Toggle between services
- Date range selector

#### Task 22: Implement CompetitorTimeline
Timeline view of:
- New competitors entering market
- Competitors closing
- Major pricing changes
- Service additions/removals

#### Task 23: Implement PricingChangeAlerts
- Alert cards for significant market changes
- "Competitor X increased prices by 20%"
- "New salon opened within 2 miles"
- Actionable responses for each alert

---

### Phase 6: CRM Dashboard - Leads (Tasks 24-27)

#### Task 24: Create Leads Page Layout
```typescript
// src/app/dashboard/crm/leads/page.tsx
'use client';

import { LeadsTable } from '@/components/dashboard/crm/LeadsTable';
import { mockLeads } from '@/data/mock/mockLeads';

export default function CRMLeadsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Lead Pipeline</h1>
      <LeadsTable leads={mockLeads} />
    </div>
  );
}
```

#### Task 25: Implement LeadsTable with TanStack Table
```typescript
import { useReactTable, getCoreRowModel, createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Lead>();

const columns = [
  columnHelper.accessor('business.name', {
    header: 'Business Name',
    cell: info => info.getValue()
  }),
  columnHelper.accessor('aiDetection.isAI', {
    header: 'Type',
    cell: info => (
      <Badge variant={info.getValue() ? 'blue' : 'gray'}>
        {info.getValue() ? 'AI' : 'Human'}
      </Badge>
    )
  }),
  columnHelper.accessor('leadScore', {
    header: 'Lead Score',
    cell: info => <LeadScoreCard score={info.getValue()} />
  }),
  // More columns...
];
```

Features:
- Sorting by all columns
- Filtering (AI/Human, status, score range)
- Pagination
- Row actions (view details, send email, add note)
- Click row → Open detail panel

#### Task 26: Implement LeadDetailPanel
Side panel or modal showing:
- Full business details
- Call transcripts (if available)
- Outreach history
- Notes timeline
- Quick actions (schedule follow-up, send email, update status)

#### Task 27: Implement LeadScoreCard
Visual indicator of lead quality (0-100):
- Color-coded progress bar or radial chart
- Factors contributing to score
- Conversion probability

---

### Phase 7: CRM Dashboard - AI Analysis (Tasks 28-30)

#### Task 28: Create AI Analysis Page
```typescript
// src/app/dashboard/crm/ai-analysis/page.tsx
```

#### Task 29: Implement TranscriptViewer
- Pull from mock call transcripts
- Syntax highlighting for key phrases
- Sentiment analysis visualization
- Issue markers (flagged problems in AI responses)

#### Task 30: Implement AIAgentList & IssueAnalyzer
- List of competitors using AI
- Detected AI provider (if possible)
- Issues found in their AI
- Side-by-side comparison with Beam Bell AI
- Generate sales talking points

---

### Phase 8: CRM Dashboard - Outreach (Tasks 31-33)

#### Task 31: Create Outreach Page
```typescript
// src/app/dashboard/crm/outreach/page.tsx
```

#### Task 32: Implement EmailTemplates Component
- Pre-built templates for different scenarios:
  - Human receptionist outreach
  - AI competitor with issues identified
  - Follow-up sequences
- Template variables (business name, issues found, etc.)
- Preview functionality

#### Task 33: Implement CampaignTracker & ConversionFunnel
- Campaign performance metrics (open rate, response rate)
- Funnel visualization: Leads → Contacted → Responded → Meeting → Converted
- Tremor's `BarChart` or `DonutChart` for visualization

---

### Phase 9: Layouts & Navigation (Tasks 34-36)

#### Task 34: Implement Customer Dashboard Layout
```typescript
// src/app/dashboard/customer/layout.tsx
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

export default function CustomerLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar type="customer" />
      <div className="flex-1 flex flex-col">
        <Navbar type="customer" />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### Task 35: Implement CRM Dashboard Layout
Similar to customer layout but with CRM-specific navigation.

#### Task 36: Update Root Page
Create landing page with:
- Login/authentication (mock for now)
- Role selection (Customer vs. Internal CRM access)
- Redirect to appropriate dashboard

---

### Phase 10: Polish & Responsive Design (Tasks 37-40)

#### Task 37: Ensure Mobile Responsiveness
- Test all pages on mobile viewport
- Adjust Tremor grid layouts (`numItemsSm`, `numItemsMd`, `numItemsLg`)
- Responsive navigation (mobile menu)

#### Task 38: Add Loading States
- Skeleton screens using Tremor or shadcn
- Suspense boundaries in Next.js pages
- Loading spinners for async actions

#### Task 39: Add Error Handling
- Error boundaries for each major section
- Toast notifications for user actions
- Retry mechanisms for failed data loads

#### Task 40: Final Testing & Documentation
- Test all user flows
- Verify mock data displays correctly
- Add comments to complex components
- Create component usage documentation

---

## Validation Gates

### During Development
```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build test (ensure no build errors)
npm run build
```

### Before Completion
```bash
# Full build with Turbopack
npm run build

# Start production server
npm run start

# Manual testing checklist:
# 1. Customer Map View loads and displays all markers
# 2. Clicking markers shows business detail modal
# 3. Analytics page shows pricing and opportunities
# 4. Monitoring page shows trend charts
# 5. CRM Leads table loads with sorting/filtering
# 6. CRM AI Analysis shows transcripts
# 7. Navigation works between all pages
# 8. Mobile responsive on 375px, 768px, 1024px viewports
# 9. Dark mode works correctly
# 10. No console errors in browser
```

### Code Quality Checks
```bash
# No unused imports
# No console.logs in production code
# All components have proper TypeScript types
# Mock data has variety (15+ businesses, different statuses)
```

---

## Common Pitfalls & Solutions

### 1. Leaflet SSR Issues with Next.js
**Problem**: `window is not defined` or `document is not defined` errors
**Solution**:
- Always use dynamic import with `ssr: false` for MapView component
- Add `'use client'` directive to all components using Leaflet
- Import Leaflet CSS in `layout.tsx`, not in components
- Use `leaflet-defaulticon-compatibility` to fix marker icon issues

### 2. Geolocation Permission Denied
**Problem**: User denies location access or browser doesn't support it
**Solution**:
- Implement fallback to default location (see MapView implementation)
- Show clear error message explaining why location is needed
- Provide manual location entry as alternative
- Requires HTTPS in production (HTTP only works on localhost)

### 3. Tailwind CSS v4 Differences
**Problem**: Styles not applying as expected
**Solution**:
- Tailwind v4 uses CSS-first configuration
- Check `globals.css` for `@theme inline` directive
- Use CSS variables defined in `:root`

### 4. Next.js 15 App Router
**Problem**: Client-side code running on server
**Solution**:
- Add `'use client'` directive to components using:
  - useState, useEffect, browser APIs (including geolocation)
  - Event handlers (onClick, onChange)
  - Third-party libraries like react-leaflet

### 5. Tremor + Shadcn Conflicts
**Problem**: Style conflicts between libraries
**Solution**:
- Import Tremor components with their full path
- Use shadcn for form elements, Tremor for charts/metrics
- Keep consistent spacing (use Tailwind spacing scale)

### 6. Mock Data Scale
**Problem**: Mock data too simple, doesn't showcase features
**Solution**:
- Create 15-20 diverse competitors
- Vary data quality, services, pricing
- Include edge cases (missing data, incomplete profiles)

---

## External Resources

### Documentation
- **Next.js 15**: https://nextjs.org/docs
- **React 19**: https://react.dev/
- **React Leaflet**: https://react-leaflet.js.org/
- **Leaflet**: https://leafletjs.com/
- **OpenStreetMap Tile Usage Policy**: https://operations.osmfoundation.org/policies/tiles/
- **Geolocation API**: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- **Tremor**: https://www.tremor.so/docs/getting-started/installation
- **TanStack Table**: https://tanstack.com/table/latest/docs/introduction
- **shadcn/ui**: https://ui.shadcn.com/docs/installation/next
- **Tailwind CSS v4**: https://tailwindcss.com/docs

### Example Implementations
- **Dashboard Example**: https://github.com/tremor-labs/tremor-dashboard-starter
- **TanStack Table with Next.js**: https://tanstack.com/table/latest/docs/framework/react/examples/basic
- **Leaflet Quick Start**: https://leafletjs.com/examples/quick-start/
- **React Leaflet + Next.js Guide**: https://react-leaflet.js.org/docs/start-introduction/

### Best Practices Articles
- **Next.js 15 Best Practices (2025)**: https://strapi.io/blog/react-and-nextjs-in-2025-modern-best-practices
- **React Dashboard Design Patterns**: https://www.luzmo.com/blog/react-dashboard
- **React Leaflet with Next.js (2025)**: Based on web search, works with Next.js 15.1.3+

---

## Success Criteria

### Functionality
- ✅ All 6 main screens render without errors
- ✅ Mock data displays correctly in all contexts
- ✅ Interactive features work (map clicks, filters, sorting)
- ✅ Navigation between pages is smooth
- ✅ Color coding logic accurately reflects competitive positioning

### Design
- ✅ Consistent visual language across both dashboards
- ✅ Responsive on mobile, tablet, desktop
- ✅ Accessible (keyboard navigation, ARIA labels)
- ✅ Professional appearance suitable for demo

### Code Quality
- ✅ TypeScript strict mode with no errors
- ✅ Components are modular and reusable
- ✅ Proper separation of concerns (types, data, components)
- ✅ No console warnings or errors
- ✅ Build completes successfully

### Demo Readiness
- ✅ Impressive visual impact on first load
- ✅ Data looks realistic and comprehensive
- ✅ Key differentiators are obvious (LLM recommendations, competitive edge analysis)
- ✅ Both dashboards showcase different value propositions

---

## PRP Confidence Score: **9.0/10**

### Strengths
- ✅ Comprehensive research with specific library recommendations
- ✅ Detailed mock data structures covering all requirements
- ✅ Clear implementation blueprint broken into 40 manageable tasks
- ✅ Existing Next.js setup reduces configuration complexity
- ✅ Strong documentation references for all libraries
- ✅ Validation gates are clear and executable
- ✅ **No API keys needed** - OpenStreetMap is completely free
- ✅ **User geolocation** automatically detects actual location
- ✅ **50-mile radius** clearly visualized with circle overlay

### Risk Factors
- ⚠️ Leaflet SSR issues in Next.js (mitigated with dynamic import + ssr: false)
- ⚠️ User may deny geolocation (mitigated with fallback location)
- ⚠️ Tremor + shadcn styling conflicts need careful handling
- ⚠️ Competitive positioning color logic requires thoughtful implementation
- ⚠️ Mock data creation is time-consuming but necessary for demo quality

### Mitigation Strategy
- Always use dynamic import for MapView component (example provided)
- Implement geolocation fallback to default location (example provided)
- Add Leaflet CSS in layout.tsx (instructions in Task 1)
- Use `leaflet-defaulticon-compatibility` to fix marker icons
- Start with Phase 1-2 to validate tech stack integration
- Create utility functions for color logic and distance calculations early
- Use provided documentation links liberally
- Test frequently during development
- Prioritize customer dashboard (higher demo value) if time is constrained

**Estimated Implementation Time**: 12-16 hours for experienced developer with Claude Code assistance.

### Why Score Increased to 9.0/10
- Removed complexity of Google Maps API key management
- No usage limits or billing concerns with OpenStreetMap
- Added real user location detection (more impressive for demo)
- 50-mile radius visualization adds professional polish
- Leaflet is well-documented and widely used with Next.js

---

## Quick Start Commands

```bash
# Navigate to frontend
cd frontend

# Install all dependencies
npm install react-leaflet leaflet leaflet-defaulticon-compatibility
npm install -D @types/leaflet
npm install @tremor/react @tanstack/react-table date-fns clsx tailwind-merge

# Initialize shadcn/ui
npx shadcn@latest init

# Install shadcn components
npx shadcn@latest add button card dialog table badge tabs select input label

# No API keys needed - OpenStreetMap is free!
# Just add Leaflet CSS imports to src/app/layout.tsx (see Task 1)

# Start development server
npm run dev

# Open browser to http://localhost:3000
# Allow location access when prompted to see your actual location on map
```

---

## Implementation Order Priority

If time-constrained, implement in this order for maximum demo impact:

1. **Phase 1**: Setup (critical foundation)
2. **Phase 3**: Customer Map View (highest visual impact)
3. **Phase 4**: Customer Analytics (core value prop - LLM recommendations)
4. **Phase 2**: Shared components (enables other features)
5. **Phase 6**: CRM Leads (demonstrates dual-purpose platform)
6. **Phase 5**: Customer Monitoring (nice-to-have)
7. **Phase 7-8**: CRM AI Analysis & Outreach (can be simplified)
8. **Phase 9-10**: Polish & responsive design (iterate continuously)

This PRP provides everything needed for a one-pass implementation with high success probability. The agent should have complete context for autonomous execution while maintaining flexibility for iteration and refinement.
