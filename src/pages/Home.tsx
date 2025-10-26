import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Calendar, MapPin, Menu, X, Smartphone, Tablet, Monitor, Star, Sparkles, Award, Shield, Zap, Heart } from 'lucide-react';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger animations on load
    setTimeout(() => setIsVisible(true), 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/20 via-cyan-900/20 to-violet-900/20 dark:from-emerald-950/30 dark:via-cyan-950/30 dark:to-violet-950/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-400/10 dark:from-green-400/5 dark:to-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 dark:from-purple-400/5 dark:to-pink-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 dark:from-yellow-400/3 dark:to-orange-400/3 rounded-full blur-2xl animate-bounce"></div>
      </div>
      {/* Stunning Glass Header */}
      <header className="bg-background/80 backdrop-blur-xl shadow-lg border-b border-border sticky top-0 z-50 transition-all duration-300" style={{
        transform: `translateY(${scrollY > 50 ? '-2px' : '0px'})`,
        boxShadow: scrollY > 50 ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Stunning Logo with Animation */}
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary flex items-center gap-1 sm:gap-2 hover:scale-105 transition-transform duration-300">
                <span className="text-xl sm:text-2xl animate-bounce">🌾</span>
                <span className="hidden xs:inline font-extrabold tracking-tight">Krishi Shift</span>
                <span className="xs:hidden font-extrabold">KS</span>
                <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse ml-1" />
              </h1>
            </div>

            {/* Beautiful Glass Navigation */}
            <nav className="hidden lg:flex space-x-2 xl:space-x-4">
              <button 
                onClick={() => window.location.href = '/prices'}
                className="text-foreground hover:text-primary transition-all duration-300 text-sm xl:text-base font-semibold hover:bg-accent px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 border border-transparent hover:border-primary/20"
              >
                📊 Prices
              </button>
              <button 
                onClick={() => window.location.href = '/fpos'}
                className="text-foreground hover:text-blue-500 transition-all duration-300 text-sm xl:text-base font-semibold hover:bg-accent px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 border border-transparent hover:border-blue-500/20"
              >
                🏢 FPOs
              </button>
              <button 
                onClick={() => window.location.href = '/schemes'}
                className="text-foreground hover:text-purple-500 transition-all duration-300 text-sm xl:text-base font-semibold hover:bg-accent px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 border border-transparent hover:border-purple-500/20"
              >
                📋 Schemes
              </button>
              <button 
                onClick={() => window.location.href = '/weather'}
                className="text-foreground hover:text-orange-500 transition-all duration-300 text-sm xl:text-base font-semibold hover:bg-accent px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 border border-transparent hover:border-orange-500/20"
              >
                🌤️ Weather
              </button>
            </nav>

            {/* Stunning Auth Buttons */}
            <div className="hidden md:flex space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs sm:text-sm px-4 sm:px-6 py-2 border-2 border-green-200 hover:border-green-400 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-full font-semibold"
                onClick={() => window.location.href = '/login'}
              >
                Login
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-xs sm:text-sm px-4 sm:px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full font-semibold text-white border-0"
                onClick={() => window.location.href = '/register'}
              >
                ✨ Register
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-foreground hover:text-primary hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button 
                  onClick={() => { window.location.href = '/prices'; setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors font-medium"
                >
                  📊 Prices
                </button>
                <button 
                  onClick={() => { window.location.href = '/fpos'; setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors font-medium"
                >
                  🏢 FPOs
                </button>
                <button 
                  onClick={() => { window.location.href = '/schemes'; setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors font-medium"
                >
                  📋 Schemes
                </button>
                <button 
                  onClick={() => { window.location.href = '/weather'; setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors font-medium"
                >
                  🌤️ Weather
                </button>
                <div className="flex space-x-2 px-3 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                    onClick={() => window.location.href = '/login'}
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-xs shadow-md"
                    onClick={() => window.location.href = '/register'}
                  >
                    Register
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Breathtaking Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-3 sm:px-4 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Magical Animated Heading */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 sm:mb-8 leading-tight">
              <span className="block sm:inline text-foreground">Empowering</span>
              <span className="block sm:inline text-primary"> Oilseed</span>
              <span className="block text-foreground mt-2 sm:mt-0"> Farmers</span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-4 text-primary font-bold">Across India 🇮🇳</span>
            </h1>
          </div>
          
          {/* Beautiful Description with Animation */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground mb-8 sm:mb-10 max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto leading-relaxed px-2 font-medium">
              🚀 Get <span className="text-green-600 font-bold">real-time crop prices</span>, connect with <span className="text-blue-600 font-bold">7,600+ FPOs</span>, access <span className="text-purple-600 font-bold">government schemes</span>, 
              and make <span className="text-orange-600 font-bold">data-driven farming decisions</span> with our comprehensive platform.
            </p>
          </div>
          
          {/* Spectacular CTA Buttons */}
          <div className={`flex flex-col xs:flex-row gap-4 sm:gap-6 justify-center items-center max-w-sm xs:max-w-none mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 w-full xs:w-auto px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 rounded-2xl text-white border-0 relative overflow-hidden group"
              onClick={() => window.location.href = '/register'}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="h-5 w-5 animate-pulse" />
                Get Started Today
                <Star className="h-4 w-4 animate-spin" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full xs:w-auto px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-bold border-3 border-gray-300 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 rounded-2xl shadow-lg hover:shadow-2xl group"
              onClick={() => {
                alert('🎬 Demo video coming soon! For now, explore our amazing features by registering. 🚀');
                window.location.href = '/register';
              }}
            >
              <span className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 animate-pulse" />
                Watch Demo
                <Sparkles className="h-4 w-4 text-yellow-500 animate-bounce" />
              </span>
            </Button>
          </div>

          {/* Beautiful Device Compatibility */}
          <div className={`mt-10 sm:mt-16 flex justify-center items-center space-x-6 sm:space-x-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <Smartphone className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">Mobile</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <Tablet className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Tablet</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <Monitor className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Desktop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Spectacular Features Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          {/* Stunning Section Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 px-6 py-2 rounded-full mb-6">
              <Award className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">Premium Features</span>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 px-2">
              <span className="text-foreground">Everything You Need for</span>
              <span className="block text-primary">Successful Farming 🌱</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed font-medium">
              🚀 Comprehensive tools and insights designed specifically for <span className="text-green-600 font-bold">oilseed farmers</span>
            </p>
          </div>
          
          {/* Gorgeous Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            <Card 
              className="text-center hover:shadow-2xl hover:scale-110 transition-all duration-500 border-0 shadow-xl cursor-pointer group bg-gradient-to-br from-white to-green-50 relative overflow-hidden"
              onClick={() => window.location.href = '/prices'}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 sm:pb-6 relative z-10">
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                  <TrendingUp className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-green-600 group-hover:text-green-700" />
                </div>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl group-hover:text-green-700 transition-colors font-bold">📊 Real-time Prices</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <CardDescription className="text-sm sm:text-base lg:text-lg leading-relaxed mb-4 text-gray-600 group-hover:text-gray-700">
                  Get live market prices for groundnut, sunflower, soybean, and other oilseeds from <span className="font-bold text-green-600">200+ mandis</span>
                </CardDescription>
                <Button size="sm" className="opacity-100 group-hover:scale-105 transition-all duration-500 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl border-2 border-green-500 hover:border-green-400">
                  View Prices →
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="text-center hover:shadow-2xl hover:scale-110 transition-all duration-500 border-0 shadow-xl cursor-pointer group bg-gradient-to-br from-white to-blue-50 relative overflow-hidden"
              onClick={() => window.location.href = '/fpos'}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 sm:pb-6 relative z-10">
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                  <Users className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-blue-600 group-hover:text-blue-700" />
                </div>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl group-hover:text-blue-700 transition-colors font-bold">🏢 FPO Network</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <CardDescription className="text-sm sm:text-base lg:text-lg leading-relaxed mb-4 text-gray-600 group-hover:text-gray-700">
                  Connect with <span className="font-bold text-blue-600">7,600+ Farmer Producer Organizations</span> for better market access and support
                </CardDescription>
                <Button size="sm" className="opacity-100 group-hover:scale-105 transition-all duration-500 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl border-2 border-blue-500 hover:border-blue-400">
                  Find FPOs →
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="text-center hover:shadow-2xl hover:scale-110 transition-all duration-500 border-0 shadow-xl cursor-pointer group bg-gradient-to-br from-white to-purple-50 relative overflow-hidden"
              onClick={() => window.location.href = '/schemes'}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 sm:pb-6 relative z-10">
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-100 to-violet-100 group-hover:from-purple-200 group-hover:to-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                  <Calendar className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-purple-600 group-hover:text-purple-700" />
                </div>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl group-hover:text-purple-700 transition-colors font-bold">📋 Government Schemes</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <CardDescription className="text-sm sm:text-base lg:text-lg leading-relaxed mb-4 text-gray-600 group-hover:text-gray-700">
                  Access <span className="font-bold text-purple-600">NMEO-OS</span> and other government schemes with easy application process
                </CardDescription>
                <Button size="sm" className="opacity-100 group-hover:scale-105 transition-all duration-500 bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl border-2 border-purple-500 hover:border-purple-400">
                  View Schemes →
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="text-center hover:shadow-2xl hover:scale-110 transition-all duration-500 border-0 shadow-xl sm:col-span-2 lg:col-span-1 cursor-pointer group bg-gradient-to-br from-white to-orange-50 relative overflow-hidden"
              onClick={() => window.location.href = '/weather'}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 sm:pb-6 relative z-10">
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-100 to-yellow-100 group-hover:from-orange-200 group-hover:to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                  <MapPin className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-orange-600 group-hover:text-orange-700" />
                </div>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl group-hover:text-orange-700 transition-colors font-bold">🌤️ Weather Insights</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <CardDescription className="text-sm sm:text-base lg:text-lg leading-relaxed mb-4 text-gray-600 group-hover:text-gray-700">
                  Get <span className="font-bold text-orange-600">accurate weather forecasts</span> and alerts to protect your crops and plan better
                </CardDescription>
                <Button size="sm" className="opacity-100 group-hover:scale-105 transition-all duration-500 bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl border-2 border-orange-500 hover:border-orange-400">
                  Check Weather →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Spectacular Stats Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-bounce"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          {/* Beautiful Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">Trusted by Thousands</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-green-100 font-medium">
              🌟 Join the farming revolution across India
            </p>
          </div>
          
          {/* Gorgeous Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 text-center">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 hover:bg-white/25 hover:scale-110 transition-all duration-500 shadow-2xl border border-white/20 group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">50K+</div>
              <div className="text-green-100 text-sm sm:text-base md:text-lg lg:text-xl font-semibold flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                Active Farmers
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 hover:bg-white/25 hover:scale-110 transition-all duration-500 shadow-2xl border border-white/20 group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">200+</div>
              <div className="text-green-100 text-sm sm:text-base md:text-lg lg:text-xl font-semibold flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5" />
                Market Centers
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 hover:bg-white/25 hover:scale-110 transition-all duration-500 shadow-2xl border border-white/20 group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">7.6K+</div>
              <div className="text-green-100 text-sm sm:text-base md:text-lg lg:text-xl font-semibold flex items-center justify-center gap-2">
                <Shield className="h-5 w-5" />
                FPOs Connected
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 hover:bg-white/25 hover:scale-110 transition-all duration-500 shadow-2xl border border-white/20 group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">₹2.5Cr+</div>
              <div className="text-green-100 text-sm sm:text-base md:text-lg lg:text-xl font-semibold flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Farmer Earnings
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Magnificent Final CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 relative overflow-hidden">
        {/* Stunning Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-br from-blue-300/30 to-violet-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-300/20 to-emerald-300/20 rounded-full blur-2xl animate-bounce"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-8 shadow-lg">
            <Star className="h-5 w-5 text-yellow-500 animate-spin" />
            <span className="text-sm font-bold text-gray-700">Join the Revolution</span>
            <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8">
            <span className="text-foreground">Ready to Transform</span>
            <span className="block text-primary">Your Farming? 🚀</span>
          </h2>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 mb-10 sm:mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
            🌟 Join <span className="font-black text-green-600">50,000+ farmers</span> who are already using Krishi Shift to <span className="font-black text-purple-600">increase their profits</span>
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 px-10 sm:px-14 lg:px-20 py-5 sm:py-6 text-lg sm:text-xl lg:text-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 rounded-2xl text-white border-0 relative overflow-hidden group"
            onClick={() => window.location.href = '/register'}
          >
            <span className="relative z-10 flex items-center gap-3">
              <Heart className="h-6 w-6 animate-pulse" />
              Start Your Journey Today
              <Zap className="h-6 w-6 animate-bounce" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Button>
          
          <div className="mt-8 flex justify-center items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-semibold">Trusted Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-sm font-semibold">Made for Farmers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Footer content grid - responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {/* Brand section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🌾</span>
                Krishi Shift
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Empowering farmers with technology and data-driven insights for better farming decisions.
              </p>
            </div>
            
            {/* Features links */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="/prices" className="hover:text-white transition-colors">Market Prices</a></li>
                <li><a href="/fpos" className="hover:text-white transition-colors">FPO Network</a></li>
                <li><a href="/schemes" className="hover:text-white transition-colors">Government Schemes</a></li>
                <li><a href="/weather" className="hover:text-white transition-colors">Weather Alerts</a></li>
              </ul>
            </div>
            
            {/* Support links */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
              </ul>
            </div>
            
            {/* Contact info */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>1800-XXX-XXXX</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <span className="break-all">support@krishishift.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🌐</span>
                  <span>www.krishishift.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Footer bottom */}
          <div className="border-t border-gray-800 mt-6 sm:mt-8 lg:mt-10 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
              &copy; 2024 Krishi Shift. All rights reserved. Built with ❤️ for Indian farmers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;