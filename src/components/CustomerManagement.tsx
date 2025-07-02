
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Users, Building, MapPin, Phone, Mail, Download } from 'lucide-react';
import { generateCustomerListPDF, CustomerData } from '@/lib/pdfUtils';

interface CustomerManagementProps {
  userRole: string;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock customer data
  const customers = [
    {
      id: 'CUST001',
      name: 'ABC Construction Co.',
      contact: 'John Smith',
      email: 'john@abcconstruction.com',
      phone: '(555) 123-4567',
      address: '123 Main St, City, ST 12345',
      tier: 'A',
      discount: 15,
      paymentTerms: 'Net 30',
      totalOrders: 45,
      yearlyVolume: 125000
    },
    {
      id: 'CUST002',
      name: 'XYZ Electric Services',
      contact: 'Sarah Johnson',
      email: 'sarah@xyzelectric.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Town, ST 67890',
      tier: 'B',
      discount: 10,
      paymentTerms: 'Net 15',
      totalOrders: 32,
      yearlyVolume: 87500
    },
    {
      id: 'CUST003',
      name: 'Metro Infrastructure',
      contact: 'Mike Wilson',
      email: 'mike@metroinfra.com',
      phone: '(555) 456-7890',
      address: '789 Pine Rd, Metro, ST 11111',
      tier: 'A',
      discount: 18,
      paymentTerms: 'Net 45',
      totalOrders: 67,
      yearlyVolume: 245000
    },
    {
      id: 'CUST004',
      name: 'City Power Solutions',
      contact: 'Lisa Davis',
      email: 'lisa@citypowersolutions.com',
      phone: '(555) 321-0987',
      address: '321 Elm St, Downtown, ST 22222',
      tier: 'B',
      discount: 12,
      paymentTerms: 'Net 30',
      totalOrders: 28,
      yearlyVolume: 65000
    },
    {
      id: 'CUST005',
      name: 'Residential Wiring LLC',
      contact: 'Tom Brown',
      email: 'tom@residentialwiring.com',
      phone: '(555) 654-3210',
      address: '654 Maple Dr, Suburb, ST 33333',
      tier: 'C',
      discount: 5,
      paymentTerms: 'Net 15',
      totalOrders: 15,
      yearlyVolume: 32000
    },
    {
      id: 'CUST006',
      name: 'Industrial Systems Corp',
      contact: 'Amanda White',
      email: 'amanda@industrialsystems.com',
      phone: '(555) 789-0123',
      address: '987 Industrial Blvd, Factory, ST 44444',
      tier: 'A',
      discount: 20,
      paymentTerms: 'Net 60',
      totalOrders: 89,
      yearlyVolume: 456000
    }
  ];

  const tiers = ['all', 'A', 'B', 'C', 'D', 'E'];

  const getTierInfo = (tier: string) => {
    const tierConfig = {
      'A': { color: 'bg-green-100 text-green-800', description: 'Premium - Highest Volume' },
      'B': { color: 'bg-blue-100 text-blue-800', description: 'Gold - High Volume' },
      'C': { color: 'bg-yellow-100 text-yellow-800', description: 'Silver - Medium Volume' },
      'D': { color: 'bg-orange-100 text-orange-800', description: 'Bronze - Low Volume' },
      'E': { color: 'bg-gray-100 text-gray-800', description: 'Basic - New Customer' },
    };
    return tierConfig[tier as keyof typeof tierConfig] || tierConfig.E;
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || customer.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const handleExportCustomersPDF = async () => {
    try {
      const customerData: CustomerData[] = filteredCustomers.map(customer => ({
        id: customer.id,
        name: customer.name,
        tier: customer.tier,
        discount: customer.discount,
        email: customer.email,
        phone: customer.phone,
        totalQuotes: customer.totalOrders,
        totalValue: customer.yearlyVolume
      }));

      await generateCustomerListPDF(customerData);
      alert('Customer directory PDF generated successfully!');
    } catch (error) {
      console.error('Error generating customer PDF:', error);
      alert('Error generating customer directory. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Customer Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCustomersPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Enter company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Person</Label>
                <Input id="contact" placeholder="Enter contact name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter full address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Customer Tier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Tier A - Premium</SelectItem>
                    <SelectItem value="B">Tier B - Gold</SelectItem>
                    <SelectItem value="C">Tier C - Silver</SelectItem>
                    <SelectItem value="D">Tier D - Bronze</SelectItem>
                    <SelectItem value="E">Tier E - Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Payment Terms</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net15">Net 15</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net45">Net 45</SelectItem>
                    <SelectItem value="net60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search customers by name, contact, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Tier" />
              </SelectTrigger>
              <SelectContent>
                {tiers.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier === 'all' ? 'All Tiers' : `Tier ${tier}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {tiers.slice(1).map((tier) => {
          const tierCustomers = customers.filter(c => c.tier === tier);
          const tierInfo = getTierInfo(tier);
          return (
            <Card key={tier}>
              <CardContent className="p-4 text-center">
                <Badge className={tierInfo.color}>Tier {tier}</Badge>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{tierCustomers.length}</div>
                  <div className="text-sm text-slate-600">Customers</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-600">
        Showing {filteredCustomers.length} of {customers.length} customers
      </div>

      {/* Customer List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => {
          const tierInfo = getTierInfo(customer.tier);
          return (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">{customer.name}</h3>
                      <Badge className={tierInfo.color}>
                        Tier {customer.tier}
                      </Badge>
                      <span className="text-sm text-slate-500">({customer.discount}% discount)</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="h-4 w-4" />
                        <span>{customer.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-4 w-4" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4" />
                        <span>{customer.address}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <div className="text-sm text-slate-500">Total Orders</div>
                        <div className="font-semibold">{customer.totalOrders}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Yearly Volume</div>
                        <div className="font-semibold">${customer.yearlyVolume.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Payment Terms</div>
                        <div className="font-semibold">{customer.paymentTerms}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm">
                      Create Quote
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerManagement;
