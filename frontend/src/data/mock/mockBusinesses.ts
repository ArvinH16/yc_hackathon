import type { SimplifiedBusiness, BusinessType } from '@/types/business';
import type { CustomerBusiness } from '@/types/user';
import rawMockBusiness from './mockBusiness.json';

// NOTE: Make sure your '@/types/business' BusinessType is:
// export type BusinessType = 'salon' | 'medspa' | 'barber' | 'spa' | 'hair' | 'nails';
// If not, update it accordingly to fix type errors for 'hair' and 'nails'.

// Helper: map free-form industry string to our BusinessType
function mapIndustryToType(industry?: string): BusinessType {
  const s = (industry || '').toLowerCase();
  if (s.includes('med') || s.includes('aesthetic') || s.includes('inject')) return 'medspa';
  if (s.includes('barber')) return 'barber';
  if (s.includes('spa')) return 'spa';
  if (s.includes('salon')) return 'salon';
  if (s.includes('hair')) return 'hair';
  if (s.includes('nail')) return 'nails';
  return 'salon';
}

// Helper: parse a price string like "$65-$95" or "$150" into a number (average if range)
function parsePriceToNumber(input?: string): number | undefined {
  if (!input) return undefined;
  const cleaned = input.replace(/\$/g, '').trim();
  const parts = cleaned.split(/\s*-\s*|–|—/).map((p) => parseFloat(p.replace(/[^0-9.]/g, ''))).filter((n) => !Number.isNaN(n));
  if (parts.length === 0) return undefined;
  if (parts.length === 1) return parts[0];
  return Math.round(((parts[0] + parts[1]) / 2) * 100) / 100;
}

// Helper: map provided JSON price keys to service display names used in our UI
const priceKeyToServiceName: Record<string, string> = {
  womens_haircut: "Women's haircut and styling",
  mens_haircut: "Men's haircut and grooming",
  full_color: 'Hair coloring and highlights',
  highlights: 'Hair coloring and highlights',
  balayage: 'Balayage and ombre',
  keratin_treatment: 'Keratin treatments',
  hair_extensions: 'Hair extensions',
  blowout: 'Blowouts and styling',
  bridal_styling: 'Bridal and special event styling',
  conditioning_treatment: 'Deep conditioning treatments',
};

// Build a CustomerBusiness from JSON with safe fallbacks to existing mock if needed
function buildCustomerFromJson(): CustomerBusiness | null {
  try {
    const j = rawMockBusiness as Record<string, unknown>;
    if (!j || typeof j !== 'object') return null;

    // Compose prices mapped to our service display names
    const prices: Record<string, number> = {};
    if (j.prices && typeof j.prices === 'object') {
      for (const [key, val] of Object.entries(j.prices as Record<string, string>)) {
        const serviceName = priceKeyToServiceName[key] || key.replace(/_/g, ' ');
        const num = parsePriceToNumber(val);
        if (num !== undefined) prices[serviceName] = num;
      }
    }

    const services: string[] = Array.isArray(j.services) && (j.services as string[]).length > 0
      ? (j.services as string[])
      : Object.keys(prices);

    const cb: CustomerBusiness = {
      businessName: (j.businessName as string) || 'Your Salon Name',
      phone: (j.phone as string) || '(415) 555-0200',
      email: (j.email as string) || undefined,
      industry: mapIndustryToType(j.industry as string),
      services,
      prices: prices,
      // Fallbacks for fields not present in provided JSON
      subscriptionPlan: 'pro',
      subscriptionStatus: 'active',
      searchRadius: 10,
      autoRefreshEnabled: true,
      refreshFrequency: 'weekly',
    };
    return cb;
  } catch {
    return null;
  }
}

