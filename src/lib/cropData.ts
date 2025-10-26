export interface CropData {
  yield: number; // quintals/acre
  msp: number; // ₹/quintal
  inputCosts: number; // ₹/acre
  water: number; // mm
  duration: string; // days
}

export const cropDatabase: Record<string, CropData> = {
  paddy: {
    yield: 25,
    msp: 2300,
    inputCosts: 22000,
    water: 1200,
    duration: '120-150',
  },
  sugarcane: {
    yield: 350,
    msp: 340,
    inputCosts: 45000,
    water: 1500,
    duration: '300-365',
  },
  maize: {
    yield: 20,
    msp: 2090,
    inputCosts: 18000,
    water: 600,
    duration: '90-110',
  },
  soybean: {
    yield: 12,
    msp: 4892,
    inputCosts: 15000,
    water: 450,
    duration: '90-110',
  },
  groundnut: {
    yield: 18,
    msp: 6377,
    inputCosts: 20000,
    water: 500,
    duration: '120-140',
  },
  mustard: {
    yield: 15,
    msp: 5650,
    inputCosts: 12000,
    water: 240,
    duration: '120-140',
  },
  sunflower: {
    yield: 14,
    msp: 7050,
    inputCosts: 16000,
    water: 400,
    duration: '90-120',
  },
};

export function calculateProfitability(crop: string, landSize: number) {
  const data = cropDatabase[crop];
  if (!data) return null;

  const revenue = data.yield * data.msp;
  const netProfit = revenue - data.inputCosts;
  const totalProfit = netProfit * landSize;

  return {
    crop,
    yield: data.yield,
    msp: data.msp,
    revenue,
    inputCosts: data.inputCosts,
    netProfit,
    totalProfit,
    water: data.water,
    duration: data.duration,
  };
}

export interface Recommendation {
  crop: string;
  profitIncrease: number;
  waterSaved: number;
  totalProfit: number;
  netProfit: number;
}

export function calculateRecommendation(
  currentCrop: string,
  compareCrops: string[],
  landSize: number
): Recommendation | null {
  const currentData = calculateProfitability(currentCrop, landSize);
  if (!currentData) return null;

  let best: Recommendation | null = null;
  let maxProfit = currentData.netProfit;

  compareCrops.forEach((crop) => {
    const data = calculateProfitability(crop, landSize);
    if (data && data.netProfit > maxProfit) {
      const profitIncrease = ((data.netProfit - currentData.netProfit) / currentData.netProfit) * 100;
      const waterSaved = currentData.water - data.water;

      best = {
        crop,
        profitIncrease: Math.round(profitIncrease),
        waterSaved: waterSaved > 0 ? waterSaved : 0,
        totalProfit: data.totalProfit,
        netProfit: data.netProfit,
      };
      maxProfit = data.netProfit;
    }
  });

  return best;
}
