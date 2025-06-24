
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cable, Zap, Users, FileText } from 'lucide-react';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app, this would call an API
    const mockCredentials = {
      'admin@cable.com': { role: 'Super Admin', password: 'admin123' },
      'manager@cable.com': { role: 'Admin', password: 'admin123' },
      'sales@cable.com': { role: 'Sales Rep', password: 'sales123' },
      'agent@cable.com': { role: 'Mini Agent', password: 'agent123' }
    };

    const user = mockCredentials[email as keyof typeof mockCredentials];
    if (user && user.password === password) {
      setUserRole(user.role);
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  if (isAuthenticated) {
    return <Dashboard userRole={userRole} onLogout={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Cable className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">CableQuote Pro</h1>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Professional Cable Quotation System
          </h2>
          
          <p className="text-xl text-slate-600 leading-relaxed">
            Streamline your cable business with our comprehensive quotation platform. 
            Manage products, customers, and generate accurate quotes instantly.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">1500+ Products</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <Users className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Customer Tiers</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">PDF Quotes</span>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800">Sign In</CardTitle>
            <p className="text-slate-600">Access your cable quotation dashboard</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Demo Credentials:</p>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Super Admin: admin@cable.com / admin123</div>
                <div>Admin: manager@cable.com / admin123</div>
                <div>Sales Rep: sales@cable.com / sales123</div>
                <div>Mini Agent: agent@cable.com / agent123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