export const mockCompetitors: SimplifiedBusiness[] = [
  {
    businessName: 'CODE Salon',
    phone: '(347) 925-8225',
    industry: 'hair',
    services: ['Haircut', 'Color', 'Extensions'],
    prices: {}
  },
  {
    businessName: 'Patrick Evan Hair Salon',
    phone: '(415) 421-1111',
    industry: 'hair',
    services: ['Haircut', 'Color', 'Japanese Straightening'],
    prices: {}
  },
  {
    businessName: 'Hector Estrada',
    phone: '(415) 955-7028',
    industry: 'hair',
    services: ['Haircut', 'Color', 'Styling'],
    prices: {}
  },
  {
    businessName: 'Arthur Sebastian Hair Salon',
    phone: '(415) 501-0338',
    industry: 'hair',
    services: ['Haircut', 'Color', 'Brazilian Blowout'],
    prices: {}
  },
  {
    businessName: 'Taylor Monroe',
    phone: '(855) 729-9705',
    industry: 'hair',
    services: ['Haircut', 'Balayage', 'Gray Blending'],
    prices: {}
  },
  {
    businessName: 'Hue Hair Salon',
    phone: '(415) 876-1608)',
    industry: 'hair',
    services: ['Haircut', 'Color', 'Japanese Hair Straightening'],
    prices: { "Women’s Haircut": 125, "Men’s Haircut": 65, "Japanese Hair Straightening": 350 }
  },
  {
    businessName: 'The Color Design Salon',
    phone: '(415) 984-1926',
    industry: 'hair',
    services: ['Haircut', 'Color', 'Styling'],
    prices: {}
  },
  {
    businessName: 'Blake Charles Salon',
    phone: '(415) 433-3030',
    industry: 'hair',
    services: ['Haircut', 'Color', 'Skincare'],
    prices: {}
  },
  {
    businessName: 'Spectrum Nails Spa (California St)',
    phone: '(415) 483-5028',
    industry: 'nails',
    services: ['Manicure', 'Pedicure', 'Gel Pedicure'],
    prices: { Manicure: 30, Pedicure: 40, "Gel Pedicure": 60 }
  },
  {
    businessName: 'Gentle Nails Salon',
    phone: '(415) 702-6559',
    industry: 'nails',
    services: ['Manicure', 'Pedicure', 'Gel Manicure'],
    prices: {}
  },
  {
    businessName: 'Pearly Nails',
    phone: '(415) 567-2866',
    industry: 'nails',
    services: ['Manicure', 'Pedicure', 'Gel Manicure'],
    prices: {}
  },
  {
    businessName: 'Q Spa (Divisadero)',
    phone: '(415) 885-1272',
    industry: 'nails',
    services: ['Basic Mani', 'Basic Pedi', 'Gel Mani'],
    prices: { "Basic Mani": 30, "Basic Pedi": 38, "Gel Mani": 50 }
  },
  {
    businessName: 'SF Nail Spa',
    phone: '(415) 564-5581',
    industry: 'nails',
    services: ['Manicure', 'Pedicure', 'Gel Manicure'],
    prices: {}
  },
  {
    businessName: 'Aquatica Nails',
    phone: '(415) 422-0448',
    industry: 'nails',
    services: ['Manicure', 'Pedicure', 'Gel X'],
    prices: {}
  },
  {
    businessName: 'Glitz N Glam Nail & Lash Spa',
    phone: '(415) 702-6485',
    industry: 'nails',
    services: ['Manicure', 'Pedicure', 'Lash Extensions'],
    prices: {}
  },
  {
    businessName: 'Pearl Spa & Sauna (Japantown)',
    phone: '(415) 580-7142',
    industry: 'spa',
    services: ['Korean Spa', 'Sauna', 'Body Scrub'],
    prices: {}
  },
  {
    businessName: 'Kabuki Springs & Spa',
    phone: '(415) 922-6000)',
    industry: 'spa',
    services: ['Communal Bath', 'Massage', 'Body Treatments'],
    prices: { "Communal Bath": 49 }
  },
  {
    businessName: 'Redmint (Marina)',
    phone: '(415) 888-8693',
    industry: 'spa',
    services: ['Acupuncture', 'Herbal Medicine', 'Facials'],
    prices: {}
  },
  {
    businessName: 'Archimedes Banya',
    phone: '(415) 206-9000',
    industry: 'spa',
    services: ['Banya', 'Sauna', 'Body Treatments'],
    prices: {}
  },
  {
    businessName: 'SenSpa (Presidio)',
    phone: '(415) 441-1777',
    industry: 'spa',
    services: ['Massage', 'Facials', 'Infrared Sauna'],
    prices: {}
  },
  {
    businessName: 'Mysa Day Spa (West Portal)',
    phone: '(415) 742-5491',
    industry: 'spa',
    services: ['Massage', 'Facials', 'Waxing'],
    prices: {}
  }
];

// Existing fallback in case JSON is missing fields we need
const fallbackCustomerBusiness: CustomerBusiness = {
  businessName: 'Your Salon Name',
  phone: '(415) 555-0200',
  industry: 'salon',
  services: ["Women's Haircut", 'Balayage'],
  prices: { "Women's Haircut": 75, Balayage: 200 },
  subscriptionPlan: 'pro',
  subscriptionStatus: 'active',
  searchRadius: 10,
  autoRefreshEnabled: true,
  refreshFrequency: 'weekly',
};

export const mockCustomerBusiness: CustomerBusiness = buildCustomerFromJson() || fallbackCustomerBusiness;
