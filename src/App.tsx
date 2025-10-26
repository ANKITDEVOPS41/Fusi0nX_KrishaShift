import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useAuthStore } from "@/stores/authStore";
import { usePriceStore } from "@/stores/priceStore";
import { ThemeProvider } from "next-themes";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OfflineIndicator from "@/components/OfflineIndicator";
import NotificationManager from "@/components/NotificationManager";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import SecurityProvider from "@/components/SecurityProvider";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const CropCompare = lazy(() => import("./pages/CropCompare"));
const Prices = lazy(() => import("./pages/Prices"));
const FPOs = lazy(() => import("./pages/FPOs"));
const FPODetail = lazy(() => import("./pages/FPODetail"));
const Schemes = lazy(() => import("./pages/Schemes"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Weather = lazy(() => import("./pages/Weather"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Payments = lazy(() => import("./pages/Payments"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { setRealTimeConnection } = usePriceStore();

  useEffect(() => {
    // Initialize PWA features
    initializePWA();
    
    // Setup network status monitoring
    setupNetworkMonitoring();
    
    // Initialize analytics
    initializeAnalytics();
    
    // Setup error reporting
    setupErrorReporting();
    
    // Initialize push notifications
    initializePushNotifications();
    
    return () => {
      // Cleanup
      cleanupServices();
    };
  }, []);

  const initializePWA = async () => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                showUpdateNotification();
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Setup background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        // Register background sync events
        registration.sync.register('price-alerts-sync');
        registration.sync.register('offline-transactions-sync');
      });
    }

    // Setup periodic background sync
    if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const status = await navigator.permissions.query({ name: 'periodic-background-sync' as any });
        if (status.state === 'granted') {
          await registration.periodicSync.register('price-updates', {
            minInterval: 24 * 60 * 60 * 1000, // 24 hours
          });
        }
      });
    }
  };

  const setupNetworkMonitoring = () => {
    const updateOnlineStatus = () => {
      setRealTimeConnection(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial status
    updateOnlineStatus();
  };

  const initializeAnalytics = () => {
    // Initialize Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    // Initialize Mixpanel
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.init('MIXPANEL_TOKEN');
    }
  };

  const setupErrorReporting = () => {
    // Setup global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      // Send to error reporting service
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Send to error reporting service
    });
  };

  const initializePushNotifications = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Subscribe to push notifications
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'VAPID_PUBLIC_KEY', // Replace with actual VAPID key
        });
        
        // Send subscription to server
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });
      }
    }
  };

  const showUpdateNotification = () => {
    // Show update notification to user
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('App Update Available', {
        body: 'A new version of Krishi Shift is available. Refresh to update.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'app-update',
        requireInteraction: true,
        actions: [
          { action: 'update', title: 'Update Now' },
          { action: 'dismiss', title: 'Later' },
        ],
      });
    }
  };

  const cleanupServices = () => {
    // Cleanup any running services
    window.removeEventListener('online', () => {});
    window.removeEventListener('offline', () => {});
  };

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SecurityProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <BrowserRouter>
                <AnalyticsProvider>
                  <div className="min-h-screen bg-background">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/prices" element={<Prices />} />
                        <Route path="/fpos" element={<FPOs />} />
                        <Route path="/fpos/:id" element={<FPODetail />} />
                        <Route path="/schemes" element={<Schemes />} />
                        <Route path="/compare" element={<CropCompare />} />
                        <Route path="/weather" element={<Weather />} />
                        <Route path="/help" element={<Help />} />
                        
                        {/* Protected Routes */}
                        {isAuthenticated && (
                          <>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/payments" element={<Payments />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/settings" element={<Settings />} />
                          </>
                        )}
                        
                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                    
                    {/* Global Components */}
                    <Toaster />
                    <Sonner />
                    <PWAInstallPrompt />
                    <OfflineIndicator />
                    <NotificationManager />
                  </div>
                </AnalyticsProvider>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </SecurityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
