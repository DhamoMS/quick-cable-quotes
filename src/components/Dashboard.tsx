
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cable, 
  Users, 
  FileText, 
  Settings, 
  Search, 
  Plus,
  TrendingUp,
  DollarSign,
  Package,
  LogOut,
  Download
} from 'lucide-react';
import ProductCatalog from './ProductCatalog';
import CustomerManagement from './CustomerManagement';
import QuoteBuilder from './QuoteBuilder';
import AdminPanel from './AdminPanel';
import { generateDashboardReportPDF, DashboardData } from '@/lib/pdfUtils';

interface DashboardProps {
  userRole: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { title: 'Total Products', value: '1,547', icon: Package, color: 'bg-blue-500' },
    { title: 'Active Customers', value: '342', icon: Users, color: 'bg-green-500' },
    { title: 'Quotes This Month', value: '128', icon: FileText, color: 'bg-purple-500' },
    { title: 'Revenue', value: '$847K', icon: DollarSign, color: 'bg-orange-500' },
  ];

  const recentQuotes = [
    { id: 'Q001', customer: 'ABC Construction', amount: '$12,450', status: 'Pending' },
    { id: 'Q002', customer: 'XYZ Electric', amount: '$8,920', status: 'Approved' },
    { id: 'Q003', customer: 'Metro Builders', amount: '$15,680', status: 'Draft' },
    { id: 'Q004', customer: 'City Infrastructure', amount: '$45,200', status: 'Approved' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportDashboardPDF = async () => {
    try {
      const dashboardData: DashboardData = {
        stats: {
          totalProducts: 1547,
          activeCustomers: 342,
          quotesThisMonth: 128,
          revenue: '$847K'
        },
        recentQuotes: recentQuotes.map(quote => ({
          id: quote.id,
          customer: quote.customer,
          amount: quote.amount,
          status: quote.status,
          date: new Date().toLocaleDateString()
        })),
        userRole,
        exportDate: new Date().toLocaleDateString()
      };

      await generateDashboardReportPDF(dashboardData);
      alert('Dashboard report PDF generated successfully!');
    } catch (error) {
      console.error('Error generating dashboard PDF:', error);
      alert('Error generating dashboard report. Please try again.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductCatalog userRole={userRole} />;
      case 'customers':
        return <CustomerManagement userRole={userRole} />;
      case 'quotes':
        return <QuoteBuilder userRole={userRole} />;
      case 'admin':
        return <AdminPanel userRole={userRole} />;
      default:
        return (
          <div className="space-y-6">
            {/* Export Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
              <Button onClick={handleExportDashboardPDF} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentQuotes.map((quote) => (
                      <div key={quote.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{quote.id}</p>
                          <p className="text-sm text-slate-600">{quote.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{quote.amount}</p>
                          <Badge className={getStatusColor(quote.status)}>
                            {quote.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('quotes')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Quote
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('customers')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Add Customer
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('products')}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Browse Products
                    </Button>
                    {(userRole === 'Super Admin' || userRole === 'Admin') && (
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => setActiveTab('admin')}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'quotes', label: 'Quotes', icon: FileText },
  ];

  if (userRole === 'Super Admin' || userRole === 'Admin') {
    navItems.push({ id: 'admin', label: 'Admin', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Cable className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">CableQuote Pro</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {userRole}
              </Badge>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
