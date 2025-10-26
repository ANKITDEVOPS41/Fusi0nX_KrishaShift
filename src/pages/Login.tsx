import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, Mail, Lock, Eye, EyeOff, ArrowLeft, Fingerprint, Loader2, CheckCircle, AlertCircle, Sparkles, Star, Shield } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [formData, setFormData] = useState({
    contact: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{contact?: string; password?: string}>({});
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const validateForm = () => {
    const newErrors: {contact?: string; password?: string} = {};
    
    if (!formData.contact) {
      newErrors.contact = `${loginMethod === 'phone' ? 'Phone number' : 'Email'} is required`;
    } else if (loginMethod === 'phone') {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.contact.replace(/\D/g, ''))) {
        newErrors.contact = 'Please enter a valid 10-digit phone number';
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contact)) {
        newErrors.contact = 'Please enter a valid email address';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setLoginStatus('idle');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoginStatus('success');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', 'farmer');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (error) {
      setLoginStatus('error');
      setErrors({ password: 'Invalid credentials. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!('credentials' in navigator)) {
      alert('🔒 Biometric authentication is not supported on this device.');
      return;
    }
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoginStatus('success');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', 'farmer');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      alert('❌ Biometric authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-cyan-50 to-violet-100 flex items-center justify-center p-3 sm:p-4 lg:p-8 relative overflow-hidden">
      {/* Stunning Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl animate-bounce"></div>
      </div>
      {/* Beautiful Back Button */}
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full px-4 py-2 border border-white/20"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2 text-gray-700" />
        <span className="hidden sm:inline text-gray-700 font-semibold">Back</span>
      </Button>

      {/* Spectacular Login Card */}
      <Card className={`w-full max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur-xl relative overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`}>
        {/* Card Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-xl"></div>
        
        <CardHeader className="text-center pb-6 sm:pb-8 relative z-10">
          <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full mb-4 shadow-lg">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-xs font-semibold text-gray-700">Secure Login</span>
            <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
          </div>
          
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <span className="text-3xl sm:text-4xl animate-bounce">🌾</span>
              Krishi Shift
              <Star className="h-6 w-6 text-yellow-500 animate-spin" />
            </span>
          </CardTitle>
          
          <CardDescription className="text-sm sm:text-base lg:text-lg text-gray-600 mt-3 font-medium">
            🚀 Sign in to access your <span className="text-green-600 font-bold">farming dashboard</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 sm:space-y-8 relative z-10">
          {/* Beautiful Login Method Toggle */}
          <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-1.5 shadow-inner border border-gray-200">
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                loginMethod === 'phone' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-white/50'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              Phone
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                loginMethod === 'email' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
          </div>

          {/* Beautiful Contact Input */}
          <div className="space-y-3">
            <Label htmlFor="contact" className="text-sm sm:text-base font-bold text-gray-700 flex items-center gap-2">
              {loginMethod === 'phone' ? (
                <>
                  <Smartphone className="h-4 w-4 text-green-600" />
                  Phone Number
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 text-blue-600" />
                  Email Address
                </>
              )}
            </Label>
            <div className="relative">
              {loginMethod === 'phone' ? (
                <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              ) : (
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
              )}
              <Input
                id="contact"
                type={loginMethod === 'phone' ? 'tel' : 'email'}
                placeholder={loginMethod === 'phone' ? '+91 98765 43210' : 'farmer@example.com'}
                className={`pl-12 pr-4 h-12 sm:h-14 text-sm sm:text-base rounded-2xl border-2 transition-all duration-300 font-medium shadow-lg ${
                  errors.contact 
                    ? 'border-red-400 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-green-400 hover:border-green-300 bg-white/80 backdrop-blur-sm'
                }`}
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.contact && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {errors.contact}
              </p>
            )}
          </div>
          
          {/* Stunning Password Input */}
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm sm:text-base font-bold text-gray-700 flex items-center gap-2">
              <Lock className="h-4 w-4 text-purple-600" />
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`pl-12 pr-14 h-12 sm:h-14 text-sm sm:text-base rounded-2xl border-2 transition-all duration-300 font-medium shadow-lg ${
                  errors.password 
                    ? 'border-red-400 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-purple-400 hover:border-purple-300 bg-white/80 backdrop-blur-sm'
                }`}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 disabled:opacity-50 transition-colors duration-300"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Elegant Forgot Password */}
          <div className="text-right">
            <Button variant="link" className="text-sm sm:text-base p-0 h-auto text-green-600 hover:text-green-700 font-semibold hover:underline transition-all duration-300">
              🔑 Forgot password?
            </Button>
          </div>
          
          {/* Spectacular Sign In Button */}
          <Button 
            className={`w-full h-12 sm:h-14 text-base sm:text-lg font-black shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl relative overflow-hidden group ${
              loginStatus === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-500 hover:to-emerald-500' 
                : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transform hover:scale-105 hover:-translate-y-1'
            }`}
            onClick={handleLogin}
            disabled={isLoading || loginStatus === 'success'}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : loginStatus === 'success' ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Success! Redirecting...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  Sign In
                  <Star className="h-4 w-4 animate-spin" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>

          {/* Beautiful Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm sm:text-base">
              <span className="bg-white px-4 py-1 text-gray-600 font-semibold rounded-full shadow-sm border border-gray-200">or</span>
            </div>
          </div>

          {/* Gorgeous Biometric Button */}
          <Button 
            variant="outline" 
            className="w-full h-12 sm:h-14 text-base sm:text-lg border-3 border-purple-200 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 rounded-2xl shadow-lg hover:shadow-2xl group font-bold"
            onClick={handleBiometricLogin}
            disabled={isLoading || loginStatus === 'success'}
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Fingerprint className="h-5 w-5 text-purple-600 group-hover:animate-pulse" />
                  Use Biometric Login
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-bounce" />
                </>
              )}
            </span>
          </Button>
          
          {/* Beautiful Register Link */}
          <div className="text-center pt-4">
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="text-sm sm:text-base p-0 h-auto text-green-600 hover:text-green-700 font-bold hover:underline transition-all duration-300"
                onClick={() => window.location.href = '/register'}
              >
                🚀 Register here
              </Button>
            </p>
          </div>

          {/* Elegant Help Section */}
          <div className="text-center pt-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 font-medium flex items-center justify-center gap-2">
              <span>📞 Need help? Call</span>
              <a 
                href="tel:1800-XXX-XXXX" 
                className="text-green-600 hover:text-green-700 font-bold hover:underline transition-all duration-300"
              >
                1800-XXX-XXXX
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;