'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Truck } from 'lucide-react';

interface CustomPageHeaderLink {
  id: number;
  title: string;
  slug: string;
}

interface HeaderProps {
  dynamicPages?: CustomPageHeaderLink[];
  isAdmin?: boolean;
}

export function Header({ dynamicPages = [], isAdmin = false }: HeaderProps) {
  const { getTotalCount, openCart } = useCartStore();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? getTotalCount() : 0;

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top Announcement Bar - Clean Single Text Line */}
      <div className="bg-[#020C1B] border-b border-white/10 text-xs text-slate-300 py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Top Shipping Announcement & Optional Admin Badge */}
          <div className="flex items-center gap-4 text-[10px] sm:text-[11px] font-medium tracking-wider sm:tracking-widest uppercase text-slate-300">
            <span>FREE SHIPPING IN PAKISTAN OVER RS. 5000</span>

            {/* Admin Portal Link: ONLY VISIBLE TO LOGGED-IN ADMIN */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all text-[10px] tracking-wider rounded-sm ml-2"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase font-semibold">Admin Portal</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Header: Logo Left-Aligned & Single Line */}
      <div
        className={`px-4 md:px-8 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-2xl py-3 border-b border-white/10'
            : 'bg-[#0A192F] py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Side: Brand Wordmark Logo & Main Nav */}
          <div className="flex items-center space-x-8 md:space-x-10">
            {/* Logo forced to single line */}
            <Link href="/" className="flex flex-col items-start shrink-0">
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-[0.2em] text-white uppercase whitespace-nowrap">
                J. VELORIA
              </span>
              <span className="text-[8px] uppercase tracking-[0.35em] text-slate-300 font-light -mt-1 whitespace-nowrap">
                LUXURY READY-TO-WEAR
              </span>
            </Link>

            {/* Desktop Navigation Links with Dynamic Active Highlights */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium uppercase tracking-widest">
              <Link
                href="/"
                className={`py-1 relative group transition-colors ${
                  isActive('/') ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Home
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-amber-400 transition-all ${
                    isActive('/') ? 'w-full' : 'w-0 group-hover:w-full bg-white'
                  }`}
                ></span>
              </Link>

              <Link
                href="/clothes"
                className={`py-1 relative group transition-colors ${
                  isActive('/clothes') ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Clothes
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-amber-400 transition-all ${
                    isActive('/clothes') ? 'w-full' : 'w-0 group-hover:w-full bg-white'
                  }`}
                ></span>
              </Link>

              <Link
                href="/shoes"
                className={`py-1 relative group transition-colors ${
                  isActive('/shoes') ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Shoes
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-amber-400 transition-all ${
                    isActive('/shoes') ? 'w-full' : 'w-0 group-hover:w-full bg-white'
                  }`}
                ></span>
              </Link>

              {/* Track Order - Dynamic Active State (No Permanent Yellow) */}
              <Link
                href="/track-order"
                className={`py-1 relative group transition-colors flex items-center gap-1.5 ${
                  isActive('/track-order') ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Track Order
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-amber-400 transition-all ${
                    isActive('/track-order') ? 'w-full' : 'w-0 group-hover:w-full bg-white'
                  }`}
                ></span>
              </Link>

              {/* Dynamic Custom Pages Links */}
              {dynamicPages.map((page) => {
                const pagePath = `/pages/${page.slug}`;
                const active = isActive(pagePath);
                return (
                  <Link
                    key={page.id}
                    href={pagePath}
                    className={`py-1 relative group transition-colors ${
                      active ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {page.title}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-amber-400 transition-all ${
                        active ? 'w-full' : 'w-0 group-hover:w-full bg-white'
                      }`}
                    ></span>
                  </Link>
                );
              })}

              <Link
                href="/contact"
                className={`py-1 relative group transition-colors ${
                  isActive('/contact') ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Contact Us
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-amber-400 transition-all ${
                    isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full bg-white'
                  }`}
                ></span>
              </Link>
            </nav>
          </div>

          {/* Right Utilities (Search, Cart, Mobile Menu Button) */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              title="Search Collections"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={openCart}
              className="relative p-2 text-slate-300 hover:text-white transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-[#0A192F] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Overlay Drawer */}
      {searchOpen && (
        <div className="bg-[#020C1B] border-b border-white/10 p-4 text-white">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search luxury suits, shoes, coats, oxfords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder-slate-500"
              autoFocus
            />
            {searchQuery && (
              <Link
                href={`/clothes?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => setSearchOpen(false)}
                className="px-4 py-1.5 bg-white text-[#0A192F] text-xs font-semibold uppercase tracking-wider"
              >
                Search
              </Link>
            )}
            <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-white text-xs uppercase">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Slide Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A192F] border-b border-white/10 py-6 px-6 space-y-4">
          <nav className="flex flex-col space-y-4 text-sm font-medium uppercase tracking-widest text-slate-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={isActive('/') ? 'text-amber-400 font-bold border-l-2 border-amber-400 pl-2' : 'hover:text-white text-slate-200'}
            >
              Home
            </Link>
            <Link
              href="/clothes"
              onClick={() => setMobileMenuOpen(false)}
              className={isActive('/clothes') ? 'text-amber-400 font-bold border-l-2 border-amber-400 pl-2' : 'hover:text-white text-slate-200'}
            >
              Clothes Collection
            </Link>
            <Link
              href="/shoes"
              onClick={() => setMobileMenuOpen(false)}
              className={isActive('/shoes') ? 'text-amber-400 font-bold border-l-2 border-amber-400 pl-2' : 'hover:text-white text-slate-200'}
            >
              Shoes Collection
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className={isActive('/track-order') ? 'text-amber-400 font-bold border-l-2 border-amber-400 pl-2 flex items-center gap-1.5' : 'hover:text-white text-slate-200 flex items-center gap-1.5'}
            >
              <Truck className="w-4 h-4" />
              Track Order
            </Link>
            {dynamicPages.map((page) => {
              const pagePath = `/pages/${page.slug}`;
              const active = isActive(pagePath);
              return (
                <Link
                  key={page.id}
                  href={pagePath}
                  onClick={() => setMobileMenuOpen(false)}
                  className={active ? 'text-amber-400 font-bold border-l-2 border-amber-400 pl-2' : 'hover:text-white text-slate-300'}
                >
                  {page.title}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={isActive('/contact') ? 'text-amber-400 font-bold border-l-2 border-amber-400 pl-2' : 'hover:text-white text-slate-200'}
            >
              Contact Us
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-300 text-amber-400 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Admin Portal
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
