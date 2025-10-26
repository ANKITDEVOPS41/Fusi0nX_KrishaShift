import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Phone, Mail, Award, TrendingUp } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-700">👨‍🌾 Farmer Profile</h1>
          <p className="text-muted-foreground">Manage your farming profile and achievements</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Ramesh Kumar</h3>
                  <p className="text-sm text-muted-foreground">Farmer</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">ramesh.kumar@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Kharif Village, Pune, Maharashtra</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Farm Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">5.2</div>
                  <div className="text-sm text-muted-foreground">Acres</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-muted-foreground">Crops</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">₹2.5L</div>
                  <div className="text-sm text-muted-foreground">Annual Income</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">85%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  🌱 Early Adopter
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  📊 Data Driven
                </Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  🏆 Top Performer
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  🤝 Community Helper
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Current Crops</CardTitle>
              <CardDescription>Crops you're currently growing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">🥜 Groundnut</span>
                  <Badge variant="outline" className="text-green-600">Growing</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">🌻 Sunflower</span>
                  <Badge variant="outline" className="text-yellow-600">Flowering</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">🫘 Soybean</span>
                  <Badge variant="outline" className="text-blue-600">Harvested</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center">
          <Button className="bg-green-600 hover:bg-green-700">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;