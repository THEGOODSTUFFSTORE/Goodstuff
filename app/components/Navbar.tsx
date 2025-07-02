"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';

type DropdownCategory = 'wine' | 'spirits' | 'beer' | 'mixers' | 'snacks' | 'gifts' | 'market';

const Navbar = () => {
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownCategory | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<DropdownCategory, boolean>>({
    wine: false,
    spirits: false,
    beer: false,
    mixers: false,
    snacks: false,
    gifts: false,
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
        { name: 'Red', href: '/wine/red', icon: '🍷' },
        { name: 'White', href: '/wine/white', icon: '🥂' },
        { name: 'Rosé', href: '/wine/rose', icon: '🌹' },
        { name: 'Cabernet Sauvignon', href: '/wine/cabernet-sauvignon', icon: '🍇' },
        { name: 'Sauvignon Blanc', href: '/wine/sauvignon-blanc', icon: '🍾' },
        { name: 'Merlot', href: '/wine/merlot', icon: '🍷' },
        { name: 'Champagne', href: '/wine/champagne', icon: '🥂' },
      ]
    },
    {
      name: 'Spirits',
      key: 'spirits' as DropdownCategory,
      href: '/spirits',
      items: [
        { name: 'Whisky', href: '/spirits/whisky', icon: '🥃' },
        { name: 'Vodka', href: '/spirits/vodka', icon: '🧊' },
        { name: 'Gin', href: '/spirits/gin', icon: '🌿' },
        { name: 'Rum', href: '/spirits/rum', icon: '🏴‍☠️' },
        { name: 'Tequila', href: '/spirits/tequila', icon: '🌵' },
        { name: 'Brandy', href: '/spirits/brandy', icon: '🍂' },
        { name: 'Liqueur', href: '/spirits/liqueur', icon: '✨' },
      ]
    },
    {
      name: 'Beer',
      key: 'beer' as DropdownCategory,
      href: '/beer',
      items: [
        { name: 'Lager', href: '/beer/lager', icon: '🍺' },
        { name: 'Ale', href: '/beer/ale', icon: '🍻' },
        { name: 'Stout', href: '/beer/stout', icon: '⚫' },
        { name: 'Craft Beer', href: '/beer/craft-beer', icon: '🏭' },
        { name: 'Cider', href: '/beer/cider', icon: '🍎' },
      ]
    },
    {
      name: 'Mixers',
      key: 'mixers' as DropdownCategory,
      href: '/mixers',
      items: [
        { name: 'Soft Drinks', href: '/mixers/soft-drinks', icon: '🥤' },
        { name: 'Juices', href: '/mixers/juices', icon: '🧃' },
        { name: 'Energy Drinks', href: '/mixers/energy-drinks', icon: '⚡' },
        { name: 'Water', href: '/mixers/water', icon: '💧' },
        { name: 'Syrups & Bitters', href: '/mixers/syrups', icon: '🍯' },
      ]
    },
    {
      name: 'Snacks',
      key: 'snacks' as DropdownCategory,
      href: '/snacks',
      items: [
        { name: 'Chips & Crisps', href: '/snacks/chips', icon: '🥔' },
        { name: 'Nuts & Seeds', href: '/snacks/nuts', icon: '🥜' },
        { name: 'Chocolates', href: '/snacks/chocolates', icon: '🍫' },
        { name: 'Cookies & Biscuits', href: '/snacks/cookies', icon: '🍪' },
        { name: 'Dried Fruits', href: '/snacks/dried-fruits', icon: '🥭' },
      ]
    },
    {
      name: 'Gifts',
      key: 'gifts' as DropdownCategory,
      href: '/gifts',
      items: [
        { name: 'Gift Sets', href: '/gifts/gift-sets', icon: '🎁' },
        { name: 'Wine Gifts', href: '/gifts/wine-gifts', icon: '🍷' },
        { name: 'Whisky Gifts', href: '/gifts/whisky-gifts', icon: '🥃' },
        { name: 'Accessories', href: '/gifts/accessories', icon: '🛍️' },
        { name: 'Hampers', href: '/gifts/hampers', icon: '🧺' },
      ]
    },
    {
      name: 'Market',
      key: 'market' as DropdownCategory,
      href: '/market',
      items: [
        { name: 'Daily Essentials', href: '/market/essentials', icon: '🛒' },
        { name: 'Household Items', href: '/market/household', icon: '🏠' },
        { name: 'Personal Care', href: '/market/personal-care', icon: '🧴' },
        { name: 'Cleaning Supplies', href: '/market/cleaning', icon: '🧽' },
        { name: 'Food Items', href: '/market/food-items', icon: '🥫' },
      ]
    },
  ];

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
                  width={40}
                  height={40}
                  className="h-10 w-auto group-hover:scale-110 transition-transform duration-300"
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
                    <svg className={`ml-1 h-4 w-4 transform transition-all duration-300 ${
                      activeDropdown === item.key ? 'rotate-180' : 'group-hover:rotate-180'
                    }`} 
                    style={{ color: activeDropdown === item.key ? '#EF4444' : 'currentColor' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    
                    {/* Hover background effect */}
                    <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" 
                         style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }} />
                  </Link>
                  
                  {/* Modern Dropdown */}
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
                            <span className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200">
                              {subItem.icon}
                            </span>
                            <span className="font-medium">{subItem.name}</span>
                            <svg className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-3">

              {/* Account with notification dot */}
              <Link href="/account" className="p-2 rounded-xl transition-all duration-300 group relative"
                    style={{ color: '#1a1a1a' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#EF4444';
                      e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#1a1a1a';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}>
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" 
                     style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }} />
              </Link>

              {/* Cart with animated badge */}
              <Link href="/basket" className="p-2 rounded-xl transition-all duration-300 group relative"
                    style={{ color: '#1a1a1a' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#EF4444';
                      e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#1a1a1a';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}>
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse"
                        style={{ background: 'linear-gradient(45deg, #10B981, #059669)' }}>
                    {cart.totalItems > 99 ? '99+' : cart.totalItems}
                  </span>
                )}
                <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" 
                     style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }} />
              </Link>

              {/* Hamburger menu with morphing animation */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl transition-all duration-300 group relative"
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
                <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
                  <span className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`} />
                  <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`} />
                  <span className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`} />
                </div>
                <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" 
                     style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }} />
              </button>
            </div>
          </div>

          {/* Mobile menu with slide animation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-full bg-white shadow-xl border-t border-gray-200 z-50">
              <div className="py-4 px-4 max-h-96 overflow-y-auto">
                <div className="flex flex-col space-y-1">
                {navigationItems.map((item, index) => (
                  <div key={item.key} className="px-2" style={{ animationDelay: `${index * 100}ms` }}>
                    <button 
                      onClick={() => toggleMobileDropdown(item.key)}
                      className="flex justify-between items-center w-full text-left font-medium px-4 py-3 rounded-xl transition-all duration-300 group"
                      style={{ color: '#1a1a1a' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#EF4444';
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#1a1a1a';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span className="font-semibold">{item.name}</span>
                      <svg className={`h-4 w-4 transform transition-all duration-300 ${
                        mobileDropdowns[item.key] ? 'rotate-180' : ''
                      }`} 
                      style={{ color: mobileDropdowns[item.key] ? '#EF4444' : 'currentColor' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Mobile dropdown items */}
                    <div className={`overflow-hidden transition-all duration-300 ease-out ${
                      mobileDropdowns[item.key] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pl-4 pb-2 space-y-1">
                        {item.items.map((subItem, subIndex) => (
                          <Link 
                            key={subItem.href} 
                            href={subItem.href} 
                            className="flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 group"
                            style={{ 
                              color: '#6B7280',
                              animationDelay: `${subIndex * 50}ms` 
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#EF4444';
                              e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#6B7280';
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <span className="mr-3 text-base group-hover:scale-110 transition-transform duration-200">
                              {subItem.icon}
                            </span>
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;