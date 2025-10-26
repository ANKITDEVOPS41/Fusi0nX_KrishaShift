import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FPO {
  id: string;
  name: string;
  registrationNumber: string;
  type: 'Producer Company' | 'Cooperative Society' | 'Self Help Group' | 'Farmer Club';
  status: 'active' | 'inactive' | 'suspended';
  establishedDate: Date;
  
  // Contact Information
  contact: {
    phone: string;
    email: string;
    website?: string;
    address: {
      street: string;
      village: string;
      block: string;
      district: string;
      state: string;
      pincode: string;
      coordinates: [number, number];
    };
  };
  
  // Leadership
  leadership: {
    ceo: string;
    chairman: string;
    secretary: string;
    treasurer: string;
  };
  
  // Membership
  membership: {
    totalMembers: number;
    activeFarmers: number;
    femaleMembers: number;
    smallFarmers: number; // <2 hectares
    marginalFarmers: number; // <1 hectare
    averageLandholding: number;
  };
  
  // Financial Information
  financial: {
    authorizedCapital: number;
    paidUpCapital: number;
    annualTurnover: number;
    profitLoss: number;
    creditRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'C' | 'D';
    bankAccount: {
      accountNumber: string;
      ifsc: string;
      bankName: string;
    };
  };
  
  // Services Offered
  services: {
    inputSupply: boolean;
    outputMarketing: boolean;
    creditFacilitation: boolean;
    technologySupport: boolean;
    trainingPrograms: boolean;
    insuranceServices: boolean;
    warehouseServices: boolean;
    transportServices: boolean;
    processingServices: boolean;
    certificationSupport: boolean;
  };
  
  // Crops and Commodities
  crops: {
    primary: string[];
    secondary: string[];
    organic: string[];
    certified: string[];
  };
  
  // Infrastructure
  infrastructure: {
    warehouses: {
      count: number;
      totalCapacity: number; // in MT
      coldStorage: boolean;
    };
    processingUnits: {
      count: number;
      types: string[];
      capacity: number; // in MT/day
    };
    equipment: {
      tractors: number;
      harvesters: number;
      seedDrills: number;
      sprayers: number;
      other: string[];
    };
  };
  
  // Performance Metrics
  performance: {
    rating: number; // 1-5 stars
    reviews: number;
    successRate: number; // percentage
    avgResponseTime: number; // in hours
    farmerSatisfaction: number; // percentage
    paymentReliability: number; // percentage
    qualityScore: number; // 1-100
  };
  
  // Government Schemes
  schemes: {
    participated: string[];
    benefitsReceived: {
      scheme: string;
      amount: number;
      year: number;
    }[];
    currentApplications: string[];
  };
  
  // Certifications
  certifications: {
    organic: boolean;
    fairtrade: boolean;
    globalgap: boolean;
    iso: string[];
    fssai: boolean;
    agmark: boolean;
  };
  
  // Recent Activities
  activities: {
    id: string;
    type: 'procurement' | 'payment' | 'training' | 'meeting' | 'scheme_application';
    description: string;
    date: Date;
    status: 'completed' | 'pending' | 'cancelled';
  }[];
  
  // Blockchain Records
  blockchain: {
    transactionHash: string;
    verified: boolean;
    lastAudit: Date;
  };
}

export interface FPOTransaction {
  id: string;
  fpoId: string;
  farmerId: string;
  type: 'procurement' | 'payment' | 'input_supply' | 'service';
  crop: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton';
  pricePerUnit: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: 'bank_transfer' | 'upi' | 'cash' | 'cheque';
  transactionDate: Date;
  deliveryDate?: Date;
  qualityGrade: string;
  moistureContent?: number;
  blockchainHash?: string;
  documents: {
    invoice: string;
    receipt: string;
    qualityCertificate?: string;
  };
}

interface FPOState {
  fpos: FPO[];
  transactions: FPOTransaction[];
  selectedFPO: FPO | null;
  nearbyFPOs: FPO[];
  favoritesFPOs: string[];
  searchQuery: string;
  filters: {
    state?: string;
    district?: string;
    crops?: string[];
    services?: string[];
    rating?: number;
    distance?: number;
  };
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFPOs: (fpos: FPO[]) => void;
  addFPO: (fpo: FPO) => void;
  updateFPO: (id: string, updates: Partial<FPO>) => void;
  setTransactions: (transactions: FPOTransaction[]) => void;
  addTransaction: (transaction: FPOTransaction) => void;
  updateTransaction: (id: string, updates: Partial<FPOTransaction>) => void;
  setSelectedFPO: (fpo: FPO | null) => void;
  setNearbyFPOs: (fpos: FPO[]) => void;
  addToFavorites: (fpoId: string) => void;
  removeFromFavorites: (fpoId: string) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<FPOState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed
  getFilteredFPOs: () => FPO[];
  getFPOsByDistance: (userLocation: [number, number], maxDistance: number) => FPO[];
  getFPOTransactions: (fpoId: string) => FPOTransaction[];
  getTopRatedFPOs: (limit?: number) => FPO[];
  getFPOStats: (fpoId: string) => {
    totalTransactions: number;
    totalVolume: number;
    totalValue: number;
    avgRating: number;
    activeMembers: number;
  };
}

