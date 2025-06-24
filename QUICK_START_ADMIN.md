# Quick Start Guide - Admin Dashboard

## 🚀 Getting Started

### 1. Access the Admin Dashboard
- Navigate to `http://localhost:3000/admin` in your browser
- You'll see a login screen

### 2. Login Credentials
- **Username**: `admin`
- **Password**: `password123`

### 3. Dashboard Overview
Once logged in, you'll see the main dashboard with:
- **Key metrics** (products, wines, orders, revenue)
- **Recent activity feed**
- **Navigation sidebar** with different sections

## 📊 Available Sections

### Dashboard
- View business metrics and analytics
- Monitor recent activity
- Quick overview of your store performance

### Products
- **View all products** in a table format
- **Add new products** with the "Add Product" button
- **Edit existing products** by clicking the edit icon
- **Delete products** with confirmation
- **Search products** using the search bar
- **Filter products** by category or status

### Wines
- Specialized wine management
- Track wine types, vintages, and popularity
- Manage wine-specific inventory

### Blog Posts
- Manage blog content
- Track post status (published/draft)
- Monitor view counts
- Manage authors and content

### Customers & Settings
- Coming soon features
- Customer management
- Store configuration

## 🛠️ How to Use Key Features

### Adding a Product
1. Go to **Products** section
2. Click **"Add Product"** button
3. Fill in the form:
   - Product name
   - Category (Wine, Spirits, Beer, etc.)
   - Price
   - Stock quantity
   - Status (Active/Inactive)
   - Description (optional)
   - Upload product image
4. Click **"Add Product"** to save

### Editing a Product
1. Find the product in the table
2. Click the **pencil icon** (Edit)
3. Modify the information
4. Click **"Update Product"** to save

### Deleting a Product
1. Find the product in the table
2. Click the **trash icon** (Delete)
3. Confirm the deletion

### Searching Products
- Use the search bar to find products by name
- Results update in real-time as you type

## 🔧 Current Features

### ✅ Working Features
- **Authentication system** with login/logout
- **Dashboard overview** with mock data
- **Product management** (view, add, edit, delete)
- **Responsive design** for mobile and desktop
- **Search functionality**
- **Form validation**
- **Modal forms** for adding/editing

### 🚧 Coming Soon
- **Real API integration** (currently using mock data)
- **Customer management**
- **Order management**
- **Advanced analytics**
- **Bulk operations**
- **File upload to cloud storage**
- **User permissions**

## 🎯 Demo Data

The dashboard currently shows mock data for demonstration:
- **1,247 total products**
- **342 wines**
- **89 blog posts**
- **156 orders**
- **$45,678 revenue**

## 🔒 Security Notes

- **Demo credentials** are hardcoded for testing
- **Production setup** should include:
  - Secure authentication API
  - Environment variables for credentials
  - HTTPS enforcement
  - Session management
  - Rate limiting

## 🐛 Troubleshooting

### Can't access admin page?
- Make sure your Next.js server is running (`npm run dev`)
- Check the URL: `http://localhost:3000/admin`
- Clear browser cache if needed

### Login not working?
- Use exact credentials: `admin` / `password123`
- Check browser console for errors
- Try refreshing the page

### Forms not working?
- Check browser console for JavaScript errors
- Ensure all required fields are filled
- Try refreshing the page

## 📱 Mobile Usage

The admin dashboard is fully responsive:
- **Sidebar** collapses on mobile
- **Tables** become scrollable
- **Forms** adapt to smaller screens
- **Touch-friendly** buttons and interactions

## 🎨 Customization

The dashboard uses:
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Next.js 15** with App Router
- **TypeScript** for type safety

You can customize colors, layout, and functionality by modifying the components.

---

**Ready to start?** Navigate to `/admin` and log in with the demo credentials! 