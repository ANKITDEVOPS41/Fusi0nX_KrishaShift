import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, MapPin, RefreshCw, ArrowLeft, Bell, Search, AlertTriangle } from 'lucide-react';

const Weather = () => {
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'temperature',
      severity: 'high',
      title: 'High Temperature Alert',
      message: 'Temperature expected to reach 42°C tomorrow. Ensure adequate irrigation for crops.',
      icon: Thermometer,
      color: 'orange'
    },
    {
      id: 2,
      type: 'rainfall',
      severity: 'medium',
      title: 'Heavy Rainfall Forecast',
      message: 'Heavy rainfall (50-80mm) expected in next 3 days. Prepare drainage systems.',
      icon: CloudRain,
      color: 'blue'
    }
  ]);

  const [currentWeather, setCurrentWeather] = useState({
    temperature: 32,
    feelsLike: 35,
    condition: 'Sunny',
    icon: Sun,
    wind: 12,
    humidity: 65,
    rainfall: 0,
    uvIndex: 8
  });

  const forecast = [
    { day: 'Today', icon: Sun, high: 32, low: 24, desc: 'Sunny', rain: 0 },
    { day: 'Tomorrow', icon: Cloud, high: 35, low: 26, desc: 'Partly Cloudy', rain: 10 },
    { day: 'Wed', icon: CloudRain, high: 28, low: 22, desc: 'Rainy', rain: 65 },
    { day: 'Thu', icon: CloudRain, high: 26, low: 20, desc: 'Heavy Rain', rain: 85 },
    { day: 'Fri', icon: Cloud, high: 30, low: 23, desc: 'Cloudy', rain: 20 },
    { day: 'Sat', icon: Sun, high: 33, low: 25, desc: 'Sunny', rain: 0 },
    { day: 'Sun', icon: Sun, high: 34, low: 26, desc: 'Clear', rain: 0 },
  ];

  const refreshWeather = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate weather update
    setCurrentWeather(prev => ({
      ...prev,
      temperature: prev.temperature + (Math.random() - 0.5) * 4,
      humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 10))
    }));
    
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const searchWeather = () => {
    if (searchLocation.trim()) {
      setLocation(searchLocation);
      setSearchLocation('');
      refreshWeather();
    }
  };

  const getUVIndexColor = (index: number) => {
    if (index <= 2) return 'text-green-600';
    if (index <= 5) return 'text-yellow-600';
    if (index <= 7) return 'text-orange-600';
    return 'text-red-600';
  };

  const getUVIndexLabel = (index: number) => {
    if (index <= 2) return 'Low';
    if (index <= 5) return 'Moderate';
    if (index <= 7) return 'High';
    return 'Very High';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-700 flex items-center gap-2">
                🌤️ Weather Dashboard
              </h1>
              <p className="text-sm text-gray-600">Last updated: {lastUpdated.toLocaleTimeString()}</p>
            </div>
          </div>
          <Button 
            onClick={refreshWeather}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Location Search */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search location (e.g., Mumbai, Delhi, Bangalore)"
                  className="pl-10"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchWeather()}
                />
              </div>
              <Button onClick={searchWeather} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              Current location: {location}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Current Weather - {location}
              </CardTitle>
              <CardDescription>Live weather conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <currentWeather.icon className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-500" />
                  <div className="text-center sm:text-left">
                    <div className="text-4xl sm:text-5xl font-bold">{Math.round(currentWeather.temperature)}°C</div>
                    <div className="text-muted-foreground text-lg">{currentWeather.condition}</div>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-sm text-muted-foreground">Feels like</div>
                  <div className="text-2xl sm:text-3xl font-semibold">{Math.round(currentWeather.feelsLike)}°C</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Wind className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Wind Speed</div>
                    <div className="font-semibold">{currentWeather.wind} km/h</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="font-semibold">{Math.round(currentWeather.humidity)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <CloudRain className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Rainfall</div>
                    <div className="font-semibold">{currentWeather.rainfall} mm</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">UV Index</div>
                    <div className={`font-semibold ${getUVIndexColor(currentWeather.uvIndex)}`}>
                      {currentWeather.uvIndex} ({getUVIndexLabel(currentWeather.uvIndex)})
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 bg-${alert.color}-50 border border-${alert.color}-200 rounded-lg`}>
                  <div className="flex items-start gap-2 mb-2">
                    <alert.icon className={`h-4 w-4 text-${alert.color}-600 mt-0.5`} />
                    <Badge variant="secondary" className={`bg-${alert.color}-100 text-${alert.color}-700`}>
                      {alert.title}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => alert('Weather alert notifications will be sent to your registered mobile number.')}
              >
                <Bell className="h-4 w-4 mr-2" />
                Enable Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>7-Day Forecast</CardTitle>
            <CardDescription>Weather outlook for the week ahead</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                  <div className="font-medium text-sm mb-3 text-gray-700">{day.day}</div>
                  <day.icon className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {day.high}°/{day.low}°
                    </div>
                    <div className="text-xs text-muted-foreground">{day.desc}</div>
                    {day.rain > 0 && (
                      <div className="text-xs text-blue-600 font-medium">
                        {day.rain}% rain
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Farming Tips based on weather */}
        <Card className="shadow-lg bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <AlertTriangle className="h-5 w-5" />
              Farming Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-800">Today's Actions:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>High temperature expected - increase irrigation frequency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>UV index is high - protect workers with proper clothing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Good conditions for harvesting mature crops</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-800">This Week:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Heavy rain expected Wed-Thu - prepare drainage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Avoid spraying pesticides during rainy days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Good time for sowing after rain stops</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Weather;