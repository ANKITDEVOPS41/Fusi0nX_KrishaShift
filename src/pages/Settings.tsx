import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Smartphone, Moon, Sun, ArrowLeft, Save, CheckCircle } from 'lucide-react';

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState({
    language: 'english',
    currency: 'inr',
    location: 'maharashtra',
    priceAlerts: true,
    weatherAlerts: true,
    schemeUpdates: true,
    fpoNotifications: false,
    marketingMessages: false,
    twoFactor: false,
    biometricLogin: true,
    dataSharing: true,
    theme: 'system',
    offlineMode: true,
    autoSync: true,
    voiceCommands: false
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('krishi_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load saved settings
    const savedSettings = localStorage.getItem('krishi_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('krishi_settings', JSON.stringify(settings));
    setSaveStatus('saved');
    setHasChanges(false);
    
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'changePassword':
        alert('Password change functionality will redirect to secure page.');
        break;
      case 'downloadData':
        alert('Your data export will be emailed to your registered email address within 24 hours.');
        break;
      case 'helpCenter':
        alert('Help Center: Visit our website or call 1800-XXX-XXXX for support.');
        break;
      case 'contactSupport':
        alert('Support: Email support@krishishift.com or WhatsApp +91-XXXXX-XXXXX');
        break;
      case 'sendFeedback':
        alert('Feedback: Thank you! Your feedback helps us improve. Email feedback@krishishift.com');
        break;
      case 'rateApp':
        alert('Please rate us on Google Play Store or App Store. Your rating matters!');
        break;
      case 'deleteAccount':
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
          alert('Account deletion request submitted. You will receive a confirmation email.');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-700 flex items-center gap-2">
                ⚙️ Settings
              </h1>
              <p className="text-sm text-gray-600">
                {user ? `Welcome, ${user.name}` : 'Customize your experience'}
              </p>
            </div>
          </div>
          {hasChanges && (
            <Button 
              onClick={saveSettings}
              disabled={saveStatus === 'saving'}
              className="bg-green-600 hover:bg-green-700"
            >
              {saveStatus === 'saving' ? (
                <>
                  <SettingsIcon className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                    <SelectItem value="gujarati">ગુજરાતી (Gujarati)</SelectItem>
                    <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inr">₹ Indian Rupee (INR)</SelectItem>
                    <SelectItem value="usd">$ US Dollar (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={settings.location} onValueChange={(value) => handleSettingChange('location', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="andhra_pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="tamil_nadu">Tamil Nadu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Control what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Price Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when crop prices change significantly</p>
              </div>
              <Switch 
                checked={settings.priceAlerts} 
                onCheckedChange={(checked) => handleSettingChange('priceAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Weather Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive weather warnings and forecasts</p>
              </div>
              <Switch 
                checked={settings.weatherAlerts} 
                onCheckedChange={(checked) => handleSettingChange('weatherAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Scheme Updates</Label>
                <p className="text-sm text-muted-foreground">Government scheme deadlines and updates</p>
              </div>
              <Switch 
                checked={settings.schemeUpdates} 
                onCheckedChange={(checked) => handleSettingChange('schemeUpdates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">FPO Notifications</Label>
                <p className="text-sm text-muted-foreground">Updates from your connected FPOs</p>
              </div>
              <Switch 
                checked={settings.fpoNotifications} 
                onCheckedChange={(checked) => handleSettingChange('fpoNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Marketing Messages</Label>
                <p className="text-sm text-muted-foreground">Promotional offers and new features</p>
              </div>
              <Switch 
                checked={settings.marketingMessages} 
                onCheckedChange={(checked) => handleSettingChange('marketingMessages', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Biometric Login</Label>
                <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Data Sharing</Label>
                <p className="text-sm text-muted-foreground">Share anonymized data to improve services</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleAction('changePassword')}
              >
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleAction('downloadData')}
              >
                Download My Data
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              App Settings
            </CardTitle>
            <CardDescription>Customize app behavior and appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <SettingsIcon className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Offline Mode</Label>
                <p className="text-sm text-muted-foreground">Cache data for offline access</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Auto-sync</Label>
                <p className="text-sm text-muted-foreground">Automatically sync data when online</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Voice Commands</Label>
                <p className="text-sm text-muted-foreground">Enable voice input in Hindi</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
        
        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Feedback</CardTitle>
            <CardDescription>Get help and share your thoughts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-1"
                onClick={() => handleAction('helpCenter')}
              >
                <span className="text-sm font-medium">Help Center</span>
                <span className="text-xs text-muted-foreground">FAQs and guides</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-1"
                onClick={() => handleAction('contactSupport')}
              >
                <span className="text-sm font-medium">Contact Support</span>
                <span className="text-xs text-muted-foreground">Get technical help</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-1"
                onClick={() => handleAction('sendFeedback')}
              >
                <span className="text-sm font-medium">Send Feedback</span>
                <span className="text-xs text-muted-foreground">Share your experience</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-1"
                onClick={() => handleAction('rateApp')}
              >
                <span className="text-sm font-medium">Rate App</span>
                <span className="text-xs text-muted-foreground">Rate on app store</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => handleAction('deleteAccount')}
            >
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;