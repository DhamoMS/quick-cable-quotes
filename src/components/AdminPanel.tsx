
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Users,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface AdminPanelProps {
  userRole: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ userRole }) => {
  const [copperPrice, setCopperPrice] = useState(8.45);
  const [aluminumPrice, setAluminumPrice] = useState(2.15);

  // Mock data for pending approvals
  const pendingQuotes = [
    {
      id: 'Q001',
      customer: 'ABC Construction',
      agent: 'John Doe (Mini Agent)',
      amount: 12450,
      date: '2024-01-15',
      items: 8
    },
    {
      id: 'Q002', 
      customer: 'XYZ Electric',
      agent: 'Jane Smith (Mini Agent)',
      amount: 8920,
      date: '2024-01-14',
      items: 5
    }
  ];

  const recentApprovals = [
    {
      id: 'Q003',
      customer: 'Metro Infrastructure',
      amount: 45200,
      status: 'approved',
      approvedBy: 'Admin',
      date: '2024-01-14'
    },
    {
      id: 'Q004',
      customer: 'City Power',
      amount: 15680,
      status: 'rejected',
      approvedBy: 'Super Admin',
      date: '2024-01-13'
    }
  ];

  const updateMetalPrices = () => {
    // Mock API call to update prices
    console.log('Updating metal prices:', { copper: copperPrice, aluminum: aluminumPrice });
    alert('Metal prices updated successfully!');
  };

  const approveQuote = (quoteId: string) => {
    console.log('Approving quote:', quoteId);
    alert(`Quote ${quoteId} approved successfully!`);
  };

  const rejectQuote = (quoteId: string) => {
    console.log('Rejecting quote:', quoteId);
    alert(`Quote ${quoteId} rejected.`);
  };

  if (userRole !== 'Super Admin' && userRole !== 'Admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Access Denied</h3>
            <p className="text-slate-600">You don't have permission to access the Admin Panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Admin Panel</h2>
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {userRole}
        </Badge>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pricing">Metal Pricing</TabsTrigger>
          <TabsTrigger value="approvals">Quote Approvals</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Daily Metal Prices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="copper">Copper Price (per lb)</Label>
                    <div className="flex gap-2 mt-1">
                      <span className="text-sm text-slate-500">$</span>
                      <Input
                        id="copper"
                        type="number"
                        step="0.01"
                        value={copperPrice}
                        onChange={(e) => setCopperPrice(parseFloat(e.target.value))}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Last updated: Today 9:00 AM
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="aluminum">Aluminum Price (per lb)</Label>
                    <div className="flex gap-2 mt-1">
                      <span className="text-sm text-slate-500">$</span>
                      <Input
                        id="aluminum"
                        type="number"
                        step="0.01"
                        value={aluminumPrice}
                        onChange={(e) => setAluminumPrice(parseFloat(e.target.value))}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Last updated: Today 9:00 AM
                    </p>
                  </div>

                  <Button onClick={updateMetalPrices} className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Update Prices
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Price History (7 days)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Copper:</span>
                      <span className="text-green-600">+2.3% ↗</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Aluminum:</span>
                      <span className="text-red-600">-1.1% ↘</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Price changes will affect all new quotes. 
                      Existing quotes will maintain their original pricing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Approvals ({pendingQuotes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingQuotes.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No pending approvals</p>
                ) : (
                  <div className="space-y-4">
                    {pendingQuotes.map((quote) => (
                      <div key={quote.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{quote.id}</h4>
                            <p className="text-sm text-slate-600">{quote.customer}</p>
                            <p className="text-xs text-slate-500">{quote.agent}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${quote.amount.toLocaleString()}</p>
                            <p className="text-xs text-slate-500">{quote.items} items</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => approveQuote(quote.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => rejectQuote(quote.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Decisions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApprovals.map((quote) => (
                    <div key={quote.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{quote.id}</h4>
                          <p className="text-sm text-slate-600">{quote.customer}</p>
                          <p className="text-xs text-slate-500">by {quote.approvedBy}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${quote.amount.toLocaleString()}</p>
                          <Badge 
                            className={
                              quote.status === 'approved' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {quote.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tax">Default Tax Rate (%)</Label>
                  <Input id="tax" type="number" defaultValue="8.0" step="0.1" />
                </div>
                <div>
                  <Label htmlFor="freight">Free Freight Threshold ($)</Label>
                  <Input id="freight" type="number" defaultValue="5000" />
                </div>
                <div>
                  <Label htmlFor="markup">Default Markup (%)</Label>
                  <Input id="markup" type="number" defaultValue="25" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userRole === 'Super Admin' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Manage user roles and permissions
                    </p>
                    <Button variant="outline" className="w-full">
                      Manage Users
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Activity Logs
                    </Button>
                    <Button variant="outline" className="w-full">
                      System Backup
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Super Admin access required for user management.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
