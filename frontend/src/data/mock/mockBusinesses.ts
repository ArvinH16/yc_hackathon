import type { SimplifiedBusiness, BusinessType } from '@/types/business';
import type { CustomerBusiness } from '@/types/user';
import rawMockBusiness from './mockBusiness.json';

// Helper: map free-form industry string to our BusinessType
function mapIndustryToType(industry?: string): BusinessType {
  const s = (industry || '').toLowerCase();
  if (s.includes('med') || s.includes('aesthetic') || s.includes('inject')) return 'medspa';
  if (s.includes('barber')) return 'barber';
  if (s.includes('spa')) return 'spa';
  if (s.includes('salon') || s.includes('hair')) return 'salon';
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
    const j: any = rawMockBusiness as any;
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

    const services: string[] = Array.isArray(j.services) && j.services.length > 0
      ? j.services
      : Object.keys(prices);

    const cb: CustomerBusiness = {
      businessName: j.businessName || 'Your Salon Name',
      phone: j.phone || '(415) 555-0200',
      email: j.email || undefined,
      industry: mapIndustryToType(j.industry),
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
    businessName: 'Luxe Hair Studio',
    phone: '(415) 555-0101',
    email: 'info@luxehairstudio.com',
    industry: 'salon',
    services: ["Women's Haircut", 'Balayage', 'Keratin Treatment'],
    prices: { "Women's Haircut": 85, Balayage: 250, 'Keratin Treatment': 350 },
  },
  {
    businessName: 'Mission Cuts',
    phone: '(415) 555-0102',
    industry: 'barber',
    services: ["Men's Haircut", 'Beard Trim'],
    prices: { "Men's Haircut": 45, 'Beard Trim': 20 },
  },
  {
    businessName: 'SoMa Spa & Wellness',
    phone: '(415) 555-0103',
    industry: 'spa',
    services: ['Swedish Massage', 'Deep Tissue'],
    prices: { 'Swedish Massage': 120, 'Deep Tissue': 140 },
  },
  {
    businessName: 'Bay Beauty MedSpa',
    phone: '(415) 555-0104',
    industry: 'medspa',
    services: ['Botox', 'HydraFacial'],
    prices: { Botox: 300, HydraFacial: 220 },
  },
  {
    businessName: 'Sunset Styles',
    phone: '(415) 555-0105',
    industry: 'salon',
    services: ["Women's Haircut", 'Balayage'],
    prices: { "Women's Haircut": 70, Balayage: 210 },
  },
  {
    businessName: 'Nob Hill Nails & Spa',
    phone: '(415) 555-0106',
    industry: 'spa',
    services: ['Manicure', 'Pedicure'],
    prices: { Manicure: 28, Pedicure: 40 },
  },
  {
    businessName: 'Castro Cuts',
    phone: '(415) 555-0107',
    industry: 'barber',
    services: ["Men's Haircut", 'Beard Trim'],
    prices: { "Men's Haircut": 50, 'Beard Trim': 22 },
  },
  {
    businessName: 'Pacific Heights Aesthetics',
    phone: '(415) 555-0108',
    industry: 'medspa',
    services: ['Botox', 'Filler'],
    prices: { Botox: 320, Filler: 550 },
  },
  {
    businessName: 'Tenderloin Thai Massage',
    phone: '(415) 555-0109',
    industry: 'spa',
    services: ['Thai Massage', 'Foot Reflexology'],
    prices: { 'Thai Massage': 110, 'Foot Reflexology': 60 },
  },
  {
    businessName: 'Marina Glow Salon',
    phone: '(415) 555-0110',
    industry: 'salon',
    services: ["Women's Haircut", 'Color Refresh'],
    prices: { "Women's Haircut": 88, 'Color Refresh': 160 },
  },
  {
    businessName: 'Downtown Barber Co.',
    phone: '(415) 555-0111',
    industry: 'barber',
    services: ["Men's Haircut", 'Shave'],
    prices: { "Men's Haircut": 55, Shave: 35 },
  },
  {
    businessName: 'Mission Med Aesthetics',
    phone: '(415) 555-0112',
    industry: 'medspa',
    services: ['HydraFacial', 'Microneedling'],
    prices: { HydraFacial: 230, Microneedling: 300 },
  },
  {
    businessName: 'Ocean Avenue Salon',
    phone: '(415) 555-0113',
    industry: 'salon',
    services: ["Women's Haircut", 'Blowout'],
    prices: { "Women's Haircut": 65, Blowout: 55 },
  },
  {
    businessName: 'Hayes Valley Spa',
    phone: '(415) 555-0114',
    industry: 'spa',
    services: ['Swedish Massage', 'Facial'],
    prices: { 'Swedish Massage': 125, Facial: 120 },
  },
  {
    businessName: 'Richmond Relax Spa',
    phone: '(415) 555-0115',
    industry: 'spa',
    services: ['Deep Tissue', 'Hot Stone'],
    prices: { 'Deep Tissue': 145, 'Hot Stone': 160 },
  },
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
