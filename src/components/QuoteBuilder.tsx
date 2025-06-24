
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  User, 
  Package, 
  Calculator, 
  Download,
  Plus,
  Minus,
  Trash2,
  CheckCircle
} from 'lucide-react';

interface QuoteBuilderProps {
  userRole: string;
}

const QuoteBuilder: React.FC<QuoteBuilderProps> = ({ userRole }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [quoteItems, setQuoteItems] = useState<any[]>([]);
  const [projectName, setProjectName] = useState('');
  const [notes, setNotes] = useState('');

  const steps = [
    { number: 1, title: 'Customer & Project', icon: User },
    { number: 2, title: 'Add Products', icon: Package },
    { number: 3, title: 'Review & Pricing', icon: Calculator },
    { number: 4, title: 'Generate Quote', icon: FileText }
  ];

  // Mock data
  const customers = [
    { id: 'CUST001', name: 'ABC Construction Co.', tier: 'A', discount: 15 },
    { id: 'CUST002', name: 'XYZ Electric Services', tier: 'B', discount: 10 },
    { id: 'CUST003', name: 'Metro Infrastructure', tier: 'A', discount: 18 }
  ];

  const products = [
    { id: 'CAB001', name: 'THWN-2 Copper Wire 12 AWG', basePrice: 125.50, unit: 'per 1000ft' },
    { id: 'CAB002', name: 'MC Cable 12/2 w/ Ground', basePrice: 245.75, unit: 'per 1000ft' },
    { id: 'CAB003', name: 'Cat6 Ethernet Cable UTP', basePrice: 89.25, unit: 'per 1000ft' }
  ];

  const addProductToQuote = (product: any) => {
    const existingItem = quoteItems.find(item => item.id === product.id);
    if (existingItem) {
      setQuoteItems(quoteItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setQuoteItems([...quoteItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setQuoteItems(quoteItems.filter(item => item.id !== productId));
    } else {
      setQuoteItems(quoteItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const calculatePricing = () => {
    const customer = customers.find(c => c.id === selectedCustomer);
    const customerDiscount = customer?.discount || 0;
    
    let subtotal = 0;
    const itemsWithPricing = quoteItems.map(item => {
      const lineTotal = item.basePrice * item.quantity;
      const discountAmount = (lineTotal * customerDiscount) / 100;
      const netPrice = lineTotal - discountAmount;
      subtotal += netPrice;
      
      return {
        ...item,
        lineTotal,
        discountAmount,
        netPrice
      };
    });

    const freight = subtotal > 5000 ? 0 : 150; // Free freight over $5000
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + freight + tax;

    return {
      items: itemsWithPricing,
      subtotal,
      discount: customerDiscount,
      freight,
      tax,
      total
    };
  };

  const pricing = calculatePricing();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} (Tier {customer.tier} - {customer.discount}% discount)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedCustomer && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Customer Selected</span>
                    </div>
                    {(() => {
                      const customer = customers.find(c => c.id === selectedCustomer);
                      return customer ? (
                        <div className="mt-2 text-sm text-slate-600">
                          {customer.name} • Tier {customer.tier} • {customer.discount}% discount
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project">Project Name</Label>
                  <Input
                    id="project"
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Project Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any project-specific notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-slate-600">{product.id}</p>
                        <p className="text-sm font-medium">${product.basePrice.toFixed(2)} {product.unit}</p>
                      </div>
                      <Button onClick={() => addProductToQuote(product)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {quoteItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Quote Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quoteItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-slate-600">${item.basePrice.toFixed(2)} {item.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-20 text-center"
                            min="0"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 0)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pricing.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-slate-600">
                          ${item.basePrice.toFixed(2)} × {item.quantity} = ${item.lineTotal.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${item.netPrice.toFixed(2)}</div>
                        {item.discountAmount > 0 && (
                          <div className="text-sm text-green-600">
                            Save ${item.discountAmount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Freight:</span>
                      <span>${pricing.freight.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%):</span>
                      <span>${pricing.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quote Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer</Label>
                      <p className="font-medium">
                        {customers.find(c => c.id === selectedCustomer)?.name}
                      </p>
                    </div>
                    <div>
                      <Label>Project</Label>
                      <p className="font-medium">{projectName || 'Unnamed Project'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Items</Label>
                    <p className="font-medium">{quoteItems.length} products</p>
                  </div>
                  
                  <div>
                    <Label>Total Amount</Label>
                    <p className="text-2xl font-bold text-blue-600">${pricing.total.toFixed(2)}</p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Generate PDF
                    </Button>
                    {(userRole === 'Mini Agent') && (
                      <Button variant="outline" className="flex-1">
                        Request Approval
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Quote Builder</h2>
        <Badge variant="outline">Step {currentStep} of 4</Badge>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.number 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium mt-2">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-slate-200'
                    }`} 
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button 
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={
            currentStep === 4 || 
            (currentStep === 1 && !selectedCustomer) ||
            (currentStep === 2 && quoteItems.length === 0)
          }
        >
          {currentStep === 4 ? 'Complete Quote' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default QuoteBuilder;
