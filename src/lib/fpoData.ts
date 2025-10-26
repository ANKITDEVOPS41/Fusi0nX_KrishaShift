export interface FPOReview {
  farmer: string;
  rating: number;
  text: string;
}

export interface FPO {
  id: number;
  name: string;
  district: string;
  crops: string[];
  rating: number;
  distance: number;
  services: string[];
  phone: string;
  members: number;
  reviews: FPOReview[];
  established?: number;
  turnover?: string;
}

export const fpos: FPO[] = [
  {
    id: 1,
    name: 'Indore Soybean Growers FPO',
    district: 'Indore',
    crops: ['soybean'],
    rating: 4.8,
    distance: 8,
    services: [
      'Assured procurement at MSP+₹50',
      'Payment within 5 days',
      'Free soil testing',
      'Input supply at discount',
    ],
    phone: '9876543210',
    members: 250,
    established: 2018,
    turnover: '₹2.5 Cr',
    reviews: [
      {
        farmer: 'Ramesh Kumar',
        rating: 5,
        text: 'Got ₹4,950/quintal when mandi was ₹4,700. Very satisfied! Payment received in just 4 days.',
      },
      {
        farmer: 'Suresh Patel',
        rating: 5,
        text: 'Payment in 4 days via bank transfer. Highly recommend! They also provide quality inputs.',
      },
      {
        farmer: 'Vijay Singh',
        rating: 4,
        text: 'Good service overall. Fair pricing and transparent transactions.',
      },
    ],
  },
  {
    id: 2,
    name: 'Rajkot Groundnut Producer Co-op',
    district: 'Rajkot',
    crops: ['groundnut'],
    rating: 4.5,
    distance: 12,
    services: [
      'MSP guaranteed procurement',
      'Input supply at 20% discount',
      'Free warehouse storage for 30 days',
      'Quality certification',
    ],
    phone: '9876543211',
    members: 180,
    established: 2016,
    turnover: '₹1.8 Cr',
    reviews: [
      {
        farmer: 'Dinesh Patel',
        rating: 5,
        text: 'Excellent cooperative! They helped me get better prices and provided quality seeds.',
      },
      {
        farmer: 'Mahesh Joshi',
        rating: 4,
        text: 'Reliable and trustworthy. The storage facility is very helpful during harvest season.',
      },
    ],
  },
  {
    id: 3,
    name: 'Jaipur Mustard Farmers Association',
    district: 'Jaipur',
    crops: ['mustard'],
    rating: 4.6,
    distance: 15,
    services: [
      'Procurement at ₹5,550/quintal',
      'Direct payment in 7 days',
      'Free transportation within 20km',
      'Crop advisory services',
    ],
    phone: '9876543212',
    members: 320,
    established: 2015,
    turnover: '₹3.2 Cr',
    reviews: [
      {
        farmer: 'Rakesh Sharma',
        rating: 5,
        text: 'Much better than selling in the mandi. Fair prices and no middlemen!',
      },
      {
        farmer: 'Mohan Lal',
        rating: 4,
        text: 'Good organization. They provide helpful farming tips and market updates.',
      },
    ],
  },
  {
    id: 4,
    name: 'Dewas Multi-Crop FPO',
    district: 'Indore',
    crops: ['soybean', 'mustard', 'groundnut'],
    rating: 4.7,
    distance: 18,
    services: [
      'Multi-crop procurement',
      'Input supply chain',
      'Modern storage facilities',
      'Market linkage support',
    ],
    phone: '9876543213',
    members: 410,
    established: 2017,
    turnover: '₹4.5 Cr',
    reviews: [
      {
        farmer: 'Ashok Kumar',
        rating: 5,
        text: 'They handle multiple crops which is very convenient. Professional management.',
      },
    ],
  },
  {
    id: 5,
    name: 'Gujarat Oilseed Growers Union',
    district: 'Rajkot',
    crops: ['groundnut', 'sunflower'],
    rating: 4.4,
    distance: 22,
    services: [
      'Assured procurement',
      'Mini oil mill access',
      'Value addition support',
      'Export opportunities',
    ],
    phone: '9876543214',
    members: 520,
    established: 2014,
    turnover: '₹6.8 Cr',
    reviews: [
      {
        farmer: 'Prakash Patel',
        rating: 4,
        text: 'Large organization with good market connections. Helped me get premium prices.',
      },
    ],
  },
];

export function filterFPOs(district?: string, crop?: string): FPO[] {
  return fpos.filter((fpo) => {
    const districtMatch = !district || fpo.district.toLowerCase() === district.toLowerCase();
    const cropMatch = !crop || fpo.crops.includes(crop.toLowerCase());
    return districtMatch && cropMatch;
  });
}

export function getFPOById(id: number): FPO | undefined {
  return fpos.find((fpo) => fpo.id === id);
}
