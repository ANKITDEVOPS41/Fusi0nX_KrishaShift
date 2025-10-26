import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Users, Bell, MapPin, Menu, X, Home, BarChart3, Settings, RefreshCw, Sparkles, Star, Zap } from 'lucide-react';

interface PriceData {
  crop: string;
  price: number;
  change: number;
  mandi: string;
  emoji: string;
}

interface WeatherAlert {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
  emoji: string;
}

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);

  // Price data for display (static for now)
  const priceData: PriceData[] = [
    { crop: 'Groundnut', price: 5450, change: 2.5, mandi: 'Pune Mandi', emoji: '🥜' },
    { crop: 'Sunflower', price: 6200, change: -1.2, mandi: 'Mumbai Mandi', emoji: '🌻' },
    { crop: 'Soybean', price: 4800, change: 0.8, mandi: 'Nashik Mandi', emoji: '🫘' }
  ];

  // Weather alerts for display (static for now)
  const weatherAlerts: WeatherAlert[] = [
    {
      type: 'Heavy Rainfall Expected',
      message: 'Next 3 days - 50-80mm expected',
      severity: 'high',
      location: 'Pune District',
      emoji: '🌧️'
    },
    {
      type: 'High Temperature Alert',
      message: 'Max temp: 42°C expected tomorrow',
      severity: 'medium',
      location: 'Maharashtra',
      emoji: '🌡️'
    }
  ];

  const [metrics, setMetrics] = useState({
    todayPrice: 5450,
    priceChange: 2.5,
    monthlyIncome: 45200,
    incomeChange: 12,
    activeFPOs: 3,
    alerts: 2
  });

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) {
      window.location.href = '/login';
      return;
    }

    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      setIsVisible(true);
    };

    loadData();

    // Auto-refresh data every 5 minutes
    const interval = setInterval(() => {
      refreshData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);

    // Simulate API calls with random price changes
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update metrics with random changes
    setMetrics(prev => ({
      ...prev,
      todayPrice: Math.round(prev.todayPrice * (1 + (Math.random() - 0.5) * 0.02)),
      priceChange: (Math.random() - 0.5) * 5
    }));

    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'prices':
        window.location.href = '/prices';
        break;
      case 'fpos':
        window.location.href = '/fpos';
        break;
      case 'schemes':
        window.location.href = '/schemes';
        break;
      case 'weather':
        window.location.href = '/weather';
        break;
      default:
        break;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/20 via-cyan-900/20 to-violet-900/20 dark:from-emerald-950/30 dark:via-cyan-950/30 dark:to-violet-950/30 relative overflow-hidden">
      {/* Stunning Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-400/10 dark:from-green-400/5 dark:to-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 dark:from-purple-400/5 dark:to-pink-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 dark:from-yellow-400/3 dark:to-orange-400/3 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Gorgeous Mobile Header */}
      <div className="lg:hidden bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/20 px-4 py-4 flex items-center justify-between relative z-50">
        <h1 className="text-xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
          <span className="text-2xl animate-bounce">🌾</span>
          Dashboard
          <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/80 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full p-2"
        >
          {sidebarOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </Button>
      </div>

      <div className="flex">
        {/* Spectacular Glass Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/90 backdrop-blur-xl shadow-2xl lg:shadow-xl border-r border-white/20 transition-all duration-500 ease-in-out lg:block`}>
          <div className="p-6 lg:p-8">
            <h2 className="text-2xl font-black mb-8 hidden lg:flex items-center gap-3">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                <span className="text-3xl animate-bounce">🌾</span>
                Krishi Shift
                <Star className="h-6 w-6 text-yellow-500 animate-spin" />
              </span>
            </h2>
            <nav className="space-y-3">
              <a href="/dashboard" className="flex items-center gap-4 px-4 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold">
                <BarChart3 className="h-5 w-5" />
                📊 Dashboard
              </a>
              <a href="/prices" className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold">
                <TrendingUp className="h-5 w-5" />
                📈 Prices
              </a>
              <a href="/fpos" className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold">
                <Users className="h-5 w-5" />
                🏢 FPOs
              </a>
              <a href="/weather" className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-700 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold">
                <MapPin className="h-5 w-5" />
                🌤️ Weather
              </a>
              <a href="/settings" className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:text-gray-700 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold">
                <Settings className="h-5 w-5" />
                ⚙️ Settings
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem('isAuthenticated');
                  localStorage.removeItem('userType');
                  window.location.href = '/';
                }}
                className="flex items-center gap-4 px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 rounded-2xl w-full text-left mt-6 transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold"
              >
                <Home className="h-5 w-5" />
                🚪 Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Spectacular Main Content */}
        <div className="flex-1 lg:ml-0 relative z-10">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-12 space-y-6 sm:space-y-8 lg:space-y-12">
            {/* Magnificent Welcome Header */}
            <div className={`hidden lg:block text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full mb-4 shadow-lg">
                <Star className="h-5 w-5 text-yellow-500 animate-spin" />
                <span className="text-sm font-bold text-gray-700">Live Dashboard</span>
                <Zap className="h-5 w-5 text-green-600 animate-pulse" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-3">
                <span className="holographic-text">🌾 Farmer Dashboard</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 font-medium">
                🚀 Your <span className="text-green-600 font-bold">farming insights</span> at a glance
              </p>
            </div>

            {/* Data Refresh Indicator */}
            <div className={`flex items-center justify-between mb-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-sm sm:text-base text-gray-600 font-medium bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                ⏰ Last updated: {formatTime(lastUpdated)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 bg-white/80 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full px-4 py-2 border-2 border-green-200 hover:border-green-400"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} text-green-600`} />
                <span className="hidden sm:inline font-semibold text-green-700">Refresh</span>
              </Button>
            </div>

            {/* Spectacular Key Metrics Grid */}
            <div className={`grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Card className="hover:shadow-2xl hover:scale-110 transition-all duration-500 cursor-pointer group glass-card neon-glow border-0 shadow-xl relative overflow-hidden" onClick={() => handleQuickAction('prices')}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                  <CardTitle className="text-sm sm:text-base font-bold text-gray-700 group-hover:text-green-700 transition-colors">📊 Today&apos;s Prices</CardTitle>
                  {metrics.priceChange >= 0 ? (
                    <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <TrendingDown className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className={`text-2xl sm:text-3xl lg:text-4xl font-black mb-2 group-hover:scale-105 transition-transform duration-300 ${metrics.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(metrics.todayPrice)}
                  </div>
                  <p className="text-sm text-gray-600 font-semibold flex items-center gap-1">
                    {metrics.priceChange >= 0 ? '📈' : '📉'}
                    {metrics.priceChange >= 0 ? '+' : ''}{metrics.priceChange.toFixed(1)}% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-2xl hover:scale-110 transition-all duration-500 cursor-pointer group glass-card neon-glow border-0 shadow-xl relative overflow-hidden" onClick={() => handleQuickAction('analytics')}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                  <CardTitle className="text-sm sm:text-base font-bold text-gray-700 group-hover:text-blue-700 transition-colors">💰 Monthly Income</CardTitle>
                  <DollarSign className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-600 mb-2 group-hover:scale-105 transition-transform duration-300">
                    {formatCurrency(metrics.monthlyIncome)}
                  </div>
                  <p className="text-sm text-gray-600 font-semibold flex items-center gap-1">
                    📈 +{metrics.incomeChange}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-2xl hover:scale-110 transition-all duration-500 cursor-pointer group glass-card neon-glow border-0 shadow-xl relative overflow-hidden" onClick={() => handleQuickAction('fpos')}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                  <CardTitle className="text-sm sm:text-base font-bold text-gray-700 group-hover:text-purple-700 transition-colors">🏢 Active FPOs</CardTitle>
                  <Users className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-600 mb-2 group-hover:scale-105 transition-transform duration-300">{metrics.activeFPOs}</div>
                  <p className="text-sm text-gray-600 font-semibold">
                    🤝 Connected organizations
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-2xl hover:scale-110 transition-all duration-500 xs:col-span-2 lg:col-span-1 cursor-pointer group glass-card neon-glow border-0 shadow-xl relative overflow-hidden" onClick={() => window.location.href = '/notifications'}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                  <CardTitle className="text-sm sm:text-base font-bold text-gray-700 group-hover:text-orange-700 transition-colors">🔔 Alerts</CardTitle>
                  <div className="relative">
                    <Bell className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                    {metrics.alerts > 0 && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-600 mb-2 group-hover:scale-105 transition-transform duration-300">{metrics.alerts}</div>
                  <p className="text-sm text-gray-600 font-semibold">
                    ⚠️ Weather & price alerts
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Responsive Recent Activity Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Recent Price Updates</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Latest market prices for your crops</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {priceData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center text-sm sm:text-base">
                            {item.emoji}
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base">{item.crop}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{item.mandi}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-sm sm:text-base ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{item.price.toLocaleString()}/quintal
                          </p>
                          <div className="flex items-center gap-1 justify-end">
                            {item.change >= 0 ? (
                              <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 text-red-600" />
                            )}
                            <span className={`text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Weather Alerts</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Important weather updates for your area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {weatherAlerts.map((alert, index) => (
                      <div key={index} className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors ${alert.severity === 'high' ? 'bg-red-50 hover:bg-red-100' :
                          alert.severity === 'medium' ? 'bg-orange-50 hover:bg-orange-100' :
                            'bg-blue-50 hover:bg-blue-100'
                        }`}>
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base flex-shrink-0 ${alert.severity === 'high' ? 'bg-red-100' :
                            alert.severity === 'medium' ? 'bg-orange-100' :
                              'bg-blue-100'
                          }`}>
                          {alert.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`font-medium text-sm sm:text-base ${alert.severity === 'high' ? 'text-red-800' :
                              alert.severity === 'medium' ? 'text-orange-800' :
                                'text-blue-800'
                            }`}>
                            {alert.type}
                          </p>
                          <p className={`text-xs sm:text-sm mt-1 ${alert.severity === 'high' ? 'text-red-600' :
                              alert.severity === 'medium' ? 'text-orange-600' :
                                'text-blue-600'
                            }`}>
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-1 mt-1 sm:mt-2">
                            <MapPin className={`h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0 ${alert.severity === 'high' ? 'text-red-600' :
                                alert.severity === 'medium' ? 'text-orange-600' :
                                  'text-blue-600'
                              }`} />
                            <span className={`text-xs ${alert.severity === 'high' ? 'text-red-600' :
                                alert.severity === 'medium' ? 'text-orange-600' :
                                  'text-blue-600'
                              }`}>
                              {alert.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Responsive Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Quick Actions</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Frequently used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div
                    className="flex flex-col items-center p-3 sm:p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md cursor-pointer transition-all duration-300 group"
                    onClick={() => handleQuickAction('prices')}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg sm:text-xl lg:text-2xl">📊</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center">Check Prices</span>
                  </div>

                  <div
                    className="flex flex-col items-center p-3 sm:p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md cursor-pointer transition-all duration-300 group"
                    onClick={() => handleQuickAction('fpos')}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg sm:text-xl lg:text-2xl">🏢</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center">Find FPOs</span>
                  </div>

                  <div
                    className="flex flex-col items-center p-3 sm:p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md cursor-pointer transition-all duration-300 group"
                    onClick={() => handleQuickAction('schemes')}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg sm:text-xl lg:text-2xl">📋</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center">Schemes</span>
                  </div>

                  <div
                    className="flex flex-col items-center p-3 sm:p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md cursor-pointer transition-all duration-300 group"
                    onClick={() => handleQuickAction('weather')}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg sm:text-xl lg:text-2xl">🌤️</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center">Weather</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;