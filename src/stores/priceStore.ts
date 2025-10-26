import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface CropPrice {
  id: string;
  cropName: string;
  variety: string;
  mandiName: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: Date;
  unit: 'quintal' | 'kg' | 'ton';
  quality: 'FAQ' | 'Good' | 'Average' | 'Below Average';
  arrivals: number; // in quintals
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  coordinates: [number, number];
}

export interface PricePrediction {
  cropName: string;
  predictedPrices: {
    date: Date;
    price: number;
    confidence: number;
  }[];
  accuracy: number;
  factors: {
    weather: number;
    demand: number;
    supply: number;
    seasonal: number;
  };
}

export interface PriceAlert {
  id: string;
  cropName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  userId: string;
  createdAt: Date;
  triggeredAt?: Date;
}

interface PriceState {
  prices: CropPrice[];
  predictions: PricePrediction[];
  alerts: PriceAlert[];
  selectedCrop: string | null;
  selectedMandi: string | null;
  priceHistory: Record<string, CropPrice[]>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  realTimeConnection: boolean;
  
  // Actions
  setPrices: (prices: CropPrice[]) => void;
  addPrice: (price: CropPrice) => void;
  updatePrice: (id: string, updates: Partial<CropPrice>) => void;
  setPredictions: (predictions: PricePrediction[]) => void;
  setAlerts: (alerts: PriceAlert[]) => void;
  addAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  removeAlert: (id: string) => void;
  setSelectedCrop: (crop: string | null) => void;
  setSelectedMandi: (mandi: string | null) => void;
  setPriceHistory: (crop: string, history: CropPrice[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRealTimeConnection: (connected: boolean) => void;
  
  // Computed
  getFilteredPrices: (filters: {
    crop?: string;
    state?: string;
    district?: string;
    dateRange?: [Date, Date];
  }) => CropPrice[];
  
  getPriceStats: (cropName: string) => {
    average: number;
    min: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
    volatility: number;
  };
  
  getTopGainers: (limit?: number) => CropPrice[];
  getTopLosers: (limit?: number) => CropPrice[];
}

export const usePriceStore = create<PriceState>()(
  subscribeWithSelector((set, get) => ({
    prices: [],
    predictions: [],
    alerts: [],
    selectedCrop: null,
    selectedMandi: null,
    priceHistory: {},
    isLoading: false,
    error: null,
    lastUpdated: null,
    realTimeConnection: false,

    setPrices: (prices) => set({ 
      prices, 
      lastUpdated: new Date(),
      error: null 
    }),

    addPrice: (price) => set((state) => ({
      prices: [price, ...state.prices.filter(p => p.id !== price.id)],
      lastUpdated: new Date()
    })),

    updatePrice: (id, updates) => set((state) => ({
      prices: state.prices.map(price => 
        price.id === id ? { ...price, ...updates } : price
      ),
      lastUpdated: new Date()
    })),

    setPredictions: (predictions) => set({ predictions }),

    setAlerts: (alerts) => set({ alerts }),

    addAlert: (alertData) => {
      const alert: PriceAlert = {
        ...alertData,
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date()
      };
      set((state) => ({
        alerts: [...state.alerts, alert]
      }));
    },

    removeAlert: (id) => set((state) => ({
      alerts: state.alerts.filter(alert => alert.id !== id)
    })),

    setSelectedCrop: (selectedCrop) => set({ selectedCrop }),

    setSelectedMandi: (selectedMandi) => set({ selectedMandi }),

    setPriceHistory: (crop, history) => set((state) => ({
      priceHistory: {
        ...state.priceHistory,
        [crop]: history
      }
    })),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    setRealTimeConnection: (realTimeConnection) => set({ realTimeConnection }),

    getFilteredPrices: (filters) => {
      const { prices } = get();
      return prices.filter(price => {
        if (filters.crop && price.cropName !== filters.crop) return false;
        if (filters.state && price.state !== filters.state) return false;
        if (filters.district && price.district !== filters.district) return false;
        if (filters.dateRange) {
          const priceDate = new Date(price.date);
          if (priceDate < filters.dateRange[0] || priceDate > filters.dateRange[1]) {
            return false;
          }
        }
        return true;
      });
    },

    getPriceStats: (cropName) => {
      const { prices } = get();
      const cropPrices = prices.filter(p => p.cropName === cropName);
      
      if (cropPrices.length === 0) {
        return { average: 0, min: 0, max: 0, trend: 'stable' as const, volatility: 0 };
      }

      const modalPrices = cropPrices.map(p => p.modalPrice);
      const average = modalPrices.reduce((sum, price) => sum + price, 0) / modalPrices.length;
      const min = Math.min(...modalPrices);
      const max = Math.max(...modalPrices);
      
      // Calculate trend based on recent prices
      const recentPrices = cropPrices
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      
      const trend = recentPrices.length >= 2 
        ? recentPrices[0].modalPrice > recentPrices[recentPrices.length - 1].modalPrice 
          ? 'up' as const
          : recentPrices[0].modalPrice < recentPrices[recentPrices.length - 1].modalPrice
          ? 'down' as const
          : 'stable' as const
        : 'stable' as const;

      // Calculate volatility (standard deviation)
      const variance = modalPrices.reduce((sum, price) => sum + Math.pow(price - average, 2), 0) / modalPrices.length;
      const volatility = Math.sqrt(variance);

      return { average, min, max, trend, volatility };
    },

    getTopGainers: (limit = 10) => {
      const { prices } = get();
      return prices
        .filter(p => p.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, limit);
    },

    getTopLosers: (limit = 10) => {
      const { prices } = get();
      return prices
        .filter(p => p.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, limit);
    }
  }))
);