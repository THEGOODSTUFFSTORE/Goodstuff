# Excel Product Comparison Tool - User Guide

## Overview

The Excel Product Comparison Tool allows you to cross-check your product inventory against external Excel files to identify:
- Price discrepancies between your system and Excel data
- Stock quantity differences
- Missing products in either system
- Products that need updates

## How to Use

### 1. Access the Tool

1. Log into your admin dashboard
2. Navigate to the "Products" tab
3. Click the green "Compare with Excel" button

### 2. Download the Template

1. In the comparison tool, you'll see a blue info box with a "Download Template" button
2. Click to download the Excel template
3. The template shows the exact format expected for your data

### 3. Prepare Your Excel File

Your Excel file should contain these columns:

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `name` | ✅ Yes | Product name | "Cabernet Sauvignon 2020" |
| `price` | ✅ Yes | Product price (number) | 25.99 |
| `stockQuantity` | ❌ No | Available stock | 50 |
| `category` | ❌ No | Product category | "wine" |
| `subcategory` | ❌ No | Product subcategory | "red" |
| `type` | ❌ No | Product type | "cabernet" |
| `brand` | ❌ No | Brand name | "Sample Brand" |
| `volume` | ❌ No | Product volume | "750ml" |
| `status` | ❌ No | Product status | "active" |

**Important Notes:**
- Only `name` and `price` are required
- Product matching is done by name (case-insensitive)
- Additional matching uses brand + volume combination
- Prices should be numbers (not text)
- Stock quantities should be whole numbers

### 4. Upload and Compare

1. Click "Choose Excel File" and select your prepared Excel file
2. The system will automatically process the file and perform the comparison
3. Results will be displayed in the "Comparison Results" tab

### 5. Review Comparison Results

The tool provides a comprehensive overview with:

#### Statistics Dashboard
- **Total**: Total products compared
- **Match**: Products with matching prices and stock
- **Price Mismatch**: Products with different prices
- **Stock Mismatch**: Products with different stock quantities
- **Missing in Excel**: Products in your system but not in Excel
- **Missing in System**: Products in Excel but not in your system

#### Detailed Comparison Table
- Status indicators with color coding
- Side-by-side comparison of prices and stock
- Difference calculations
- Product details (name, brand, category, volume)

### 6. Bulk Update Products

If discrepancies are found:

1. Click the green "Bulk Update" button
2. Review the update summary showing:
   - Total products to update
   - Price updates count
   - Stock updates count
3. Review each product's changes
4. Click "Update X Products" to apply changes
5. Monitor progress and results

**Safety Features:**
- Clear warning about irreversible changes
- Progress tracking during updates
- Detailed error reporting
- Success/failure counts

### 7. Export Results

1. Go to the "Export Results" tab
2. Click "Export to Excel"
3. Download a comprehensive report including:
   - All comparison data
   - Status indicators
   - Price and stock differences
   - Detailed notes

## Best Practices

### For Excel File Preparation
1. **Use consistent naming**: Ensure product names match exactly between systems
2. **Include brand and volume**: Helps with accurate product matching
3. **Validate data types**: Ensure prices are numbers, stock is integers
4. **Remove duplicates**: Clean your Excel file before upload
5. **Use the template**: Start with the provided template for best results

### For Regular Updates
1. **Schedule comparisons**: Run comparisons weekly or monthly
2. **Review before updating**: Always review changes before bulk updates
3. **Keep backups**: Export results before making changes
4. **Test with small files**: Start with a few products to test the process

## Troubleshooting

### Common Issues

**"No products found" error**
- Check that your Excel file has the correct column headers
- Ensure the first row contains column names, not data
- Verify file format (.xlsx or .xls)

**Product matching issues**
- Check for extra spaces in product names
- Ensure consistent capitalization
- Verify brand and volume information matches

**Price comparison errors**
- Ensure price column contains numbers, not text
- Check for currency symbols or formatting
- Verify decimal separators (use periods, not commas)

**Upload failures**
- Check file size (should be under 10MB)
- Ensure file is not corrupted
- Try saving as .xlsx format

### Getting Help

If you encounter issues:
1. Check the error messages in the comparison tool
2. Verify your Excel file format matches the template
3. Ensure all required columns are present
4. Contact support with specific error details

## File Format Examples

### Basic Format (Minimum Required)
```csv
name,price
"Product A",19.99
"Product B",29.99
```

### Full Format (Recommended)
```csv
name,category,subcategory,type,price,stockQuantity,brand,volume,status
"Red Wine 2020",wine,red,cabernet,25.99,50,"Brand Name","750ml",active
"Whisky Single Malt",spirit,whisky,single_malt,45.99,30,"Brand Name","750ml",active
```

## Security and Data Handling

- **File Processing**: All processing happens in your browser
- **Data Storage**: No Excel data is stored on our servers
- **Privacy**: Your product data remains secure
- **Access Control**: Only authenticated admin users can access the tool

## Performance Tips

- **File Size**: Keep Excel files under 1000 rows for best performance
- **Column Count**: Limit to necessary columns for faster processing
- **Data Cleanup**: Remove empty rows and unnecessary formatting
- **Regular Updates**: Process smaller files more frequently rather than large files occasionally

---

**Need Help?** Contact your system administrator or technical support team for assistance with the Excel comparison tool.
