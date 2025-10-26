import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { filterFPOs } from '@/lib/fpoData';
import { MapPin, Star, Users, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

export default function FPOs() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');

  const fpos = filterFPOs(selectedDistrict, selectedCrop);

  const districts = ['Indore', 'Rajkot', 'Jaipur'];
  const crops = ['soybean', 'groundnut', 'mustard', 'sunflower'];

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
            <Users className="h-5 w-5" />
            FPO Network
          </h1>
          <div className="w-16"></div>
        </div>
      </div>

      <Header />

      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 lg:mb-8 hidden lg:block">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Find Farmer Producer Organizations
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground">
              Connect with verified FPOs for assured procurement and better prices
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6 lg:mb-8 shadow-lg bg-card border-border">
            <CardContent className="p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">📍 District</label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="h-10 lg:h-11">
                      <SelectValue placeholder="All Districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">🌾 Crop</label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger className="h-10 lg:h-11">
                      <SelectValue placeholder="All Crops" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Crops</SelectItem>
                      {crops.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop === 'soybean' && '🫘'} 
                          {crop === 'groundnut' && '🥜'} 
                          {crop === 'mustard' && '🌱'} 
                          {crop === 'sunflower' && '🌻'} 
                          {' '}{crop.charAt(0).toUpperCase() + crop.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Found {fpos.length} FPOs matching your criteria
              </div>
            </CardContent>
          </Card>

          {/* FPO List */}
          <div className="space-y-4 lg:space-y-6">
            {fpos.length === 0 ? (
              <Card className="shadow-lg bg-card border-border">
                <CardContent className="p-8 lg:p-12 text-center">
                  <div className="text-6xl mb-4">🏢</div>
                  <p className="text-lg text-muted-foreground mb-4">
                    No FPOs found matching your criteria.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting the filters or contact us to add more FPOs in your area.
                  </p>
                </CardContent>
              </Card>
            ) : (
              fpos.map((fpo) => (
                <Card key={fpo.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] bg-card border-border">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                          <div className="flex-1">
                            <h3 className="text-xl lg:text-2xl font-bold text-card-foreground mb-2 flex items-center gap-2">
                              🏢 {fpo.name}
                            </h3>
                            <div className="flex items-center text-muted-foreground text-sm lg:text-base">
                              <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                              <span>{fpo.district} District • {fpo.distance} km away</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-500 fill-current mr-1" />
                            <span className="font-semibold text-base lg:text-lg">{fpo.rating}</span>
                            <span className="text-muted-foreground ml-1 text-sm">/5</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users className="h-4 w-4 mr-1 text-green-600" />
                            <span className="text-sm lg:text-base">{fpo.members} members</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold mb-2 flex items-center text-sm lg:text-base">
                            <span className="text-green-600 mr-1">✓</span> Services:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {fpo.services.map((service, index) => (
                              <div key={index} className="text-muted-foreground flex items-start text-sm lg:text-base">
                                <span className="mr-2 text-green-600">•</span>
                                <span>{service}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {fpo.crops.map((crop) => (
                            <Badge key={crop} variant="secondary" className="text-xs lg:text-sm">
                              {crop === 'soybean' && '🫘'} 
                              {crop === 'groundnut' && '🥜'} 
                              {crop === 'mustard' && '🌱'} 
                              {crop === 'sunflower' && '🌻'} 
                              {' '}{crop.charAt(0).toUpperCase() + crop.slice(1)}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center text-muted-foreground text-sm lg:text-base">
                          <Phone className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="font-mono">{fpo.phone}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-40">
                        <Button asChild className="flex-1 lg:flex-none">
                          <Link to={`/fpos/${fpo.id}`}>
                            <span className="lg:hidden">Details</span>
                            <span className="hidden lg:inline">View Details</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 lg:flex-none"
                          onClick={() => window.open(`tel:${fpo.phone}`)}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          <span className="lg:hidden">Call</span>
                          <span className="hidden lg:inline">Contact FPO</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
