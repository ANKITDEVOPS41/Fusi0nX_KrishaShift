import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingUp, CloudRain, Calendar, DollarSign, Settings } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: '1',
      type: 'price_alert',
      title: 'Price Alert: Groundnut',
      message: 'Groundnut price increased to ₹5,450/quintal in Pune Mandi (+2.5%)',
      timestamp: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'weather_alert',
      title: 'Weather Alert',
      message: 'Heavy rainfall expected in next 3 days (50-80mm). Prepare drainage systems.',
      timestamp: '4 hours ago',
      read: false,
      priority: 'urgent'
    },
    {
      id: '3',
      type: 'scheme_deadline',
      title: 'Scheme Deadline Reminder',
      message: 'NMEO-OS subsidy application deadline in 5 days. Apply now to avoid missing out.',
      timestamp: '1 day ago',
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'fpo_payment',
      title: 'Payment Received',
      message: '₹45,000 received from Maharashtra FPO for groundnut sale. Transaction ID: TXN123456',
      timestamp: '2 days ago',
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'system',
      title: 'App Update Available',
      message: 'New features available! Update to get improved price predictions and weather alerts.',
      timestamp: '3 days ago',
      read: true,
      priority: 'low'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'price_alert':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'weather_alert':
        return <CloudRain className="h-5 w-5 text-blue-600" />;
      case 'scheme_deadline':
        return <Calendar className="h-5 w-5 text-orange-600" />;
      case 'fpo_payment':
        return <DollarSign className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">🔔 Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
        
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Customize what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Price Alerts</p>
                    <p className="text-sm text-muted-foreground">Market price changes</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CloudRain className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Weather Alerts</p>
                    <p className="text-sm text-muted-foreground">Weather warnings</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">Enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Scheme Updates</p>
                    <p className="text-sm text-muted-foreground">Government schemes</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">Enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Payment Updates</p>
                    <p className="text-sm text-muted-foreground">Transaction alerts</p>
                  </div>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Notifications</CardTitle>
              <Button variant="ghost" size="sm">
                Mark all as read
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-background'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-sm">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(notification.priority)}`}
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>
                        
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" className="text-xs h-6">
                              Mark as read
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-xs h-6">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <TrendingUp className="h-5 w-5" />
                <span className="text-xs">Set Price Alert</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <CloudRain className="h-5 w-5" />
                <span className="text-xs">Weather Alerts</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Scheme Reminders</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <Settings className="h-5 w-5" />
                <span className="text-xs">Notification Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;