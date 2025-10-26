// Enterprise Configuration Management
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.krishishift.com',
    timeout: 30000,
    retryAttempts: 3,
    rateLimit: {
      requests: 1000,
      windowMs: 60000, // 1 minute
    }
  },

  // Database Configuration
  database: {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    redis: {
      url: import.meta.env.VITE_REDIS_URL,
      ttl: {
        prices: 21600, // 6 hours
        sessions: 604800, // 7 days
        cache: 3600, // 1 hour
      }
    }
  },

  // Authentication Configuration
  auth: {
    firebase: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    },
    jwt: {
      accessTokenExpiry: 900, // 15 minutes
      refreshTokenExpiry: 604800, // 7 days
    },
    oauth: {
      google: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      microsoft: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    }
  },

  // Payment Gateway Configuration
  payments: {
    razorpay: {
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
      keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
    },
    stripe: {
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    },
    payU: {
      merchantKey: import.meta.env.VITE_PAYU_MERCHANT_KEY,
      salt: import.meta.env.VITE_PAYU_SALT,
    }
  },

  // External Services Configuration
  services: {
    mapbox: {
      accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
    },
    openWeather: {
      apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
    },
    googleEarth: {
      apiKey: import.meta.env.VITE_GOOGLE_EARTH_API_KEY,
    },
    twilio: {
      accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
      authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
    },
    whatsapp: {
      businessApiKey: import.meta.env.VITE_WHATSAPP_BUSINESS_API_KEY,
    }
  },

  // Government API Configuration
  government: {
    agmarknet: {
      baseUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx',
      apiKey: import.meta.env.VITE_AGMARKNET_API_KEY,
    },
    enam: {
      baseUrl: 'https://enam.gov.in/web/api',
      apiKey: import.meta.env.VITE_ENAM_API_KEY,
    },
    nafed: {
      baseUrl: 'https://nafed-india.com/api',
      apiKey: import.meta.env.VITE_NAFED_API_KEY,
    }
  },

  // ML/AI Configuration
  ml: {
    tensorflow: {
      modelUrl: import.meta.env.VITE_TF_MODEL_URL,
      backend: 'webgl',
    },
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    }
  },

  // Blockchain Configuration
  blockchain: {
    hyperledger: {
      networkUrl: import.meta.env.VITE_HYPERLEDGER_NETWORK_URL,
      channelName: 'krishi-channel',
      chaincodeName: 'krishi-contract',
    }
  },

  // Analytics Configuration
  analytics: {
    google: {
      measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
    },
    mixpanel: {
      token: import.meta.env.VITE_MIXPANEL_TOKEN,
    },
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN,
    }
  },

  // PWA Configuration
  pwa: {
    vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    swUrl: '/sw.js',
    offlinePages: [
      '/',
      '/prices',
      '/fpos',
      '/schemes',
      '/compare'
    ]
  },

  // Feature Flags
  features: {
    enableBlockchain: import.meta.env.VITE_ENABLE_BLOCKCHAIN === 'true',
    enableML: import.meta.env.VITE_ENABLE_ML === 'true',
    enableVoiceInput: import.meta.env.VITE_ENABLE_VOICE === 'true',
    enableBiometric: import.meta.env.VITE_ENABLE_BIOMETRIC === 'true',
    enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE === 'true',
  },

  // Security Configuration
  security: {
    encryption: {
      algorithm: 'AES-256-GCM',
      keyLength: 32,
    },
    headers: {
      hsts: 'max-age=31536000; includeSubDomains',
      csp: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    }
  },

  // Performance Configuration
  performance: {
    imageOptimization: {
      quality: 80,
      format: 'webp',
      maxWidth: 1920,
    },
    caching: {
      staticAssets: 31536000, // 1 year
      apiResponses: 300, // 5 minutes
    }
  }
};

export default config;