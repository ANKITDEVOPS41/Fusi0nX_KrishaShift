import { io, Socket } from 'socket.io-client';
import axios, { AxiosInstance } from 'axios';
import { config } from '@/lib/config';
import { usePriceStore, CropPrice, PricePrediction } from '@/stores/priceStore';

export interface PriceFilter {
  crop?: string;
  state?: string;
  district?: string;
  mandi?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minPrice?: number;
  maxPrice?: number;
}

export interface MarketTrend {
  crop: string;
  trend: 'bullish' | 'bearish' | 'stable';
  confidence: number;
  factors: {
    weather: number;
    demand: number;
    supply: number;
    government_policy: number;
    international_market: number;
  };
  prediction: {
    nextWeek: number;
    nextMonth: number;
    confidence: number;
  };
}

export interface MandiInfo {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinates: [number, number];
  facilities: string[];
  operatingHours: {
    open: string;
    close: string;
    days: string[];
  };
  contact: {
    phone?: string;
    email?: string;
  };
  averageDailyArrivals: number;
  supportedCrops: string[];
}

class PriceService {
  private socket: Socket | null = null;
  private api: AxiosInstance;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    // Initialize HTTP client
    this.api = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup request/response interceptors
    this.setupInterceptors();
    
    // Initialize WebSocket connection
    this.initializeSocket();
  }

  // Initialize WebSocket connection for real-time updates
  private initializeSocket(): void {
    try {
      this.socket = io(config.api.baseUrl, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 20000,
        forceNew: false,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        maxHttpBufferSize: 1e6,
        pingTimeout: 60000,
        pingInterval: 25000,
      });

      this.setupSocketListeners();
    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
    }
  }

  // Setup socket event listeners
  private setupSocketListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to price service');
      this.reconnectAttempts = 0;
      usePriceStore.getState().setRealTimeConnection(true);
      
      // Subscribe to price updates
      this.subscribeToUpdates();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from price service:', reason);
      usePriceStore.getState().setRealTimeConnection(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.handleReconnection();
    });

    // Price update events
    this.socket.on('price_update', (data: CropPrice) => {
      usePriceStore.getState().addPrice(data);
    });

    this.socket.on('price_alert', (data: any) => {
      this.handlePriceAlert(data);
    });

    this.socket.on('market_trend', (data: MarketTrend) => {
      this.handleMarketTrend(data);
    });

    this.socket.on('bulk_price_update', (data: CropPrice[]) => {
      usePriceStore.getState().setPrices(data);
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      usePriceStore.getState().setError(error.message);
    });
  }

  // Setup HTTP interceptors
  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('krishi_access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh
          await this.refreshToken();
          return this.api.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  // Subscribe to real-time updates
  private subscribeToUpdates(): void {
    if (!this.socket) return;

    // Subscribe to all oilseed price updates
    this.socket.emit('subscribe', {
      type: 'prices',
      crops: ['groundnut', 'sunflower', 'soybean', 'mustard', 'safflower', 'niger', 'castor'],
      states: [], // Empty means all states
    });

    // Subscribe to market trends
    this.socket.emit('subscribe', {
      type: 'trends',
      crops: ['groundnut', 'sunflower', 'soybean', 'mustard'],
    });
  }

  // Handle reconnection logic
  private handleReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts), 30000);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.socket?.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      usePriceStore.getState().setError('Connection lost. Please refresh the page.');
    }
  }

  // Handle price alerts
  private handlePriceAlert(data: any): void {
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Price Alert: ${data.crop}`, {
        body: `${data.crop} price is now ₹${data.price}/quintal in ${data.mandi}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'price-alert',
        requireInteraction: true,
      });
    }

    // Update store
    usePriceStore.getState().setError(null);
  }

  // Handle market trends
  private handleMarketTrend(data: MarketTrend): void {
    console.log('Market trend update:', data);
    // Process trend data and update relevant stores
  }

  // Fetch latest prices
  async fetchLatestPrices(filter?: PriceFilter): Promise<CropPrice[]> {
    try {
      usePriceStore.getState().setLoading(true);
      
      const response = await this.api.get('/api/prices/latest', {
        params: filter,
      });

      const prices = response.data.prices || [];
      usePriceStore.getState().setPrices(prices);
      
      return prices;
    } catch (error: any) {
      console.error('Error fetching latest prices:', error);
      usePriceStore.getState().setError(error.message);
      throw error;
    } finally {
      usePriceStore.getState().setLoading(false);
    }
  }

  // Fetch historical prices
  async fetchHistoricalPrices(
    crop: string, 
    days: number = 30
  ): Promise<CropPrice[]> {
    try {
      const response = await this.api.get(`/api/prices/historical/${crop}`, {
        params: { days },
      });

      const history = response.data.prices || [];
      usePriceStore.getState().setPriceHistory(crop, history);
      
      return history;
    } catch (error: any) {
      console.error('Error fetching historical prices:', error);
      throw error;
    }
  }

  // Fetch price predictions
  async fetchPricePredictions(crop: string): Promise<PricePrediction> {
    try {
      const response = await this.api.get(`/api/prices/predictions/${crop}`);
      return response.data.prediction;
    } catch (error: any) {
      console.error('Error fetching price predictions:', error);
      throw error;
    }
  }

  // Fetch market trends
  async fetchMarketTrends(crops?: string[]): Promise<MarketTrend[]> {
    try {
      const response = await this.api.get('/api/market/trends', {
        params: { crops: crops?.join(',') },
      });
      
      return response.data.trends || [];
    } catch (error: any) {
      console.error('Error fetching market trends:', error);
      throw error;
    }
  }

  // Fetch mandi information
  async fetchMandis(
    state?: string, 
    district?: string
  ): Promise<MandiInfo[]> {
    try {
      const response = await this.api.get('/api/mandis', {
        params: { state, district },
      });
      
      return response.data.mandis || [];
    } catch (error: any) {
      console.error('Error fetching mandis:', error);
      throw error;
    }
  }

  // Search prices with advanced filters
  async searchPrices(query: string, filter?: PriceFilter): Promise<CropPrice[]> {
    try {
      const response = await this.api.get('/api/prices/search', {
        params: { q: query, ...filter },
      });
      
      return response.data.prices || [];
    } catch (error: any) {
      console.error('Error searching prices:', error);
      throw error;
    }
  }

  // Get price statistics
  async getPriceStatistics(
    crop: string, 
    period: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<{
    average: number;
    min: number;
    max: number;
    volatility: number;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
  }> {
    try {
      const response = await this.api.get(`/api/prices/statistics/${crop}`, {
        params: { period },
      });
      
      return response.data.statistics;
    } catch (error: any) {
      console.error('Error fetching price statistics:', error);
      throw error;
    }
  }

  // Create price alert
  async createPriceAlert(
    crop: string,
    targetPrice: number,
    condition: 'above' | 'below',
    mandi?: string
  ): Promise<void> {
    try {
      await this.api.post('/api/alerts/price', {
        crop,
        targetPrice,
        condition,
        mandi,
      });
      
      // Subscribe to this specific alert via socket
      if (this.socket) {
        this.socket.emit('subscribe_alert', {
          crop,
          targetPrice,
          condition,
          mandi,
        });
      }
    } catch (error: any) {
      console.error('Error creating price alert:', error);
      throw error;
    }
  }

  // Delete price alert
  async deletePriceAlert(alertId: string): Promise<void> {
    try {
      await this.api.delete(`/api/alerts/price/${alertId}`);
      
      // Unsubscribe from socket
      if (this.socket) {
        this.socket.emit('unsubscribe_alert', { alertId });
      }
    } catch (error: any) {
      console.error('Error deleting price alert:', error);
      throw error;
    }
  }

  // Get nearby mandis based on location
  async getNearbyMandis(
    latitude: number,
    longitude: number,
    radius: number = 50
  ): Promise<MandiInfo[]> {
    try {
      const response = await this.api.get('/api/mandis/nearby', {
        params: { lat: latitude, lng: longitude, radius },
      });
      
      return response.data.mandis || [];
    } catch (error: any) {
      console.error('Error fetching nearby mandis:', error);
      throw error;
    }
  }

  // Export price data
  async exportPriceData(
    format: 'csv' | 'excel' | 'pdf',
    filter?: PriceFilter
  ): Promise<Blob> {
    try {
      const response = await this.api.get('/api/prices/export', {
        params: { format, ...filter },
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error exporting price data:', error);
      throw error;
    }
  }

  // Refresh authentication token
  private async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('krishi_refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${config.api.baseUrl}/api/auth/refresh`, {
        refreshToken,
      });

      const { accessToken } = response.data;
      localStorage.setItem('krishi_access_token', accessToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Redirect to login
      window.location.href = '/login';
    }
  }

  // Disconnect socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Reconnect socket
  reconnect(): void {
    if (this.socket) {
      this.socket.connect();
    } else {
      this.initializeSocket();
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Manual price update (for testing)
  async triggerPriceUpdate(): Promise<void> {
    if (this.socket) {
      this.socket.emit('request_price_update');
    }
  }
}

export const priceService = new PriceService();
export default priceService;