'use client';

import React from 'react';
import { useCartStore } from '@/lib/cart-store';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (!isOpen) return null;

  const total = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A192F] border-l border-white/10 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#020C1B]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="text-lg font-serif tracking-wider uppercase">Shopping Bag ({items.length})</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
                <ShoppingBag className="w-16 h-16 text-slate-600 stroke-1" />
                <p className="font-serif text-lg text-white">Your shopping bag is empty</p>
                <p className="text-sm max-w-xs text-slate-400">
                  Explore our luxury clothing and footwear collections to add items.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 bg-white text-[#0A192F] font-semibold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-4 p-4 bg-[#112240] border border-white/5 rounded-none"
                >
                  <div className="relative w-20 h-24 bg-[#020C1B] flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.imageUrl || '/placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-sm font-semibold text-white line-clamp-1">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id, item.selectedSize)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Size: <span className="text-white font-medium">{item.selectedSize}</span></p>
                      <p className="text-xs text-slate-400">Department: <span className="text-slate-300">{item.department}</span></p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/20 bg-[#0A192F]">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                          className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                          className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-serif text-sm font-semibold text-white">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#020C1B] border-t border-white/10 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 uppercase tracking-widest text-xs">Subtotal</span>
                <span className="font-serif text-lg font-bold text-white">${total.toLocaleString()}</span>
              </div>
              <p className="text-[#94A3B8] text-xs">Shipping & taxes calculated at checkout.</p>
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-[#0A192F] font-semibold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full block text-center py-2.5 text-xs text-slate-400 hover:text-white uppercase tracking-wider"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
