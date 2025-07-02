import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Quote PDF Generation
export interface QuoteData {
  quoteNumber: string;
  date: string;
  customer: {
    id: string;
    name: string;
    tier: string;
    discount: number;
    address?: string;
    phone?: string;
    email?: string;
  };
  project: {
    name: string;
    notes?: string;
  };
  items: Array<{
    id: string;
    name: string;
    basePrice: number;
    quantity: number;
    unit: string;
    lineTotal: number;
    discountAmount: number;
    netPrice: number;
  }>;
  pricing: {
    subtotal: number;
    discount: number;
    freight: number;
    tax: number;
    total: number;
  };
  userRole: string;
  createdBy?: string;
}

export const generateQuotePDF = async (quoteData: QuoteData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 6;
  let yPosition = margin;

  // Header with company branding
  pdf.setFillColor(37, 99, 235); // Blue color
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CableQuote Pro', margin, 25);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Professional Cable Quotation System', margin, 33);

  // Reset text color for body
  pdf.setTextColor(0, 0, 0);
  yPosition = 55;

  // Quote header information
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Quote #${quoteData.quoteNumber}`, margin, yPosition);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date: ${quoteData.date}`, pageWidth - margin - 50, yPosition);
  
  yPosition += 15;

  // Customer information
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Customer Information', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Customer: ${quoteData.customer.name}`, margin, yPosition);
  yPosition += lineHeight;
  pdf.text(`Customer ID: ${quoteData.customer.id}`, margin, yPosition);
  yPosition += lineHeight;
  pdf.text(`Tier: ${quoteData.customer.tier} (${quoteData.customer.discount}% discount)`, margin, yPosition);
  
  if (quoteData.customer.address) {
    yPosition += lineHeight;
    pdf.text(`Address: ${quoteData.customer.address}`, margin, yPosition);
  }
  
  yPosition += 15;

  // Project information
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Project Information', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Project: ${quoteData.project.name}`, margin, yPosition);
  
  if (quoteData.project.notes) {
    yPosition += lineHeight;
    const notesLines = pdf.splitTextToSize(`Notes: ${quoteData.project.notes}`, pageWidth - 2 * margin);
    pdf.text(notesLines, margin, yPosition);
    yPosition += notesLines.length * lineHeight;
  }
  
  yPosition += 15;

  // Items table header
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Quote Items', margin, yPosition);
  yPosition += 10;

  // Table headers
  const tableTop = yPosition;
  const col1X = margin;
  const col2X = margin + 80;
  const col3X = margin + 120;
  const col4X = margin + 140;
  const col5X = margin + 170;

  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Product', col1X, yPosition + 2);
  pdf.text('Unit Price', col2X, yPosition + 2);
  pdf.text('Qty', col3X, yPosition + 2);
  pdf.text('Line Total', col4X, yPosition + 2);
  pdf.text('Net Price', col5X, yPosition + 2);
  
  yPosition += 10;

  // Table items
  pdf.setFont('helvetica', 'normal');
  quoteData.items.forEach((item) => {
    if (yPosition > 270) { // New page if needed
      pdf.addPage();
      yPosition = margin;
    }

    const productLines = pdf.splitTextToSize(item.name, 75);
    pdf.text(productLines, col1X, yPosition);
    pdf.text(`$${item.basePrice.toFixed(2)}`, col2X, yPosition);
    pdf.text(item.quantity.toString(), col3X, yPosition);
    pdf.text(`$${item.lineTotal.toFixed(2)}`, col4X, yPosition);
    pdf.text(`$${item.netPrice.toFixed(2)}`, col5X, yPosition);
    
    yPosition += Math.max(productLines.length * 4, 6);
  });

  yPosition += 10;

  // Pricing summary
  const summaryX = pageWidth - margin - 60;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Subtotal: $${quoteData.pricing.subtotal.toFixed(2)}`, summaryX, yPosition);
  yPosition += lineHeight;
  pdf.text(`Freight: $${quoteData.pricing.freight.toFixed(2)}`, summaryX, yPosition);
  yPosition += lineHeight;
  pdf.text(`Tax: $${quoteData.pricing.tax.toFixed(2)}`, summaryX, yPosition);
  yPosition += lineHeight;
  
  // Total with highlight
  pdf.setFillColor(37, 99, 235);
  pdf.rect(summaryX - 5, yPosition - 3, 65, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Total: $${quoteData.pricing.total.toFixed(2)}`, summaryX, yPosition + 2);

  // Footer
  pdf.setTextColor(128, 128, 128);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  const footerY = pdf.internal.pageSize.height - 15;
  pdf.text('Generated by CableQuote Pro', margin, footerY);
  pdf.text(`Created by: ${quoteData.createdBy || 'System User'}`, pageWidth - margin - 50, footerY);

  // Save the PDF
  pdf.save(`Quote_${quoteData.quoteNumber}.pdf`);
};

// Customer List PDF Export
export interface CustomerData {
  id: string;
  name: string;
  tier: string;
  discount: number;
  email?: string;
  phone?: string;
  totalQuotes?: number;
  totalValue?: number;
}

