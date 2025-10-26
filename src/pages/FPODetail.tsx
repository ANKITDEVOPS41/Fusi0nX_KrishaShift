import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getFPOById } from '@/lib/fpoData';
import { MapPin, Star, Users, Phone, Building2, TrendingUp, ArrowLeft } from 'lucide-react';

export default function FPODetail() {
  const { id } = useParams();
  const fpo = getFPOById(Number(id));

  if (!fpo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">FPO Not Found</h1>
          <Link to="/fpos">
            <Button>Back to FPO List</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/fpos">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to FPOs
            </Button>
          </Link>

          <Card className="shadow-strong mb-6">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{fpo.name}</CardTitle>
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{fpo.district} District • {fpo.distance} km away</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <Star className="h-5 w-5 text-secondary fill-current mr-1" />
                      <span className="font-semibold text-lg">{fpo.rating}</span>
                      <span className="text-muted-foreground ml-1">/5</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{fpo.members} members</span>
                    </div>
                  </div>
                </div>
                <Button size="lg" className="mt-4 md:mt-0">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact FPO
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Established</p>
                <p className="text-2xl font-bold">{fpo.established || 'N/A'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Members</p>
                <p className="text-2xl font-bold">{fpo.members}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Annual Turnover</p>
                <p className="text-2xl font-bold">{fpo.turnover || 'N/A'}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fpo.services.map((service, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-success mr-2 mt-1">✓</span>
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crops Handled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {fpo.crops.map((crop) => (
                  <Badge key={crop} variant="secondary" className="text-base px-4 py-2">
                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {fpo.reviews && fpo.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Member Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fpo.reviews.map((review, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-secondary fill-current'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{review.farmer}</span>
                    </div>
                    <p className="text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="mt-6 bg-accent/50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-semibold mb-1">Contact Information</p>
                  <p className="text-lg font-mono">{fpo.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
