import type { CompanyProfile } from "@/types/company";

export const customerProfile: CompanyProfile = {
  businessId: 'customer-1',
  tagline: 'Modern color and cut specialists in SoMa',
  description:
    'Full-service salon focusing on balayage, precision cuts, and healthy hair treatments. We believe in accessible luxury and personalized care.',
  specialties: ['Balayage', "Women's Cuts", 'Keratin Treatments', 'Color Correction'],
  categories: ['Salon', 'Hair Color', 'Treatments'],
  foundedYear: 2018,
  employees: 12,
  hours: [
    { day: 'Mon', open: '10:00', close: '18:00' },
    { day: 'Tue', open: '10:00', close: '18:00' },
    { day: 'Wed', open: '10:00', close: '20:00' },
    { day: 'Thu', open: '10:00', close: '20:00' },
    { day: 'Fri', open: '10:00', close: '18:00' },
    { day: 'Sat', open: '9:00', close: '17:00' },
    { day: 'Sun', open: 'Closed', close: 'Closed' },
  ],
  serviceAreas: ['SoMa', 'Mission', 'Downtown SF'],
  social: {
    website: 'https://yoursalon.com',
    instagram: 'https://instagram.com/yoursalon',
  },
  notes: [
    'Seasonal promos around holidays perform well',
    'Strong repeat clientele on Thursday evenings',
  ],
  defaultConfigId: 'default-ci',
};

// Example competitor profile entries (optional usage)
export const competitorProfiles: CompanyProfile[] = [
  {
    businessId: 'comp-10',
    tagline: 'Marina district glow-ups',
    description: 'Premium salon experience with blowouts and color refresh packages.',
    specialties: ['Blowouts', 'Color Refresh'],
    categories: ['Salon'],
  },
  {
    businessId: 'comp-8',
    tagline: 'Refined medical aesthetics',
    description: 'Boutique medspa specializing in injectables and fillers.',
    specialties: ['Botox', 'Filler'],
    categories: ['Medspa'],
  },
];