export const generateCustomerListPDF = async (customers: CustomerData[]): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;

  // Header
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Customer Directory', margin, 20);

  pdf.setTextColor(0, 0, 0);
  yPosition = 45;

  // Export info
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
  pdf.text(`Total Customers: ${customers.length}`, pageWidth - margin - 40, yPosition);
  yPosition += 15;

  // Table header
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Customer Name', margin + 2, yPosition + 2);
  pdf.text('ID', margin + 60, yPosition + 2);
  pdf.text('Tier', margin + 90, yPosition + 2);
  pdf.text('Discount', margin + 110, yPosition + 2);
  pdf.text('Contact', margin + 140, yPosition + 2);
  
  yPosition += 10;

  // Customer data
  pdf.setFont('helvetica', 'normal');
  customers.forEach((customer, index) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.text(customer.name.substring(0, 25), margin + 2, yPosition);
    pdf.text(customer.id, margin + 60, yPosition);
    pdf.text(customer.tier, margin + 90, yPosition);
    pdf.text(`${customer.discount}%`, margin + 110, yPosition);
    pdf.text(customer.email?.substring(0, 20) || 'N/A', margin + 140, yPosition);
    
    yPosition += 6;
  });

  pdf.save('Customer_Directory.pdf');
};

// Product Catalog PDF Export
export interface ProductData {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
  category?: string;
  description?: string;
  inStock?: number;
}

export const generateProductCatalogPDF = async (products: ProductData[]): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;

  // Header
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Product Catalog', margin, 20);

  pdf.setTextColor(0, 0, 0);
  yPosition = 45;

  // Export info
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
  pdf.text(`Total Products: ${products.length}`, pageWidth - margin - 40, yPosition);
  yPosition += 15;

  // Products
  products.forEach((product, index) => {
    if (yPosition > 260) {
      pdf.addPage();
      yPosition = margin;
    }

    // Product box
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(product.name, margin + 5, yPosition);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`ID: ${product.id}`, margin + 5, yPosition + 6);
    pdf.text(`Price: $${product.basePrice.toFixed(2)} ${product.unit}`, margin + 5, yPosition + 12);
    
    if (product.category) {
      pdf.text(`Category: ${product.category}`, pageWidth - margin - 50, yPosition + 6);
    }
    
    if (product.description) {
      const descLines = pdf.splitTextToSize(product.description, pageWidth - 2 * margin - 10);
      pdf.text(descLines.slice(0, 2), margin + 5, yPosition + 18); // Limit to 2 lines
    }
    
    yPosition += 30;
  });

  pdf.save('Product_Catalog.pdf');
};

// Dashboard Report PDF Export
export interface DashboardData {
  stats: {
    totalProducts: number;
    activeCustomers: number;
    quotesThisMonth: number;
    revenue: string;
  };
  recentQuotes: Array<{
    id: string;
    customer: string;
    amount: string;
    status: string;
    date?: string;
  }>;
  userRole: string;
  exportDate: string;
}

export const generateDashboardReportPDF = async (dashboardData: DashboardData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;

  // Header
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dashboard Report', margin, 22);
  
  pdf.setFontSize(12);
  pdf.text(`Generated: ${dashboardData.exportDate}`, margin, 30);

  pdf.setTextColor(0, 0, 0);
  yPosition = 50;

  // Key Statistics
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Statistics', margin, yPosition);
  yPosition += 10;

  // Stats grid
  const stats = [
    { label: 'Total Products', value: dashboardData.stats.totalProducts.toString() },
    { label: 'Active Customers', value: dashboardData.stats.activeCustomers.toString() },
    { label: 'Quotes This Month', value: dashboardData.stats.quotesThisMonth.toString() },
    { label: 'Revenue', value: dashboardData.stats.revenue }
  ];

  stats.forEach((stat, index) => {
    const x = margin + (index % 2) * (pageWidth / 2 - margin);
    const y = yPosition + Math.floor(index / 2) * 20;
    
    pdf.setFillColor(245, 245, 245);
    pdf.rect(x, y - 3, pageWidth / 2 - margin - 10, 15, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(stat.label, x + 5, y + 3);
    pdf.setFont('helvetica', 'normal');
    pdf.text(stat.value, x + 5, y + 9);
  });

  yPosition += 50;

  // Recent Quotes
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recent Quotes', margin, yPosition);
  yPosition += 10;

  // Table header
  pdf.setFillColor(37, 99, 235);
  pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Quote ID', margin + 5, yPosition + 2);
  pdf.text('Customer', margin + 40, yPosition + 2);
  pdf.text('Amount', margin + 100, yPosition + 2);
  pdf.text('Status', margin + 140, yPosition + 2);
  
  pdf.setTextColor(0, 0, 0);
  yPosition += 10;

  // Quote data
  pdf.setFont('helvetica', 'normal');
  dashboardData.recentQuotes.forEach((quote) => {
    pdf.text(quote.id, margin + 5, yPosition);
    pdf.text(quote.customer.substring(0, 20), margin + 40, yPosition);
    pdf.text(quote.amount, margin + 100, yPosition);
    pdf.text(quote.status, margin + 140, yPosition);
    yPosition += 6;
  });

  // Footer
  pdf.setTextColor(128, 128, 128);
  pdf.setFontSize(8);
  const footerY = pdf.internal.pageSize.height - 15;
  pdf.text('CableQuote Pro - Dashboard Report', margin, footerY);
  pdf.text(`User Role: ${dashboardData.userRole}`, pageWidth - margin - 50, footerY);

  pdf.save('Dashboard_Report.pdf');
};

// HTML Element to PDF (for complex layouts)
export const exportElementToPDF = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id '${elementId}' not found`);
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    logging: false,
    useCORS: true
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
};