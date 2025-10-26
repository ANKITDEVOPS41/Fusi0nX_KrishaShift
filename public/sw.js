// Krishi Shift Service Worker - Enterprise PWA Implementation
const CACHE_NAME = 'krishi-shift-v1.0.0';
const STATIC_CACHE = 'krishi-static-v1.0.0';
const DYNAMIC_CACHE = 'krishi-dynamic-v1.0.0';
const API_CACHE = 'krishi-api-v1.0.0';

// Critical resources for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/prices',
  '/fpos',
  '/schemes',
  '/compare',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache for offline access
const API_ENDPOINTS = [
  '/api/prices/latest',
  '/api/fpos/nearby',
  '/api/schemes/active',
  '/api/weather/current',
  '/api/user/profile'
];

// Background sync tags
const SYNC_TAGS = {
  PRICE_ALERTS: 'price-alerts-sync',
  OFFLINE_TRANSACTIONS: 'offline-transactions-sync',
  USER_ANALYTICS: 'user-analytics-sync',
  NOTIFICATION_QUEUE: 'notification-queue-sync'
};

// Install event - Cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache API responses
      caches.open(API_CACHE).then((cache) => {
        console.log('[SW] Pre-caching API responses');
        return Promise.all(
          API_ENDPOINTS.map(endpoint => 
            fetch(endpoint)
              .then(response => response.ok ? cache.put(endpoint, response) : null)
              .catch(() => console.log(`[SW] Failed to cache ${endpoint}`))
          )
        );
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete');
    })
  );
});

// Fetch event - Network-first with fallback strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else {
    event.respondWith(handleNavigationRequest(request));
  }
});

// API Request Handler - Network first with cache fallback
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      
      // Update real-time data in IndexedDB
      if (url.pathname.includes('/prices/')) {
        updatePricesInDB(await networkResponse.clone().json());
      }
      
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for critical endpoints
    if (url.pathname.includes('/prices/')) {
      return new Response(JSON.stringify({
        error: 'Offline',
        message: 'Price data unavailable offline',
        cached: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// Static Asset Handler - Cache first
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch static asset:', request.url);
    throw error;
  }
}

// Navigation Request Handler - Network first with offline fallback
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[SW] Network failed for navigation, trying cache');
    
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    const offlinePage = await caches.match('/');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Last resort - basic offline response
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Krishi Shift - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline { color: #666; }
          </style>
        </head>
        <body>
          <div class="offline">
            <h1>🌾 Krishi Shift</h1>
            <h2>You're offline</h2>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Background Sync - Handle offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case SYNC_TAGS.PRICE_ALERTS:
      event.waitUntil(syncPriceAlerts());
      break;
    case SYNC_TAGS.OFFLINE_TRANSACTIONS:
      event.waitUntil(syncOfflineTransactions());
      break;
    case SYNC_TAGS.USER_ANALYTICS:
      event.waitUntil(syncUserAnalytics());
      break;
    case SYNC_TAGS.NOTIFICATION_QUEUE:
      event.waitUntil(syncNotificationQueue());
      break;
  }
});

// Push Notifications - Handle real-time alerts
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    badge: '/icons/badge-72x72.png',
    icon: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    
    switch (data.type) {
      case 'price_alert':
        options.title = `Price Alert: ${data.crop}`;
        options.body = `${data.crop} price is now ₹${data.price}/quintal in ${data.mandi}`;
        options.tag = 'price-alert';
        options.data = { url: '/prices', crop: data.crop };
        break;
        
      case 'weather_alert':
        options.title = 'Weather Alert';
        options.body = data.message;
        options.tag = 'weather-alert';
        options.data = { url: '/weather' };
        break;
        
      case 'scheme_deadline':
        options.title = 'Scheme Deadline Reminder';
        options.body = `${data.scheme} deadline in ${data.days} days`;
        options.tag = 'scheme-deadline';
        options.data = { url: '/schemes', scheme: data.scheme };
        break;
        
      case 'fpo_payment':
        options.title = 'Payment Received';
        options.body = `₹${data.amount} received from ${data.fpo}`;
        options.tag = 'fpo-payment';
        options.data = { url: '/transactions', transaction: data.id };
        break;
        
      default:
        options.title = data.title || 'Krishi Shift';
        options.body = data.body || 'New notification';
        options.data = { url: data.url || '/' };
    }
  } else {
    options.title = 'Krishi Shift';
    options.body = 'New update available';
    options.data = { url: '/' };
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const { action } = event;
  const { data } = event.notification;
  
  if (action === 'dismiss') {
    return;
  }
  
  const urlToOpen = data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Periodic Background Sync - Update critical data
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync triggered:', event.tag);
  
  if (event.tag === 'price-updates') {
    event.waitUntil(updatePriceData());
  } else if (event.tag === 'weather-updates') {
    event.waitUntil(updateWeatherData());
  }
});

// Utility Functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/static/') || 
         url.pathname.includes('/icons/') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.svg');
}

async function syncPriceAlerts() {
  try {
    const alerts = await getStoredData('price-alerts');
    if (alerts.length > 0) {
      const response = await fetch('/api/alerts/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alerts)
      });
      
      if (response.ok) {
        await clearStoredData('price-alerts');
        console.log('[SW] Price alerts synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync price alerts:', error);
  }
}

async function syncOfflineTransactions() {
  try {
    const transactions = await getStoredData('offline-transactions');
    if (transactions.length > 0) {
      const response = await fetch('/api/transactions/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactions)
      });
      
      if (response.ok) {
        await clearStoredData('offline-transactions');
        console.log('[SW] Offline transactions synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync offline transactions:', error);
  }
}

async function syncUserAnalytics() {
  try {
    const analytics = await getStoredData('user-analytics');
    if (analytics.length > 0) {
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analytics)
      });
      
      if (response.ok) {
        await clearStoredData('user-analytics');
        console.log('[SW] User analytics synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync user analytics:', error);
  }
}

async function syncNotificationQueue() {
  try {
    const notifications = await getStoredData('notification-queue');
    for (const notification of notifications) {
      await self.registration.showNotification(notification.title, notification.options);
    }
    await clearStoredData('notification-queue');
    console.log('[SW] Notification queue processed');
  } catch (error) {
    console.error('[SW] Failed to process notification queue:', error);
  }
}

async function updatePriceData() {
  try {
    const response = await fetch('/api/prices/latest');
    if (response.ok) {
      const prices = await response.json();
      await updatePricesInDB(prices);
      console.log('[SW] Price data updated in background');
    }
  } catch (error) {
    console.error('[SW] Failed to update price data:', error);
  }
}

async function updateWeatherData() {
  try {
    const response = await fetch('/api/weather/current');
    if (response.ok) {
      const weather = await response.json();
      await storeData('weather-data', weather);
      console.log('[SW] Weather data updated in background');
    }
  } catch (error) {
    console.error('[SW] Failed to update weather data:', error);
  }
}

// IndexedDB helpers
async function updatePricesInDB(prices) {
  // Implementation would use IndexedDB to store price data
  console.log('[SW] Updating prices in IndexedDB:', prices.length);
}

async function getStoredData(storeName) {
  // Implementation would retrieve data from IndexedDB
  return [];
}

async function clearStoredData(storeName) {
  // Implementation would clear data from IndexedDB
  console.log('[SW] Cleared stored data:', storeName);
}

async function storeData(storeName, data) {
  // Implementation would store data in IndexedDB
  console.log('[SW] Stored data:', storeName);
}

console.log('[SW] Service worker loaded successfully');