import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'farmer' | 'fpo_manager' | 'extension_worker' | 'government_officer' | 'data_analyst' | 'admin' | 'super_admin' | 'system_auditor';
  aadhaar?: string;
  farmSize?: number;
  location?: {
    state: string;
    district: string;
    block: string;
    village: string;
    coordinates: [number, number];
  };
  bankAccount?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  kycStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  lastLogin: Date;
  preferences: {
    language: string;
    notifications: {
      priceAlerts: boolean;
      weatherAlerts: boolean;
      schemeUpdates: boolean;
      fpoNotifications: boolean;
    };
    theme: 'light' | 'dark' | 'system';
  };
  gamification: {
    points: number;
    badges: string[];
    level: number;
    achievements: string[];
  };
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  enableBiometric: () => void;
  enableTwoFactor: () => void;
  addPoints: (points: number) => void;
  addBadge: (badge: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,
      biometricEnabled: false,
      twoFactorEnabled: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),

      setProfile: (profile) => set({ profile }),

      setTokens: (accessToken, refreshToken) => set({ 
        accessToken, 
        refreshToken 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      logout: () => set({
        user: null,
        profile: null,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        error: null
      }),

      updateProfile: (updates) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({ 
            profile: { ...currentProfile, ...updates } 
          });
        }
      },

      enableBiometric: () => set({ biometricEnabled: true }),

      enableTwoFactor: () => set({ twoFactorEnabled: true }),

      addPoints: (points) => {
        const profile = get().profile;
        if (profile) {
          const newPoints = profile.gamification.points + points;
          const newLevel = Math.floor(newPoints / 1000) + 1;
          
          set({
            profile: {
              ...profile,
              gamification: {
                ...profile.gamification,
                points: newPoints,
                level: newLevel
              }
            }
          });
        }
      },

      addBadge: (badge) => {
        const profile = get().profile;
        if (profile && !profile.gamification.badges.includes(badge)) {
          set({
            profile: {
              ...profile,
              gamification: {
                ...profile.gamification,
                badges: [...profile.gamification.badges, badge]
              }
            }
          });
        }
      }
    }),
    {
      name: 'krishi-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        biometricEnabled: state.biometricEnabled,
        twoFactorEnabled: state.twoFactorEnabled
      })
    }
  )
);