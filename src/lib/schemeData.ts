export interface Scheme {
  id: number;
  name: string;
  benefit: string;
  maxAmount: string | number;
  eligibility: string[];
  category: 'subsidy' | 'insurance' | 'equipment' | 'training';
  applyLink?: string;
}

export const schemes: Scheme[] = [
  {
    id: 1,
    name: 'Seed Distribution Subsidy',
    benefit: '50% subsidy on certified oilseed seeds',
    maxAmount: 5000,
    eligibility: [
      '2+ acres land',
      'Small/Marginal farmer category',
      'Not availed in last 3 years',
    ],
    category: 'subsidy',
    applyLink: '#',
  },
  {
    id: 2,
    name: 'Mini Oil Mill Subsidy (FPO)',
    benefit: 'Financial support for community oil extraction unit',
    maxAmount: 999000,
    eligibility: [
      'Registered FPO',
      '100+ members',
      '50+ members cultivate oilseeds',
    ],
    category: 'equipment',
    applyLink: '#',
  },
  {
    id: 3,
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    benefit: 'Premium subsidy for oilseed crop insurance',
    maxAmount: 'Variable',
    eligibility: [
      'All farmers (loanee & non-loanee)',
      'Cultivating notified crops',
    ],
    category: 'insurance',
    applyLink: '#',
  },
  {
    id: 4,
    name: 'Soil Health Card Scheme',
    benefit: 'Free soil testing and health card',
    maxAmount: 'Free',
    eligibility: [
      'All farmers',
      'Valid land ownership/tenancy',
    ],
    category: 'subsidy',
    applyLink: '#',
  },
  {
    id: 5,
    name: 'Agricultural Mechanization Subsidy',
    benefit: '40-50% subsidy on farm equipment',
    maxAmount: 80000,
    eligibility: [
      'Small/Marginal farmers',
      'First-time buyers',
      'Registered with Agriculture Dept',
    ],
    category: 'equipment',
    applyLink: '#',
  },
  {
    id: 6,
    name: 'National Mission on Oilseeds & Oil Palm',
    benefit: 'Financial assistance for oilseed cultivation',
    maxAmount: 15000,
    eligibility: [
      'Cultivating oilseed crops',
      '5+ acres dedicated to oilseeds',
    ],
    category: 'subsidy',
    applyLink: '#',
  },
];

export function checkEligibility(
  landSize: number,
  category: 'small' | 'marginal' | 'medium' | 'large'
): Scheme[] {
  return schemes.filter((scheme) => {
    if (scheme.eligibility.some((e) => e.includes('2+ acres')) && landSize < 2) {
      return false;
    }
    if (scheme.eligibility.some((e) => e.includes('5+ acres')) && landSize < 5) {
      return false;
    }
    if (
      scheme.eligibility.some((e) => e.includes('Small/Marginal')) &&
      !['small', 'marginal'].includes(category)
    ) {
      return false;
    }
    return true;
  });
}
