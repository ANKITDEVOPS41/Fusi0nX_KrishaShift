import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isInstalled = isStandaloneMode || isIOSStandalone;
      
      setIsStandalone(isStandaloneMode || isIOSStandalone);
      setIsInstalled(isInstalled);
    };

    // Check if iOS
    const checkIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(isIOSDevice);
    };

    checkInstallation();
    checkIOS();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not dismissed before
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        const lastDismissed = dismissed ? parseInt(dismissed) : 0;
        const daysSinceDismissed = (Date.now() - lastDismissed) / (1000 * 60 * 60 * 24);
        
        if (!dismissed || daysSinceDismissed > 7) {
          setShowPrompt(true);
        }
      }, 5000); // Show after 5 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      
      // Track installation
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'PWA Installed',
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    
    // Track dismissal
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'pwa_install_dismissed', {
        event_category: 'engagement',
        event_label: 'PWA Install Dismissed',
      });
    }
  };

  const handleIOSInstall = () => {
    setShowPrompt(false);
    // Show iOS installation instructions
    alert(
      'To install Krishi Shift on your iPhone:\n\n' +
      '1. Tap the Share button at the bottom of the screen\n' +
      '2. Scroll down and tap "Add to Home Screen"\n' +
      '3. Tap "Add" to confirm'
    );
  };

  // Don't show if already installed or in standalone mode
  if (isInstalled || isStandalone) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Install Krishi Shift</CardTitle>
                    <CardDescription className="text-sm">
                      Get the full app experience
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  • Access offline when network is poor
                  • Faster loading and better performance
                  • Push notifications for price alerts
                  • Native app-like experience
                </div>
                
                <div className="flex gap-2">
                  {isIOS ? (
                    <Button onClick={handleIOSInstall} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Install App
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleInstallClick} 
                      disabled={!deferredPrompt}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Install App
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleDismiss}>
                    Later
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;