export const useFPOStore = create<FPOState>()(
  persist(
    (set, get) => ({
      fpos: [],
      transactions: [],
      selectedFPO: null,
      nearbyFPOs: [],
      favoritesFPOs: [],
      searchQuery: '',
      filters: {},
      isLoading: false,
      error: null,

      setFPOs: (fpos) => set({ fpos, error: null }),

      addFPO: (fpo) => set((state) => ({
        fpos: [...state.fpos, fpo]
      })),

      updateFPO: (id, updates) => set((state) => ({
        fpos: state.fpos.map(fpo => 
          fpo.id === id ? { ...fpo, ...updates } : fpo
        )
      })),

      setTransactions: (transactions) => set({ transactions }),

      addTransaction: (transaction) => set((state) => ({
        transactions: [...state.transactions, transaction]
      })),

      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(transaction => 
          transaction.id === id ? { ...transaction, ...updates } : transaction
        )
      })),

      setSelectedFPO: (selectedFPO) => set({ selectedFPO }),

      setNearbyFPOs: (nearbyFPOs) => set({ nearbyFPOs }),

      addToFavorites: (fpoId) => set((state) => ({
        favoritesFPOs: [...state.favoritesFPOs, fpoId]
      })),

      removeFromFavorites: (fpoId) => set((state) => ({
        favoritesFPOs: state.favoritesFPOs.filter(id => id !== fpoId)
      })),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      getFilteredFPOs: () => {
        const { fpos, searchQuery, filters } = get();
        
        return fpos.filter(fpo => {
          // Search query filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesName = fpo.name.toLowerCase().includes(query);
            const matchesLocation = fpo.contact.address.district.toLowerCase().includes(query) ||
                                  fpo.contact.address.state.toLowerCase().includes(query);
            const matchesCrops = fpo.crops.primary.some(crop => 
              crop.toLowerCase().includes(query)
            );
            
            if (!matchesName && !matchesLocation && !matchesCrops) {
              return false;
            }
          }
          
          // State filter
          if (filters.state && fpo.contact.address.state !== filters.state) {
            return false;
          }
          
          // District filter
          if (filters.district && fpo.contact.address.district !== filters.district) {
            return false;
          }
          
          // Crops filter
          if (filters.crops && filters.crops.length > 0) {
            const hasMatchingCrop = filters.crops.some(crop => 
              fpo.crops.primary.includes(crop) || fpo.crops.secondary.includes(crop)
            );
            if (!hasMatchingCrop) return false;
          }
          
          // Services filter
          if (filters.services && filters.services.length > 0) {
            const hasMatchingService = filters.services.some(service => {
              return fpo.services[service as keyof typeof fpo.services];
            });
            if (!hasMatchingService) return false;
          }
          
          // Rating filter
          if (filters.rating && fpo.performance.rating < filters.rating) {
            return false;
          }
          
          return true;
        });
      },

      getFPOsByDistance: (userLocation, maxDistance) => {
        const { fpos } = get();
        
        return fpos
          .map(fpo => {
            const distance = calculateDistance(
              userLocation,
              fpo.contact.address.coordinates
            );
            return { ...fpo, distance };
          })
          .filter(fpo => fpo.distance <= maxDistance)
          .sort((a, b) => a.distance - b.distance);
      },

      getFPOTransactions: (fpoId) => {
        const { transactions } = get();
        return transactions.filter(transaction => transaction.fpoId === fpoId);
      },

      getTopRatedFPOs: (limit = 10) => {
        const { fpos } = get();
        return fpos
          .sort((a, b) => b.performance.rating - a.performance.rating)
          .slice(0, limit);
      },

      getFPOStats: (fpoId) => {
        const { transactions, fpos } = get();
        const fpo = fpos.find(f => f.id === fpoId);
        const fpoTransactions = transactions.filter(t => t.fpoId === fpoId);
        
        const totalTransactions = fpoTransactions.length;
        const totalVolume = fpoTransactions.reduce((sum, t) => sum + t.quantity, 0);
        const totalValue = fpoTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
        const avgRating = fpo?.performance.rating || 0;
        const activeMembers = fpo?.membership.activeFarmers || 0;
        
        return {
          totalTransactions,
          totalVolume,
          totalValue,
          avgRating,
          activeMembers
        };
      }
    }),
    {
      name: 'krishi-fpo-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favoritesFPOs: state.favoritesFPOs,
        filters: state.filters
      })
    }
  )
);

// Utility function to calculate distance between two coordinates
function calculateDistance(
  coord1: [number, number], 
  coord2: [number, number]
): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}