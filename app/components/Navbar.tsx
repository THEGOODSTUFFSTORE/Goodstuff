"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore, useUserStore } from '@/lib/store';
import { ShoppingBag, User, ChevronDown } from 'lucide-react';

type DropdownCategory = 'categories' | 'spirits' | 'market' | 'product-sections';

const Navbar = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [navSearch, setNavSearch] = useState('');
  const { totalItems } = useCartStore();
  const { user, isAuthenticated } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownCategory | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<DropdownCategory, boolean>>({
    categories: false,
    spirits: false,
    market: false,
    'product-sections': false
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get('search') || '';
    setNavSearch(q);
  }, [searchParams]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileDropdown = (category: DropdownCategory) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const navigationItems = [
    {
      name: 'Categories',
      key: 'categories' as DropdownCategory,
      items: [
        { name: 'Wine', href: '/wine', description: 'Red, White, Rosé & Champagne' },
        { name: 'Beer', href: '/beer', description: 'Craft & Premium Beers' },
        { name: 'Cider', href: '/cider', description: 'Apple & Fruit Ciders' },
        { name: 'Cream Liqueurs', href: '/cream-liquers', description: 'Smooth & Creamy' }
      ]
    },
    {
      name: 'Spirits',
      key: 'spirits' as DropdownCategory,
      href: '/spirit',
      items: [
        { name: 'Whisky', href: '/bourbon', description: 'Bourbon, Scotch & More' },
        { name: 'Gin', href: '/gin', description: 'Premium & Craft Gin' },
        { name: 'Vodka', href: '/vodka', description: 'Premium Vodka Selection' },
        { name: 'Rum', href: '/rum', description: 'Dark, White & Spiced' },
        { name: 'Tequila', href: '/tequila', description: 'Blanco, Reposado & Añejo' },
        { name: 'Cognac', href: '/cognac', description: 'Fine French Cognac' }
      ]
    },
    {
      name: 'Market',
      key: 'market' as DropdownCategory,
      href: '/market',
      items: [
        { name: 'Merchandise', href: '/market/merchandise', description: 'Branded Items & Gifts' },
        { name: 'Nicotine Pouches', href: '/market/nicotine-pouches', description: 'Modern Alternatives' },
        { name: 'Vapes', href: '/market/vapes', description: 'Premium Vaping Products' },
        { name: 'Lighters', href: '/market/lighters', description: 'Luxury & Collectible' },
        { name: 'Cigars', href: '/market/cigars', description: 'Premium Cigars' },
        { name: 'Soft Drinks', href: '/market/soft-drinks', description: 'Mixers & Beverages' }
      ]
    },
    {
      name: 'Product Sections',
      key: 'product-sections' as DropdownCategory,
      href: '/products',
      items: [
        { name: 'Trending Deals', href: '/trending-deals', description: 'Hot Deals & Trending Products' },
        { name: 'Popular Products', href: '/popular-products', description: 'Customer Favorites & Best Sellers' },
        { name: 'New Arrivals', href: '/new-arrivals', description: 'Latest & Fresh Products' },
        { name: 'All Products', href: '/products', description: 'Complete Product Catalog' }
      ]
    }
  ];

  // Update the NavigationItem type to include optional items with descriptions
  type NavigationItem = {
    name: string;
    key: DropdownCategory;
    href?: string;
    items?: { name: string; href: string; description?: string; }[];
  };

  return (
    <>
      {/* Backdrop blur overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'backdrop-blur-xl shadow-xl' 
          : 'backdrop-blur-md shadow-lg'
      }`}
      style={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.98)',
        borderBottom: isScrolled ? '1px solid rgba(107, 114, 128, 0.2)' : 'none'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Clean graffiti-style logo with image */}
            <div className="flex-shrink-0 relative group">
              <Link href="/" className="relative flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-2">
                <Image 
                  src="/logo.png" 
                  alt="The Goodstuff Logo" 
                  width={52}
                  height={52}
                  className="h-8 w-auto sm:h-10 md:h-12 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                />
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-red-500 transition-colors duration-300 hidden xs:block">
                  The Good Stuff
                </span>
                <span className="text-sm font-bold text-gray-900 hover:text-red-500 transition-colors duration-300 block xs:hidden">
                  The Good Stuff
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - More spacious and organized */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <div 
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.href ? (
                    <Link 
                      href={item.href} 
                      className="relative px-5 py-3 font-semibold transition-all duration-300 flex items-center group rounded-xl text-gray-700 hover:text-red-500 hover:bg-gray-50"
                    >
                      <span className="relative z-10 text-sm">{item.name}</span>
                      {item.items && (
                        <ChevronDown className={`ml-2 h-4 w-4 transform transition-all duration-300 ${
                          activeDropdown === item.key ? 'rotate-180 text-red-500' : 'group-hover:rotate-180'
                        }`} />
                      )}
                    </Link>
                  ) : (
                    <button 
                      className="relative px-5 py-3 font-semibold transition-all duration-300 flex items-center group rounded-xl text-gray-700 hover:text-red-500 hover:bg-gray-50"
                    >
                      <span className="relative z-10 text-sm">{item.name}</span>
                      {item.items && (
                        <ChevronDown className={`ml-2 h-4 w-4 transform transition-all duration-300 ${
                          activeDropdown === item.key ? 'rotate-180 text-red-500' : 'group-hover:rotate-180'
                        }`} />
                      )}
                    </button>
                  )}

                  {/* Enhanced Dropdown with descriptions */}
                  {item.items && (
                    <div className={`absolute left-0 mt-2 w-80 transition-all duration-300 ease-out transform ${
                      activeDropdown === item.key 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible -translate-y-4'
                    }`}>
                      <div className="backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50"
                           style={{
                             backgroundColor: 'rgba(255, 255, 255, 0.98)'
                           }}>
                        <div className="p-3">
                          <div className="mb-3 px-3 py-2">
                            <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                          </div>
                          {item.items.map((subItem, index) => (
                            <Link 
                              key={subItem.href} 
                              href={subItem.href} 
                              className="flex flex-col px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-red-50"
                              style={{ 
                                animationDelay: `${index * 50}ms` 
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-900 group-hover:text-red-600">{subItem.name}</span>
                                <svg className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                              {subItem.description && (
                                <span className="text-sm text-gray-500 mt-1">{subItem.description}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Access Links - Only on large screens */}
            <div className="hidden xl:flex items-center space-x-4 text-sm font-medium">
              <div className="relative">
                <input
                  type="search"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const query = navSearch.trim();
                      const url = query ? `/products?search=${encodeURIComponent(query)}` : '/products';
                      router.push(url);
                    }
                  }}
                  placeholder="Search products..."
                  className="w-64 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  aria-label="Search products"
                />
              </div>
              <Link href="/products" className="text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                All Products
              </Link>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Account link */}
              <Link 
                href={isClient && isAuthenticated ? "/dashboard" : "/login"} 
                className="p-1.5 sm:p-2 rounded-xl transition-all duration-300 group relative text-gray-700 hover:text-red-500 hover:bg-gray-50"
                title={isClient && isAuthenticated ? "Dashboard" : "Login"}
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-200" />
              </Link>

              {/* Cart link with item count */}
              <Link 
                href="/basket" 
                className="p-1.5 sm:p-2 rounded-xl transition-all duration-300 group relative text-gray-700 hover:text-red-500 hover:bg-gray-50"
                title="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-200" />
                  {isClient && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-xl transition-all duration-300 group relative text-gray-700 hover:text-red-500 hover:bg-gray-50"
                aria-label="Open mobile menu"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-3 sm:px-4 pt-3 pb-4 space-y-2 bg-white/95 backdrop-blur-xl border-t border-gray-200/50">
            {navigationItems.map((item) => (
              <div key={item.key}>
                {item.items ? (
                  // If item has subitems, use button for dropdown
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(item.key)}
                      className="w-full text-left px-4 py-3.5 rounded-lg text-base font-semibold text-gray-700 hover:text-red-500 hover:bg-gray-50 flex items-center justify-between min-h-[44px]"
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`h-5 w-5 transform transition-transform ${mobileDropdowns[item.key] ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {mobileDropdowns[item.key] && (
                      <div className="pl-4 mt-2 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 min-h-[40px] flex items-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : item.href ? (
                  // If item has no subitems but has href, use Link component
                  <Link
                    href={item.href}
                    className="block w-full text-left px-4 py-3.5 rounded-lg text-base font-semibold text-gray-700 hover:text-red-500 hover:bg-gray-50 min-h-[44px] flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  // If item has no subitems and no href, use button
                  <button
                    className="block w-full text-left px-4 py-3.5 rounded-lg text-base font-semibold text-gray-700 hover:text-red-500 hover:bg-gray-50 min-h-[44px] flex items-center"
                  >
                    {item.name}
                  </button>
                )}
              </div>
            ))}
            
            {/* Mobile Quick Links */}
            <div className="pt-4 border-t border-gray-200/50 mt-4">
              <Link
                href="/products"
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 min-h-[40px] flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              
              {/* Authentication Links */}
              {isClient && !isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 min-h-[40px] flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 min-h-[40px] flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
              {!isClient && (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 min-h-[40px] flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 min-h-[40px] flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
              {isClient && isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 min-h-[40px] flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;