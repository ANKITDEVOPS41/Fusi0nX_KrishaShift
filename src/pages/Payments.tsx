import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const Payments = () => {
  const transactions = [
    { id: '1', date: '2024-01-15', amount: 45000, status: 'completed', type: 'FPO Payment', description: 'Groundnut sale to Maharashtra FPO' },
    { id: '2', date: '2024-01-10', amount: 12000, status: 'pending', type: 'Scheme Subsidy', description: 'NMEO-OS subsidy payment' },
    { id: '3', date: '2024-01-05', amount: 28000, status: 'completed', type: 'Direct Sale', description: 'Sunflower seeds to local trader' },
    { id: '4', date: '2024-01-01', amount: 5000, status: 'failed', type: 'Insurance', description: 'Crop insurance premium' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-700">💳 Payment Dashboard</h1>
          <p className="text-muted-foreground">Manage your payments and transactions</p>
        </div>
        
        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹90,000</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">₹12,000</div>
              <p className="text-xs text-muted-foreground">1 transaction</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-xs text-muted-foreground">Active methods</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    🏦
                  </div>
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">HDFC Bank ****1234</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">Primary</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    📱
                  </div>
                  <div>
                    <p className="font-medium">UPI</p>
                    <p className="text-sm text-muted-foreground">farmer@paytm</p>
                  </div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    💳
                  </div>
                  <div>
                    <p className="font-medium">Digital Wallet</p>
                    <p className="text-sm text-muted-foreground">PhonePe Wallet</p>
                  </div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.type} • {transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{transaction.amount.toLocaleString()}</p>
                    <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
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
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Request Payment</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <CreditCard className="h-6 w-6" />
                <span className="text-sm">Add Payment Method</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Clock className="h-6 w-6" />
                <span className="text-sm">Payment History</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <CheckCircle className="h-6 w-6" />
                <span className="text-sm">Verify Payment</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;