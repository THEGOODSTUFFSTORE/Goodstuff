"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore, useUserStore } from '@/lib/store';
import { ShoppingBag, User, ChevronDown, UserCheck, LogIn, Search, Menu } from 'lucide-react';

type DropdownCategory = 'categories' | 'spirits' | 'market' | 'product-sections';

const Navbar = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [navSearch, setNavSearch] = useState('');

  const totalItems = useCartStore((state) => state.totalItems);
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
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
        { name: 'Whisky', href: '/whisky', description: 'Whisky, Scotch & More' },
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

  type NavigationItem = {
    name: string;
    key: DropdownCategory;
    href?: string;
    items?: { name: string; href: string; description?: string; }[];
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg">
        {/* TOP BAR (brand dark grey-blue) */}
        <div className="bg-[#2b3a4a] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop top row */}
            <div className="hidden lg:flex items-center h-16">
              {/* Brand Text (no logo) */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center py-2">
                  <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#FFDF88] via-[#FFA55D] to-[#ACC572] bg-clip-text text-transparent drop-shadow-sm">
                    The Goodstuff
                  </span>
                </Link>
              </div>

              {/* Search */}
              <div className="flex-1 px-8">
                <div className="relative max-w-3xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                    className="w-full h-11 rounded-full pl-11 pr-4 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60"
                    aria-label="Search products"
                  />
                </div>
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-4">
                <Link
                  href={isClient && isAuthenticated ? "/dashboard" : "/login"}
                  className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                  title={isClient && isAuthenticated ? "Dashboard" : "Login"}
                >
                  <div className="relative">
                    {isClient && isAuthenticated ? (
                      <UserCheck className="h-5 w-5" />
                    ) : (
                      <LogIn className="h-5 w-5" />
                    )}
                    {isClient && isAuthenticated && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        <span className="sr-only">Online</span>
                      </span>
                    )}
                  </div>
                </Link>

                <Link
                  href="/basket"
                  className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                  title="Shopping Cart"
                >
                  <div className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {isClient && totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-red-700 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Mobile top row */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between h-14">
                {/* Menu button + label */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center gap-2 p-2 -ml-2 rounded-md hover:bg-white/10"
                  aria-label="Open mobile menu"
                >
                  <Menu className="h-6 w-6" />
                  <span className="text-sm font-semibold tracking-wide">MENU</span>
                </button>

                {/* Brand Text (no logo) */}
                <Link href="/" className="flex items-center">
                  <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-[#FFDF88] via-[#FFA55D] to-[#ACC572] bg-clip-text text-transparent">
                    The Goodstuff
                  </span>
                </Link>

                {/* Icons */}
                <div className="flex items-center gap-3">
                  <Link
                    href={isClient && isAuthenticated ? "/dashboard" : "/login"}
                    className="p-2 rounded-md hover:bg-white/10"
                    title={isClient && isAuthenticated ? "Dashboard" : "Login"}
                  >
                    {isClient && isAuthenticated ? (
                      <UserCheck className="h-5 w-5" />
                    ) : (
                      <LogIn className="h-5 w-5" />
                    )}
                  </Link>
                  <Link href="/basket" className="relative p-2 rounded-md hover:bg-white/10" title="Shopping Cart">
                    <ShoppingBag className="h-5 w-5" />
                    {isClient && totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-red-700 text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Mobile search */}
              <div className="pb-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="search"
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const query = navSearch.trim();
                        const url = query ? `/products?search=${encodeURIComponent(query)}` : '/products';
                        router.push(url);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    placeholder="Search products..."
                    className="w-full h-11 rounded-lg pl-11 pr-4 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60"
                    aria-label="Search products"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORIES STRIP (desktop) */}
        <div className="hidden lg:block bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 h-12">
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
                      className="px-4 py-2 font-semibold text-gray-800 hover:text-red-600 rounded-md flex items-center group"
                    >
                      <span className="text-sm">{item.name}</span>
                      {item.items && (
                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${activeDropdown === item.key ? 'rotate-180 text-red-600' : 'group-hover:rotate-180'}`} />
                      )}
                    </Link>
                  ) : (
                    <button className="px-4 py-2 font-semibold text-gray-800 hover:text-red-600 rounded-md flex items-center group">
                      <span className="text-sm">{item.name}</span>
                      {item.items && (
                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${activeDropdown === item.key ? 'rotate-180 text-red-600' : 'group-hover:rotate-180'}`} />
                      )}
                    </button>
                  )}

                  {item.items && (
                    <div className={`absolute left-0 mt-2 w-80 transition-all duration-300 ease-out transform ${
                      activeDropdown === item.key ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                    }`}>
                      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                        <div className="p-3">
                          <div className="mb-2 px-3 py-2">
                            <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                          </div>
                          {item.items.map((subItem, index) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="flex flex-col px-4 py-2.5 rounded-lg transition-colors duration-150 hover:bg-red-50"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-900 group-hover:text-red-600">{subItem.name}</span>
                                <svg className="h-4 w-4 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-150 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          </div>
        </div>

        {/* Mobile menu drawer */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-3 sm:px-4 pt-3 pb-4 space-y-2 bg-white/95 backdrop-blur-xl border-t border-gray-200/50">
            {navigationItems.map((item) => (
              <div key={item.key}>
                {item.items ? (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(item.key)}
                      className="w-full text-left px-4 py-3.5 rounded-lg text-base font-semibold text-gray-700 hover:text-red-500 hover:bg-gray-50 flex items-center justify-between min-h-[44px]"
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`h-5 w-5 transform transition-transform ${mobileDropdowns[item.key] ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileDropdowns[item.key] && (
                      <div className="pl-4 mt-2 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 min-h-[40px] flex items-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="block w-full text-left px-4 py-3.5 rounded-lg text-base font-semibold text-gray-700 hover:text-red-500 hover:bg-gray-50 min-h-[44px] flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button className="block w-full text-left px-4 py-3.5 rounded-lg text-base font-semibold text-gray-700 hover:text-red-500 hover:bg-gray-50 min-h-[44px] flex items-center">
                    {item.name}
                  </button>
                )}
              </div>
            ))}

            <div className="pt-4 border-top border-gray-200/50 mt-4">
              <Link
                href="/products"
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 min-h-[40px] flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>

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
      {/* Spacer to offset fixed navbar height so content isn't covered */}
      <div className="h-24 lg:h-28" aria-hidden="true" />
    </>
  );
};

export default Navbar;