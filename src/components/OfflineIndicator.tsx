import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePriceStore } from '@/stores/priceStore';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [offlineStartTime, setOfflineStartTime] = useState<Date | null>(null);
  const { realTimeConnection } = usePriceStore();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineStartTime(null);
      
      // Show reconnection message briefly
      if (showOfflineMessage) {
        setTimeout(() => setShowOfflineMessage(false), 3000);
      }
      
      // Track reconnection
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'network_reconnected', {
          event_category: 'connectivity',
          event_label: 'Network Reconnected',
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineStartTime(new Date());
      setShowOfflineMessage(true);
      
      // Track offline event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'network_offline', {
          event_category: 'connectivity',
          event_label: 'Network Offline',
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show offline message if already offline
    if (!navigator.onLine) {
      setShowOfflineMessage(true);
      setOfflineStartTime(new Date());
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showOfflineMessage]);

  const handleRetry = () => {
    // Force a network check
    fetch('/api/health', { 
      method: 'HEAD',
      cache: 'no-cache',
    })
      .then(() => {
        setIsOnline(true);
        setShowOfflineMessage(false);
        setOfflineStartTime(null);
      })
      .catch(() => {
        // Still offline
        console.log('Still offline');
      });
  };

  const getOfflineDuration = () => {
    if (!offlineStartTime) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - offlineStartTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    
    if (diffMins > 0) {
      return `${diffMins}m ${diffSecs}s`;
    }
    return `${diffSecs}s`;
  };

  return (
    <>
      {/* Network Status Indicator */}
      <div className="fixed top-4 right-4 z-40">
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-destructive text-destructive-foreground px-3 py-2 rounded-full shadow-lg flex items-center gap-2"
            >
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">Offline</span>
            </motion.div>
          )}
          
          {isOnline && !realTimeConnection && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-warning text-warning-foreground px-3 py-2 rounded-full shadow-lg flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Limited</span>
            </motion.div>
          )}
          
          {isOnline && realTimeConnection && showOfflineMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-success text-success-foreground px-3 py-2 rounded-full shadow-lg flex items-center gap-2"
            >
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">Connected</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && showOfflineMessage && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground"
          >
            <div className="container mx-auto px-4 py-3">
              <Alert className="border-0 bg-transparent text-destructive-foreground">
                <WifiOff className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span>
                      You're offline. Some features may not work properly.
                    </span>
                    {offlineStartTime && (
                      <span className="text-sm opacity-75">
                        Offline for {getOfflineDuration()}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="ml-4 border-destructive-foreground text-destructive-foreground hover:bg-destructive-foreground hover:text-destructive"
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Features Available */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-4 md:w-80"
          >
            <Alert className="bg-muted border-muted-foreground/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Available offline:</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• View cached crop prices</li>
                    <li>• Browse saved FPO information</li>
                    <li>• Access government schemes</li>
                    <li>• Use crop comparison tool</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfflineIndicator;