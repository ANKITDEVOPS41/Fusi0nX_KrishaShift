import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { schemes } from '@/lib/schemeData';
import { CheckCircle2, Gift, Shield, Wrench, GraduationCap, ExternalLink, ArrowLeft, Users, Phone } from 'lucide-react';

const categoryIcons = {
  subsidy: Gift,
  insurance: Shield,
  equipment: Wrench,
  training: GraduationCap,
};

const categoryColors = {
  subsidy: 'bg-success/10 text-success border-success',
  insurance: 'bg-primary/10 text-primary border-primary',
  equipment: 'bg-warning/10 text-warning border-warning',
  training: 'bg-secondary/10 text-secondary border-secondary',
};

export default function Schemes() {
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
            <Gift className="h-5 w-5" />
            Schemes
          </h1>
          <div className="w-16"></div>
        </div>
      </div>

      <Header />

      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 lg:mb-8 hidden lg:block">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Gift className="h-8 w-8 text-primary" />
              Government Schemes
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground">
              Access subsidies, insurance, and financial support programs for oilseed farming
            </p>
          </div>

          <Card className="mb-6 lg:mb-8 bg-primary/10 border-primary/20 shadow-lg">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <CheckCircle2 className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-semibold mb-2 text-primary">
                    🎉 You may be eligible for multiple schemes!
                  </h3>
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Review each scheme's eligibility criteria below. Many schemes can be combined to maximize your benefits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {schemes.map((scheme) => {
              const Icon = categoryIcons[scheme.category];
              const colorClass = categoryColors[scheme.category];

              const getCategoryEmoji = (category: string) => {
                switch(category) {
                  case 'subsidy': return '💰';
                  case 'insurance': return '🛡️';
                  case 'equipment': return '🚜';
                  case 'training': return '🎓';
                  default: return '📋';
                }
              };

              return (
                <Card key={scheme.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-card border-border">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-lg border ${colorClass} flex items-center justify-center`}>
                        <span className="text-2xl">{getCategoryEmoji(scheme.category)}</span>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs lg:text-sm">
                        {scheme.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg lg:text-2xl leading-tight text-card-foreground">{scheme.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-500/10 p-3 lg:p-4 rounded-lg border border-blue-500/20">
                      <p className="text-xs lg:text-sm text-blue-400 mb-1 font-medium">Benefit</p>
                      <p className="font-semibold text-foreground text-sm lg:text-base">{scheme.benefit}</p>
                    </div>

                    <div className="bg-primary/10 p-3 lg:p-4 rounded-lg border border-primary/20">
                      <p className="text-xs lg:text-sm text-primary mb-1 font-medium">Maximum Amount</p>
                      <p className="text-xl lg:text-2xl font-bold text-primary">
                        {typeof scheme.maxAmount === 'number'
                          ? `₹${scheme.maxAmount.toLocaleString('en-IN')}`
                          : scheme.maxAmount}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold mb-3 flex items-center text-sm lg:text-base text-foreground">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                        Eligibility Criteria
                      </p>
                      <ul className="space-y-2">
                        {scheme.eligibility.map((criteria, index) => (
                          <li key={index} className="flex items-start text-xs lg:text-sm text-muted-foreground">
                            <span className="mr-2 mt-0.5 text-primary">•</span>
                            <span>{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                      variant="default"
                      onClick={() => alert(`More information about ${scheme.name} will be available soon. Contact your local agriculture office for immediate assistance.`)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Learn More & Apply
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-6 lg:mt-8 bg-blue-500/10 border-blue-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <span className="text-2xl">🤝</span>
                Need Help Applying?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm lg:text-base">
                Many schemes require specific documentation and application procedures. Contact your local 
                agriculture office or FPO for assistance with applications. FPOs often help members navigate 
                the application process and ensure all required documents are in order.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 hover:bg-accent border-border"
                  onClick={() => window.location.href = '/fpos'}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Find Nearby FPO
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 hover:bg-accent border-border"
                  onClick={() => alert('Contact your local agriculture office:\n\n📞 Toll-free: 1800-180-1551\n🌐 Visit: agricoop.gov.in\n📧 Email: support@agricoop.gov.in')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Agriculture Office
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
