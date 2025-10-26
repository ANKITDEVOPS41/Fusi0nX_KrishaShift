import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { calculateProfitability, calculateRecommendation } from '@/lib/cropData';
import { Sparkles, TrendingUp, Droplets, Calendar, ArrowLeft, Calculator, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export default function CropCompare() {
  const [landSize, setLandSize] = useState('');
  const [currentCrop, setCurrentCrop] = useState('paddy');
  const [compareCrops, setCompareCrops] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const oilseeds = [
    { value: 'soybean', label: 'Soybean' },
    { value: 'groundnut', label: 'Groundnut' },
    { value: 'mustard', label: 'Mustard' },
    { value: 'sunflower', label: 'Sunflower' },
  ];

  const handleCompareToggle = (crop: string, checked: boolean) => {
    if (checked) {
      setCompareCrops([...compareCrops, crop]);
    } else {
      setCompareCrops(compareCrops.filter((c) => c !== crop));
    }
  };

  const handleCalculate = async () => {
    if (!landSize || parseFloat(landSize) <= 0) {
      toast.error('Please enter a valid land size');
      return;
    }

    if (compareCrops.length === 0) {
      toast.error('Please select at least one crop to compare');
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const size = parseFloat(landSize);
    const current = calculateProfitability(currentCrop, size);
    const compared = compareCrops.map((crop) => calculateProfitability(crop, size));
    const recommendation = calculateRecommendation(currentCrop, compareCrops, size);

    setResults({
      current,
      compared,
      recommendation,
    });

    setIsCalculating(false);
    toast.success('Profitability analysis complete!');
  };

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
            <Calculator className="h-5 w-5" />
            Compare Crops
          </h1>
          <div className="w-16"></div>
        </div>
      </div>

      <Header />

      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 lg:mb-8 hidden lg:block">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Crop Profitability Comparison
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground">
              Compare your current crop with oilseeds to discover better profit opportunities
            </p>
          </div>

          <Card className="mb-6 lg:mb-8 shadow-lg bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl lg:text-2xl flex items-center gap-2 text-card-foreground">
                <Calculator className="h-6 w-6 text-primary" />
                Enter Your Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="landSize" className="text-sm lg:text-base font-medium">
                    Land Size (acres) *
                  </Label>
                  <Input
                    id="landSize"
                    type="number"
                    placeholder="e.g., 2.5"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    className="mt-2 h-10 lg:h-11"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="currentCrop" className="text-sm lg:text-base font-medium">
                    Current Crop *
                  </Label>
                  <Select value={currentCrop} onValueChange={setCurrentCrop}>
                    <SelectTrigger className="mt-2 h-10 lg:h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paddy">🌾 Paddy</SelectItem>
                      <SelectItem value="sugarcane">🎋 Sugarcane</SelectItem>
                      <SelectItem value="maize">🌽 Maize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm lg:text-base font-medium mb-3 block">
                  Compare With (Select all that apply) *
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  {oilseeds.map((oilseed) => (
                    <div key={oilseed.value} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors">
                      <Checkbox
                        id={oilseed.value}
                        checked={compareCrops.includes(oilseed.value)}
                        onCheckedChange={(checked) =>
                          handleCompareToggle(oilseed.value, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={oilseed.value}
                        className="text-sm lg:text-base font-medium leading-none cursor-pointer flex-1 text-foreground"
                      >
                        {oilseed.value === 'soybean' && '🫘'} 
                        {oilseed.value === 'groundnut' && '🥜'} 
                        {oilseed.value === 'mustard' && '🌱'} 
                        {oilseed.value === 'sunflower' && '🌻'} 
                        {' '}{oilseed.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                size="lg"
                className="w-full lg:w-auto text-base lg:text-lg px-6 lg:px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <Calculator className="h-5 w-5 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Calculate Profitability
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {results && results.recommendation && (
            <Card className="mb-6 lg:mb-8 bg-primary/10 border-primary/20 shadow-lg">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <Sparkles className="h-8 w-8 lg:h-10 lg:w-10 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-3">
                      🎉 {results.recommendation.crop.toUpperCase()} is{' '}
                      {results.recommendation.profitIncrease}% MORE PROFITABLE than{' '}
                      {currentCrop.toUpperCase()}!
                    </h3>
                    <div className="space-y-2 lg:space-y-3">
                      {results.recommendation.waterSaved > 0 && (
                        <p className="flex items-center text-sm lg:text-base text-foreground">
                          <Droplets className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-blue-500" />
                          Saves {results.recommendation.waterSaved}mm water per acre
                        </p>
                      )}
                      <p className="text-base lg:text-lg font-semibold bg-card p-3 rounded-lg border border-border text-card-foreground">
                        💰 Total additional profit: ₹{results.recommendation.totalProfit.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {results && (
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl lg:text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  Detailed Comparison Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mobile-friendly cards for small screens */}
                <div className="block lg:hidden space-y-4">
                  {/* Current crop card */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-700">
                        {currentCrop.charAt(0).toUpperCase() + currentCrop.slice(1)} (Current)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Yield:</span>
                        <span className="text-sm">{results.current.yield} quintals/acre</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">MSP:</span>
                        <span className="text-sm">₹{results.current.msp.toLocaleString('en-IN')}/quintal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Revenue:</span>
                        <span className="text-sm">₹{results.current.revenue.toLocaleString('en-IN')}/acre</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Input Costs:</span>
                        <span className="text-sm">₹{results.current.inputCosts.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-bold">Net Profit:</span>
                        <span className="text-sm font-bold text-blue-700">₹{results.current.netProfit.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Water:</span>
                        <span className="text-sm">{results.current.water}mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="text-sm">{results.current.duration} days</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compared crops cards */}
                  {results.compared.map((crop: any) => (
                    <Card key={crop.crop} className="bg-green-50 border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-green-700">
                          {crop.crop.charAt(0).toUpperCase() + crop.crop.slice(1)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Yield:</span>
                          <span className="text-sm">{crop.yield} quintals/acre</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">MSP:</span>
                          <span className="text-sm">₹{crop.msp.toLocaleString('en-IN')}/quintal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Revenue:</span>
                          <span className="text-sm">₹{crop.revenue.toLocaleString('en-IN')}/acre</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Input Costs:</span>
                          <span className="text-sm">₹{crop.inputCosts.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-sm font-bold">Net Profit:</span>
                          <span className="text-sm font-bold text-green-700">₹{crop.netProfit.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Water:</span>
                          <span className="text-sm">{crop.water}mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Duration:</span>
                          <span className="text-sm">{crop.duration} days</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop table for larger screens */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left p-3 font-semibold text-sm lg:text-base">Metric</th>
                        <th className="text-left p-3 font-semibold bg-blue-50 text-blue-700 text-sm lg:text-base">
                          {currentCrop.charAt(0).toUpperCase() + currentCrop.slice(1)} (Current)
                        </th>
                        {results.compared.map((crop: any) => (
                          <th key={crop.crop} className="text-left p-3 font-semibold text-green-700 text-sm lg:text-base">
                            {crop.crop.charAt(0).toUpperCase() + crop.crop.slice(1)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium text-sm lg:text-base">Expected Yield (quintals/acre)</td>
                        <td className="p-3 bg-blue-50 text-sm lg:text-base">{results.current.yield}</td>
                        {results.compared.map((crop: any) => (
                          <td key={crop.crop} className="p-3 text-sm lg:text-base">
                            {crop.yield}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium text-sm lg:text-base">MSP (₹/quintal)</td>
                        <td className="p-3 bg-blue-50 text-sm lg:text-base">₹{results.current.msp.toLocaleString('en-IN')}</td>
                        {results.compared.map((crop: any) => (
                          <td key={crop.crop} className="p-3 text-sm lg:text-base">
                            ₹{crop.msp.toLocaleString('en-IN')}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium text-sm lg:text-base">Revenue/Acre</td>
                        <td className="p-3 bg-blue-50 text-sm lg:text-base">₹{results.current.revenue.toLocaleString('en-IN')}</td>
                        {results.compared.map((crop: any) => (
                          <td key={crop.crop} className="p-3 text-sm lg:text-base">
                            ₹{crop.revenue.toLocaleString('en-IN')}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium text-sm lg:text-base">Input Costs</td>
                        <td className="p-3 bg-blue-50 text-sm lg:text-base">₹{results.current.inputCosts.toLocaleString('en-IN')}</td>
                        {results.compared.map((crop: any) => (
                          <td key={crop.crop} className="p-3 text-sm lg:text-base">
                            ₹{crop.inputCosts.toLocaleString('en-IN')}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b bg-yellow-50 hover:bg-yellow-100">
                        <td className="p-3 font-bold text-sm lg:text-base">Net Profit/Acre</td>
                        <td className="p-3 bg-blue-100 font-bold text-blue-700 text-sm lg:text-base">
                          ₹{results.current.netProfit.toLocaleString('en-IN')}
                        </td>
                        {results.compared.map((crop: any) => (
                          <td key={crop.crop} className="p-3 font-bold text-green-700 text-sm lg:text-base">
                            ₹{crop.netProfit.toLocaleString('en-IN')}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium text-sm lg:text-base">Water Required (mm)</td>
                        <td className="p-3 bg-blue-50 text-sm lg:text-base">{results.current.water}</td>
                        {results.compared.map((crop: any) => (
                          <td key={crop.crop} className="p-3 text-sm lg:text-base">
                            {crop.water}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-sm lg:text-base">Duration (days)</td>
                        <td className="p-3 bg-blue-50 text-sm lg:text-base">{results.current.duration}</td>
                        {results.compared.map((crop: any) => (
                          <td key={crop.crop} className="p-3 text-sm lg:text-base">
                            {crop.duration}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
