"use client";
import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const ExcelTemplate: React.FC = () => {
  const downloadTemplate = () => {
    // Sample data for the template
    const templateData = [
      {
        name: 'Sample Wine Name',
        category: 'wine',
        subcategory: 'red',
        type: 'pinot_noir',
        price: 25.99,
        stockQuantity: 50,
        brand: 'Sample Brand',
        volume: '750ml',
        status: 'active'
      },
      {
        name: 'Sample Spirit Name',
        category: 'spirit',
        subcategory: 'whisky',
        type: 'single_malt',
        price: 45.99,
        stockQuantity: 30,
        brand: 'Sample Brand',
        volume: '750ml',
        status: 'active'
      },
      {
        name: 'Sample Beer Name',
        category: 'beer',
        subcategory: 'lager',
        type: 'pale_lager',
        price: 8.99,
        stockQuantity: 100,
        brand: 'Sample Brand',
        volume: '330ml',
        status: 'active'
      }
    ];

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product Template');

    // Add column headers
    const headers = [
      'name',
      'category', 
      'subcategory',
      'type',
      'price',
      'stockQuantity',
      'brand',
      'volume',
      'status'
    ];

    // Set column widths
    const colWidths = [
      { wch: 25 }, // name
      { wch: 15 }, // category
      { wch: 15 }, // subcategory
      { wch: 15 }, // type
      { wch: 12 }, // price
      { wch: 15 }, // stockQuantity
      { wch: 20 }, // brand
      { wch: 12 }, // volume
      { wch: 12 }  // status
    ];

    ws['!cols'] = colWidths;

    // Download the file
    const fileName = 'product-comparison-template.xlsx';
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-blue-900 mb-2">Excel Template Available</h3>
          <p className="text-sm text-blue-700 mb-3">
            Download our Excel template to see the exact format expected for product comparison. 
            The template includes sample data and proper column headers.
          </p>
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Template</span>
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-blue-600">
        <p className="font-medium mb-1">Required columns:</p>
        <div className="grid grid-cols-3 gap-2">
          <span>• name (required)</span>
          <span>• price (required)</span>
          <span>• stockQuantity</span>
          <span>• category</span>
          <span>• brand</span>
          <span>• volume</span>
          <span>• subcategory</span>
          <span>• type</span>
          <span>• status</span>
        </div>
      </div>
    </div>
  );
};

export default ExcelTemplate;
