'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart-store';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const activeItems = mounted ? items : [];
  const total = mounted ? getTotalPrice() : 0;

  if (!mounted || activeItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto stroke-1" />
        <h1 className="text-3xl font-serif text-white uppercase tracking-wider">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Explore our Clothes and Shoes collections to select premium ready-to-wear garments and luxury shoes.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/clothes"
            className="px-6 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Browse Clothes
          </Link>
          <Link
            href="/shoes"
            className="px-6 py-3 bg-[#0A192F] border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Browse Shoes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Shopping Bag</span>
          <h1 className="text-3xl font-serif text-white uppercase tracking-wider">Selected Creations ({items.length})</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-red-400 uppercase tracking-wider flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize}`}
              className="bg-[#0A192F] border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-28 bg-[#020C1B] overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{item.department}</span>
                  <h3 className="font-serif text-base font-semibold text-white">{item.name}</h3>
                  <p className="text-xs text-slate-300">Size: <span className="font-bold text-white">{item.selectedSize}</span></p>
                  <p className="text-xs text-slate-400">Price: ${item.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0">
                <div className="flex items-center border border-white/20 bg-[#020C1B]">
                  <button
                    onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                    className="px-3 py-1 text-slate-300 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs text-white font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                    className="px-3 py-1 text-slate-300 hover:text-white"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-serif text-base font-bold text-white">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeItem(item.id, item.selectedSize)}
                    className="text-[11px] text-slate-400 hover:text-red-400 mt-1 uppercase"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-[#0A192F] border border-white/10 p-8 space-y-6 h-fit">
          <h2 className="font-serif text-lg uppercase tracking-wider text-white border-b border-white/10 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-white">${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Premium Shipping</span>
              <span className="text-emerald-400 font-medium">Complimentary</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Duties</span>
              <span className="text-slate-400">Included</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-bold text-white">
              <span className="uppercase tracking-wider">Total</span>
              <span className="font-serif text-lg">${total.toLocaleString()}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 py-4 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
