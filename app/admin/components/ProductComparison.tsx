"use client";
import React, { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle, X, RefreshCw, Save } from 'lucide-react';
import { Product } from '@/lib/types';
import * as XLSX from 'xlsx';
import ExcelTemplate from './ExcelTemplate';
import BulkUpdateModal from './BulkUpdateModal';

interface ExcelProduct {
  name: string;
  category?: string;
  subcategory?: string;
  type?: string;
  price: number;
  stockQuantity?: number;
  brand?: string;
  volume?: string;
  status?: string;
}

interface ProductComparison {
  product: Product;
  excelProduct?: ExcelProduct;
  status: 'match' | 'price_mismatch' | 'stock_mismatch' | 'missing_in_excel' | 'missing_in_system';
  priceDifference?: number;
  stockDifference?: number;
}

interface ProductComparisonProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ products, isOpen, onClose }) => {
  const [excelData, setExcelData] = useState<ExcelProduct[]>([]);
  const [comparison, setComparison] = useState<ProductComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [activeTab, setActiveTab] = useState<'import' | 'comparison' | 'export'>('import');
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelProduct[];
        
        setExcelData(jsonData);
        performComparison(products, jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        alert('Error reading Excel file. Please ensure it\'s a valid Excel file.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const performComparison = (systemProducts: Product[], excelProducts: ExcelProduct[]) => {
    const comparisonResults: ProductComparison[] = [];

    // Compare system products with Excel
    systemProducts.forEach(product => {
      const excelProduct = excelProducts.find(ep => 
        ep.name.toLowerCase().trim() === product.name.toLowerCase().trim() ||
        (ep.brand && ep.brand.toLowerCase().trim() === product.brand?.toLowerCase().trim() && 
         ep.volume === product.volume)
      );

      if (excelProduct) {
        const priceDiff = excelProduct.price - product.price;
        const stockDiff = (excelProduct.stockQuantity || 0) - product.stockQuantity;
        
        let status: ProductComparison['status'] = 'match';
        if (Math.abs(priceDiff) > 0.01) status = 'price_mismatch';
        if (Math.abs(stockDiff) > 0) status = 'stock_mismatch';

        comparisonResults.push({
          product,
          excelProduct,
          status,
          priceDifference: priceDiff,
          stockDifference: stockDiff
        });
      } else {
        comparisonResults.push({
          product,
          status: 'missing_in_excel'
        });
      }
    });

    // Find products in Excel but not in system
    excelProducts.forEach(excelProduct => {
      const exists = systemProducts.some(product => 
        excelProduct.name.toLowerCase().trim() === product.name.toLowerCase().trim() ||
        (excelProduct.brand && excelProduct.brand.toLowerCase().trim() === product.brand?.toLowerCase().trim() && 
         excelProduct.volume === product.volume)
      );

      if (!exists) {
        comparisonResults.push({
          product: {
            id: '',
            name: excelProduct.name,
            slug: '',
            category: excelProduct.category || '',
            subcategory: excelProduct.subcategory || '',
            type: excelProduct.type || '',
            productImage: '',
            price: excelProduct.price,
            stockQuantity: excelProduct.stockQuantity || 0,
            brand: excelProduct.brand || '',
            volume: excelProduct.volume || '',
            status: excelProduct.status || 'active'
          } as Product,
          excelProduct,
          status: 'missing_in_system'
        });
      }
    });

    setComparison(comparisonResults);
    setActiveTab('comparison');
  };

  const exportComparison = () => {
    const exportData = comparison.map(comp => ({
      'Product Name': comp.product.name,
      'Brand': comp.product.brand || '',
      'Category': comp.product.category,
      'Subcategory': comp.product.subcategory,
      'Type': comp.product.type,
      'Volume': comp.product.volume || '',
      'System Price': comp.product.price,
      'Excel Price': comp.excelProduct?.price || '',
      'Price Difference': comp.priceDifference || 0,
      'System Stock': comp.product.stockQuantity,
      'Excel Stock': comp.excelProduct?.stockQuantity || 0,
      'Stock Difference': comp.stockDifference || 0,
      'Status': comp.status,
      'Notes': getStatusDescription(comp.status)
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product Comparison');
    
    const fileName = `product-comparison-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'match': return 'Prices and stock match';
      case 'price_mismatch': return 'Price discrepancy found';
      case 'stock_mismatch': return 'Stock quantity discrepancy found';
      case 'missing_in_excel': return 'Product not found in Excel file';
      case 'missing_in_system': return 'Product not found in system';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'price_mismatch': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'stock_mismatch': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'missing_in_excel': return <X className="w-5 h-5 text-red-500" />;
      case 'missing_in_system': return <X className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'match': return 'bg-green-50 border-green-200';
      case 'price_mismatch': return 'bg-yellow-50 border-yellow-200';
      case 'stock_mismatch': return 'bg-orange-50 border-orange-200';
      case 'missing_in_excel': return 'bg-red-50 border-red-200';
      case 'missing_in_system': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const stats = {
    total: comparison.length,
    match: comparison.filter(c => c.status === 'match').length,
    priceMismatch: comparison.filter(c => c.status === 'price_mismatch').length,
    stockMismatch: comparison.filter(c => c.status === 'stock_mismatch').length,
    missingInExcel: comparison.filter(c => c.status === 'missing_in_excel').length,
    missingInSystem: comparison.filter(c => c.status === 'missing_in_system').length
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Product Comparison Tool</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'import' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Import Excel
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'comparison' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            disabled={comparison.length === 0}
          >
            Comparison Results
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'export' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            disabled={comparison.length === 0}
          >
            Export Results
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'import' && (
            <div className="max-w-2xl mx-auto">
              <ExcelTemplate />
              <div className="text-center">
                <FileSpreadsheet className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Import Excel File</h3>
                <p className="text-gray-600 mb-6">
                  Upload an Excel file to compare with your current products. 
                  The file should contain columns for: name, price, stockQuantity, brand, volume, etc.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    <span>{isLoading ? 'Processing...' : 'Choose Excel File'}</span>
                  </button>
                </div>

                {fileName && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">File uploaded: {fileName}</p>
                    <p className="text-green-700 text-sm">
                      Found {excelData.length} products in Excel file
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'comparison' && comparison.length > 0 && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-700">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">{stats.match}</div>
                  <div className="text-sm text-green-600">Match</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-700">{stats.priceMismatch}</div>
                  <div className="text-sm text-yellow-600">Price Mismatch</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-700">{stats.stockMismatch}</div>
                  <div className="text-sm text-orange-600">Stock Mismatch</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-700">{stats.missingInExcel}</div>
                  <div className="text-sm text-red-600">Missing in Excel</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">{stats.missingInSystem}</div>
                  <div className="text-sm text-blue-600">Missing in System</div>
                </div>
              </div>

              {/* Bulk Update Button */}
              {(stats.priceMismatch > 0 || stats.stockMismatch > 0) && (
                <div className="mb-6 text-center">
                  <button
                    onClick={() => setIsBulkUpdateOpen(true)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mx-auto"
                  >
                    <Save className="w-5 h-5" />
                    <span>Bulk Update {stats.priceMismatch + stats.stockMismatch} Products</span>
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    Update prices and stock quantities to match Excel data
                  </p>
                </div>
              )}

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Product Name</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Brand</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Category</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">System Price</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Excel Price</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Price Diff</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">System Stock</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Excel Stock</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Stock Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((comp, index) => (
                      <tr key={index} className={`${getStatusColor(comp.status)} hover:bg-gray-50`}>
                        <td className="border border-gray-200 px-4 py-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(comp.status)}
                            <span className="text-sm font-medium capitalize">
                              {comp.status.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-2 font-medium">
                          {comp.product.name}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {comp.product.brand || '-'}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {comp.product.category} / {comp.product.subcategory} / {comp.product.type}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          ${comp.product.price?.toFixed(2) || '0.00'}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          ${comp.excelProduct?.price?.toFixed(2) || '-'}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {comp.priceDifference ? (
                            <span className={comp.priceDifference > 0 ? 'text-green-600' : 'text-red-600'}>
                              {comp.priceDifference > 0 ? '+' : ''}${comp.priceDifference.toFixed(2)}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {comp.product.stockQuantity || 0}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {comp.excelProduct?.stockQuantity || '-'}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {comp.stockDifference ? (
                            <span className={comp.stockDifference > 0 ? 'text-green-600' : 'text-red-600'}>
                              {comp.stockDifference > 0 ? '+' : ''}{comp.stockDifference}
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'export' && comparison.length > 0 && (
            <div className="max-w-2xl mx-auto text-center">
              <Download className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Export Comparison Results</h3>
              <p className="text-gray-600 mb-6">
                Download a detailed Excel report of all comparison results, including discrepancies and missing products.
              </p>
              
              <button
                onClick={exportComparison}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mx-auto"
              >
                <Download className="w-5 h-5" />
                <span>Export to Excel</span>
              </button>
              
              <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Export includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Product details (name, brand, category, volume)</li>
                  <li>• Price comparison between system and Excel</li>
                  <li>• Stock quantity comparison</li>
                  <li>• Status indicators for each product</li>
                  <li>• Detailed notes and discrepancies</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Update Modal */}
      <BulkUpdateModal
        isOpen={isBulkUpdateOpen}
        onClose={() => setIsBulkUpdateOpen(false)}
        comparison={comparison}
        onUpdateComplete={() => {
          // Refresh the comparison after updates
          if (excelData.length > 0) {
            performComparison(products, excelData);
          }
        }}
      />
    </div>
  );
};

export default ProductComparison;
