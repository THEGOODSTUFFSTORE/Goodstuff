"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCartStore, useUserStore } from '@/lib/store';
import { ShoppingBag, User } from 'lucide-react';

type DropdownCategory = 'wine' | 'spirits' | 'beer' | 'gin' | 'bourbon' | 'vodka' | 'cream-liquers' | 'market';

const Navbar = () => {
  const { totalItems } = useCartStore();
  const { user, isAuthenticated } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownCategory | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<DropdownCategory, boolean>>({
    wine: false,
    spirits: false,
    beer: false,
    gin: false,
    bourbon: false,
    vodka: false,
    'cream-liquers': false,
    market: false
  });

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
      name: 'Wine',
      key: 'wine' as DropdownCategory,
      href: '/wine',
      items: [
        { name: 'Red', href: '/wine/red' },
        { name: 'White', href: '/wine/white' },
        { name: 'Rosé', href: '/wine/rose' },
        { name: 'Cabernet Sauvignon', href: '/wine/cabernet-sauvignon' },
        { name: 'Sauvignon Blanc', href: '/wine/sauvignon-blanc' },
        { name: 'Merlot', href: '/wine/merlot' },
        { name: 'Champagne', href: '/wine/champagne' }
      ]
    },
    {
      name: 'Spirits',
      key: 'spirits' as DropdownCategory,
      href: '/spirit',
    },
    {
      name: 'Beer',
      key: 'beer' as DropdownCategory,
      href: '/beer',
    },
    {
      name: 'Gin',
      key: 'gin' as DropdownCategory,
      href: '/gin',
    },
          {
        name: 'Whisky',
        key: 'bourbon' as DropdownCategory,
        href: '/bourbon',
      },
    {
      name: 'Vodka',
      key: 'vodka' as DropdownCategory,
      href: '/vodka',
    },
    {
      name: 'Cream Liquers',
      key: 'cream-liquers' as DropdownCategory,
      href: '/cream-liquers',
    },
    {
      name: 'Market',
      key: 'market' as DropdownCategory,
      href: '/market',
      items: [
        { name: 'Merchandise', href: '/market/merchandise' },
        { name: 'Nicotine pouches', href: '/market/nicotine-pouches' },
        { name: 'Vapes', href: '/market/vapes' },
        { name: 'Lighters', href: '/market/lighters' },
        { name: 'Cigars', href: '/market/cigars' }
      ]
    },
  ];

  // Update the NavigationItem type to include optional items
  type NavigationItem = {
    name: string;
    key: DropdownCategory;
    href: string;
    items?: { name: string; href: string; }[];
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
              <Link href="/" className="relative flex items-center space-x-3 px-4 py-2">
                <Image 
                  src="/logo.png" 
                  alt="The Goodstuff Logo" 
                  width={52}
                  height={52}
                  className="h-12 w-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                />
                <span className="text-2xl font-bold text-gray-900 hover:text-red-500 transition-colors duration-300">
                  The Goodstuff
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div 
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link 
                    href={item.href} 
                    className="relative px-4 py-2 font-medium transition-all duration-300 flex items-center group rounded-xl"
                    style={{ 
                      color: '#1a1a1a'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#EF4444';
                      e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#1a1a1a';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {item.items && (
                      <svg className={`ml-1 h-4 w-4 transform transition-all duration-300 ${
                        activeDropdown === item.key ? 'rotate-180' : 'group-hover:rotate-180'
                      }`} 
                      style={{ color: activeDropdown === item.key ? '#EF4444' : 'currentColor' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    
                    {/* Hover background effect */}
                    <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" 
                         style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }} />
                  </Link>

                  {/* Modern Dropdown */}
                  {item.items && (
                    <div className={`absolute left-0 mt-2 w-64 transition-all duration-300 ease-out transform ${
                      activeDropdown === item.key 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible -translate-y-4'
                    }`}>
                      <div className="backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
                           style={{
                             backgroundColor: 'rgba(255, 255, 255, 0.95)',
                             border: '1px solid rgba(107, 114, 128, 0.2)'
                           }}>
                        <div className="p-2">
                          {item.items.map((subItem, index) => (
                            <Link 
                              key={subItem.href} 
                              href={subItem.href} 
                              className="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
                              style={{ 
                                color: '#1a1a1a',
                                animationDelay: `${index * 50}ms` 
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#EF4444';
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#1a1a1a';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <span className="font-medium">{subItem.name}</span>
                              <svg className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-3">
              {/* Account link */}
              <Link 
                href={isAuthenticated ? "/dashboard" : "/login"} 
                className="p-2 rounded-xl transition-all duration-300 group relative"
                style={{ color: '#1a1a1a' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#1a1a1a';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" 
                     style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }} />
              </Link>

              {/* Cart link with item count */}
              <Link 
                href="/basket" 
                className="p-2 rounded-xl transition-all duration-300 group relative"
                style={{ color: '#1a1a1a' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#1a1a1a';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" 
                     style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }} />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl transition-all duration-300 group relative"
                style={{ color: '#1a1a1a' }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.key}>
                {item.items ? (
                  // If item has subitems, use button for dropdown
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(item.key)}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{item.name}</span>
                      <svg
                        className={`h-5 w-5 transform transition-transform ${mobileDropdowns[item.key] ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {mobileDropdowns[item.key] && (
                      <div className="pl-4">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // If item has no subitems, use Link component
                  <Link
                    href={item.href}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;