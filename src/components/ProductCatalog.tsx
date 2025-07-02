
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, Plus, Download } from 'lucide-react';
import { generateProductCatalogPDF, ProductData } from '@/lib/pdfUtils';

interface ProductCatalogProps {
  userRole: string;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock product data
  const products = [
    {
      id: 'CAB001',
      name: 'THWN-2 Copper Wire 12 AWG',
      category: 'Building Wire',
      voltage: '600V',
      material: 'Copper',
      gauge: '12 AWG',
      basePrice: 125.50,
      stock: 850,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: 'CAB002',
      name: 'MC Cable 12/2 w/ Ground',
      category: 'Armored Cable',
      voltage: '600V',
      material: 'Copper',
      gauge: '12/2',
      basePrice: 245.75,
      stock: 420,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: 'CAB003',
      name: 'Cat6 Ethernet Cable UTP',
      category: 'Data Cable',
      voltage: 'Low Voltage',
      material: 'Copper',
      gauge: '23 AWG',
      basePrice: 89.25,
      stock: 1200,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: 'CAB004',
      name: 'RG6 Coaxial Cable Quad Shield',
      category: 'Coaxial Cable',
      voltage: 'Low Voltage',
      material: 'Copper',
      gauge: '18 AWG',
      basePrice: 67.50,
      stock: 950,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: 'CAB005',
      name: 'XHHW-2 Aluminum 4/0 AWG',
      category: 'Building Wire',
      voltage: '600V',
      material: 'Aluminum',
      gauge: '4/0 AWG',
      basePrice: 315.80,
      stock: 180,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: 'CAB006',
      name: 'Fiber Optic Cable 24 Strand',
      category: 'Fiber Optic',
      voltage: 'Low Voltage',
      material: 'Glass Fiber',
      gauge: 'Multi-mode',
      basePrice: 485.00,
      stock: 75,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    }
  ];

  const categories = ['all', 'Building Wire', 'Armored Cable', 'Data Cable', 'Coaxial Cable', 'Fiber Optic'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock: number) => {
    if (stock > 500) return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
    if (stock > 100) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Critical', color: 'bg-red-100 text-red-800' };
  };

  const handleExportProductsPDF = async () => {
    try {
      const productData: ProductData[] = filteredProducts.map(product => ({
        id: product.id,
        name: product.name,
        basePrice: product.basePrice,
        unit: 'per 1000ft',
        category: product.category,
        description: `${product.voltage} • ${product.material} • ${product.gauge}`,
        inStock: product.stock
      }));

      await generateProductCatalogPDF(productData);
      alert('Product catalog PDF generated successfully!');
    } catch (error) {
      console.error('Error generating product catalog PDF:', error);
      alert('Error generating product catalog. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Product Catalog</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportProductsPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
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
                  placeholder="Search products by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Showing {filteredProducts.length} of {products.length} products</span>
        <span>Base prices shown (before customer tier pricing)</span>
      </div>

      {/* Product Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="aspect-square bg-slate-100 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                        {product.name}
                      </h3>
                      <Badge variant="outline" className={stockStatus.color}>
                        {stockStatus.text}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">{product.id}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{product.category}</span>
                      <span>{product.gauge}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-slate-900">
                        ${product.basePrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <Button size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div key={product.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-600">{product.id} • {product.category}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                          <span>{product.voltage}</span>
                          <span>{product.material}</span>
                          <span>{product.gauge}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">
                          ${product.basePrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-500">
                          Stock: {product.stock}
                        </div>
                        <Badge className={`${stockStatus.color} mt-1`}>
                          {stockStatus.text}
                        </Badge>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Quote
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductCatalog;
