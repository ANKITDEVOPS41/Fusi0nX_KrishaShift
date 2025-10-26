export interface MandiPrice {
  price: number;
  msp: number;
  trend: number[];
}

export interface MandiData {
  [location: string]: MandiPrice;
}

export const mandiPrices: Record<string, MandiData> = {
  soybean: {
    indore: {
      price: 4850,
      msp: 4892,
      trend: [4700, 4750, 4800, 4820, 4840, 4850, 4850],
    },
    bhopal: {
      price: 4920,
      msp: 4892,
      trend: [4800, 4850, 4880, 4900, 4910, 4915, 4920],
    },
  },
  groundnut: {
    rajkot: {
      price: 6400,
      msp: 6377,
      trend: [6200, 6250, 6300, 6350, 6380, 6390, 6400],
    },
    junagadh: {
      price: 6350,
      msp: 6377,
      trend: [6100, 6200, 6250, 6300, 6320, 6340, 6350],
    },
  },
  mustard: {
    jaipur: {
      price: 5420,
      msp: 5650,
      trend: [5300, 5350, 5380, 5400, 5410, 5415, 5420],
    },
    alwar: {
      price: 5600,
      msp: 5650,
      trend: [5400, 5450, 5500, 5550, 5580, 5590, 5600],
    },
  },
  sunflower: {
    hyderabad: {
      price: 7120,
      msp: 7050,
      trend: [6900, 6950, 7000, 7050, 7080, 7100, 7120],
    },
    davangere: {
      price: 7080,
      msp: 7050,
      trend: [6850, 6900, 6950, 7000, 7030, 7060, 7080],
    },
  },
};

export function getPriceStatus(price: number, msp: number): {
  status: 'above' | 'below' | 'at';
  percentage: number;
  color: string;
} {
  const diff = price - msp;
  const percentage = Math.abs((diff / msp) * 100);

  if (diff > 0) {
    return { status: 'above', percentage: Math.round(percentage), color: 'success' };
  } else if (diff < 0) {
    return { status: 'below', percentage: Math.round(percentage), color: 'destructive' };
  } else {
    return { status: 'at', percentage: 0, color: 'muted' };
  }
}
