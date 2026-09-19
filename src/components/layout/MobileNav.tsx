'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shirt, Footprints, ShoppingBag, PhoneCall } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export function MobileNav() {
  const pathname = usePathname();
  const { getTotalCount, openCart } = useCartStore();
  const itemCount = getTotalCount();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Clothes', href: '/clothes', icon: Shirt },
    { label: 'Shoes', href: '/shoes', icon: Footprints },
    { label: 'Contact', href: '/contact', icon: PhoneCall },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#020C1B]/95 backdrop-blur-lg border-t border-white/10 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-2' : 'stroke-1'}`} />
              <span className="text-[10px] font-medium tracking-wider uppercase">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ShoppingBag className="w-5 h-5 stroke-1" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 bg-white text-[#0A192F] text-[9px] font-bold rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-wider uppercase">Bag</span>
        </button>
      </div>
    </div>
  );
}
