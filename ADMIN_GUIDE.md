# Admin Dashboard Guide

## Overview

The Admin Dashboard is a comprehensive management interface for "The Goodstuff" e-commerce platform. It provides tools to manage products, wines, blog posts, and monitor business analytics.

## Accessing the Admin Dashboard

Navigate to `/admin` in your browser to access the admin dashboard.

## Dashboard Sections

### 1. Dashboard Overview

The main dashboard provides key business metrics and recent activity:

**Key Metrics:**
- **Total Products**: Number of products in inventory
- **Total Wines**: Number of wine products
- **Total Orders**: Number of customer orders
- **Total Revenue**: Total sales revenue
- **Monthly Growth**: Percentage growth in sales

**Recent Activity Feed:**
- New product additions
- Sales performance updates
- System notifications

### 2. Products Management

Manage all products across different categories (Wine, Beer, Spirits, Mixers, Snacks, Gifts, Market).

**Features:**
- **View Products**: See all products in a sortable table
- **Search Products**: Find specific products by name
- **Filter Products**: Filter by category, status, or other criteria
- **Add Product**: Create new products
- **Edit Product**: Modify existing product details
- **Delete Product**: Remove products from inventory
- **Export Data**: Download product data for analysis

**Product Information Displayed:**
- Product name
- Category
- Price
- Stock level
- Status (Active/Inactive)
- Last updated date

**Actions Available:**
- 👁️ **View**: Preview product details
- ✏️ **Edit**: Modify product information
- 🗑️ **Delete**: Remove product from inventory

### 3. Wines Management

Specialized section for managing wine inventory with wine-specific fields.

**Features:**
- **Wine-specific fields**: Type, vintage, price, stock
- **Popular wines tracking**: Mark wines as popular
- **Wine categorization**: Red, White, Rosé, Sparkling, Dessert
- **Vintage management**: Track different vintages

**Wine Information Displayed:**
- Wine name
- Type (Red, White, etc.)
- Vintage year
- Price
- Stock level
- Popular status

### 4. Blog Posts Management

Manage blog content and articles.

**Features:**
- **Content management**: Create, edit, and delete blog posts
- **Status tracking**: Published or draft status
- **View analytics**: Track post views
- **Author management**: Assign authors to posts

**Blog Post Information Displayed:**
- Post title
- Author
- Publish date
- Status (Published/Draft)
- View count

### 5. Customers Management

*Coming Soon*

Future features will include:
- Customer database management
- Order history
- Customer analytics
- Communication tools

### 6. Settings

*Coming Soon*

Future features will include:
- Store configuration
- Payment settings
- Shipping options
- User permissions

## How to Use Each Section

### Adding a New Product

1. Navigate to the **Products** section
2. Click the **"Add Product"** button
3. Fill in the required fields:
   - Product name
   - Category
   - Price
   - Stock quantity
   - Description
   - Product image
4. Set the status (Active/Inactive)
5. Click **Save**

### Adding a New Wine

1. Navigate to the **Wines** section
2. Click the **"Add Wine"** button
3. Fill in wine-specific fields:
   - Wine name
   - Type (Red, White, etc.)
   - Vintage year
   - Price
   - Stock quantity
   - Mark as popular (optional)
4. Click **Save**

### Creating a Blog Post

1. Navigate to the **Blog Posts** section
2. Click the **"Add Post"** button
3. Fill in the post details:
   - Title
   - Content
   - Author
   - Tags
   - Featured image
4. Set status (Draft/Published)
5. Click **Save**

### Managing Inventory

**Stock Updates:**
1. Find the product in the Products or Wines section
2. Click the **Edit** button
3. Update the stock quantity
4. Save changes

**Product Status:**
1. Find the product
2. Click **Edit**
3. Change status between Active/Inactive
4. Save changes

### Search and Filter

**Search:**
- Use the search bar to find products by name
- Search is case-insensitive
- Results update in real-time

**Filter:**
- Click the **Filter** button to access advanced filtering options
- Filter by category, status, price range, etc.

### Data Export

1. Navigate to any section (Products, Wines, Blog Posts)
2. Click the **Export** button
3. Choose export format (CSV, Excel)
4. Download the file

## Best Practices

### Product Management
- Keep product descriptions accurate and detailed
- Update stock levels regularly
- Use high-quality product images
- Set appropriate pricing

### Wine Management
- Maintain accurate vintage information
- Update popular wine status based on sales
- Keep detailed tasting notes
- Track wine origins and regions

### Blog Management
- Write engaging, informative content
- Use relevant tags for better SEO
- Include high-quality images
- Maintain consistent publishing schedule

### Security
- Change default admin passwords
- Use strong, unique passwords
- Enable two-factor authentication when available
- Regularly review user access

## Troubleshooting

### Common Issues

**Can't access admin dashboard:**
- Check if you're logged in with admin privileges
- Verify the URL is correct (/admin)
- Clear browser cache and cookies

**Products not showing:**
- Check if products are set to "Active" status
- Verify search/filter settings
- Refresh the page

**Changes not saving:**
- Check internet connection
- Verify all required fields are filled
- Try refreshing the page

### Getting Help

If you encounter issues:
1. Check this guide first
2. Review the error messages
3. Contact technical support with specific error details

## Future Enhancements

Planned features include:
- Advanced analytics and reporting
- Bulk import/export functionality
- Customer relationship management
- Order management system
- Inventory alerts
- Marketing tools integration
- Mobile app for admin functions

## Technical Notes

- The admin dashboard is built with Next.js and React
- Uses Tailwind CSS for styling
- Lucide React for icons
- Responsive design for mobile and desktop
- Real-time data updates
- Secure authentication system

---

*Last updated: January 2024* 