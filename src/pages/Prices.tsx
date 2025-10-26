import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mandiPrices, getPriceStatus } from '@/lib/mandiData';
import { TrendingUp, TrendingDown, Minus, MapPin, ArrowLeft, RefreshCw, Bell } from 'lucide-react';

export default function Prices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/20 to-blue-900/20 dark:from-green-950/30 dark:to-blue-950/30">
      {/* Mobile-friendly Header */}
      <div className="bg-background/95 backdrop-blur-sm shadow-sm border-b border-border px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.history.back()}
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-bold text-primary flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Prices
          </h1>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.location.reload()}
            className="text-foreground hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Header />

      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 lg:mb-8 hidden lg:block">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  Mandi Price Dashboard
                </h1>
                <p className="text-base lg:text-lg text-muted-foreground">
                  Live market prices, MSP tracking, and trend analysis for oilseed crops
                </p>
              </div>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Prices
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {Object.entries(mandiPrices).map(([crop, locations]) =>
              Object.entries(locations).map(([location, data]) => {
                const status = getPriceStatus(data.price, data.msp);
                const latestTrend = data.trend[data.trend.length - 1];
                const previousTrend = data.trend[data.trend.length - 2];
                const trendDirection = latestTrend > previousTrend ? 'up' : latestTrend < previousTrend ? 'down' : 'neutral';

                const getCropEmoji = (cropName: string) => {
                  switch(cropName) {
                    case 'groundnut': return '🥜';
                    case 'sunflower': return '🌻';
                    case 'soybean': return '🫘';
                    case 'mustard': return '🌱';
                    default: return '🌾';
                  }
                };

                return (
                  <Card key={`${crop}-${location}`} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-card border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg lg:text-2xl capitalize mb-1 flex items-center gap-2 text-card-foreground">
                            <span className="text-2xl">{getCropEmoji(crop)}</span>
                            {crop}
                          </CardTitle>
                          <div className="flex items-center text-muted-foreground text-sm lg:text-base">
                            <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            <span className="capitalize">{location} Mandi</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {trendDirection === 'up' && <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-green-500" />}
                          {trendDirection === 'down' && <TrendingDown className="h-5 w-5 lg:h-6 lg:w-6 text-red-500" />}
                          {trendDirection === 'neutral' && <Minus className="h-5 w-5 lg:h-6 lg:w-6 text-muted-foreground" />}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-accent"
                            onClick={() => alert(`Price alert set for ${crop} in ${location}`)}
                          >
                            <Bell className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                          <p className="text-3xl font-bold text-foreground">
                            ₹{data.price.toLocaleString('en-IN')}<span className="text-base font-normal">/quintal</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between py-3 border-y">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">MSP</p>
                            <p className="text-lg font-semibold">
                              ₹{data.msp.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <Badge
                            variant={status.status === 'above' ? 'default' : 'destructive'}
                            className={
                              status.status === 'above'
                                ? 'bg-success hover:bg-success/90'
                                : ''
                            }
                          >
                            {status.status === 'above' ? '▲' : '▼'} {status.percentage}%{' '}
                            {status.status === 'above' ? 'ABOVE' : 'BELOW'} MSP
                          </Badge>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-3">7-Day Price Trend</p>
                          <div className="flex items-end justify-between h-16 space-x-1">
                            {data.trend.map((price, index) => {
                              const maxPrice = Math.max(...data.trend);
                              const minPrice = Math.min(...data.trend);
                              const range = maxPrice - minPrice;
                              const height = range > 0 ? ((price - minPrice) / range) * 100 : 50;

                              return (
                                <div
                                  key={index}
                                  className="flex-1 bg-primary rounded-t transition-all hover:bg-primary/80"
                                  style={{ height: `${Math.max(height, 10)}%` }}
                                  title={`₹${price}`}
                                />
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>7 days ago</span>
                            <span>Today</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <Card className="mt-8 bg-warning/10 border-warning shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center text-warning">
                <TrendingDown className="h-6 w-6 mr-2" />
                MSP Reality Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-foreground font-medium">
                  📊 While government announces MSP, actual procurement varies by state and crop.
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Solution:</span> Connect with FPOs (Farmer Producer Organizations) 
                  who often offer better and more reliable prices than mandis. Many FPOs guarantee MSP or above 
                  with quick payments.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
