'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle, PhoneCall } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [query, setQuery] = useState(initialRef);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchOrder = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/track-order?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || 'No order found matching this reference');
      }
    } catch (e) {
      setError('Failed to connect to order tracking service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchOrder(initialRef);
    }
  }, [initialRef]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  const getStatusStep = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'DELIVERED') return 4;
    if (s === 'SHIPPED') return 3;
    if (s === 'PROCESSING' || s === 'PACKED' || s === 'PLACED') return 2;
    return 1; // PENDING
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Order Tracking</span>
        <h1 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-wider flex items-center justify-center gap-3">
          <Truck className="w-8 h-8 text-amber-300" /> Live Order Tracking
        </h1>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Enter your Order Reference Number (e.g., JV-739142) or Phone Number to view live status updates.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0A192F] border border-white/10 p-6 shadow-2xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order Ref (e.g. JV-981245 or Phone Number)"
              className="w-full bg-[#020C1B] border border-white/20 pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>
      </div>

      {/* Error Feedback */}
      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-200 text-xs text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Order Details & Status Stepper */}
      {order && (
        <div className="bg-[#0A192F] border border-white/10 p-6 md:p-8 space-y-8 shadow-2xl">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400">Order Reference</span>
              <h2 className="font-mono text-2xl font-bold text-white tracking-wider">{order.orderRef}</h2>
              <p className="text-xs text-slate-400 mt-1">Customer: <span className="text-white font-semibold">{order.customerName}</span></p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase tracking-widest text-slate-400">Current Status</span>
              <div>
                <span className="inline-block mt-1 px-3 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold uppercase text-xs tracking-wider">
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Visual 4-Step Live Tracking Progress Bar */}
          <div className="space-y-4 py-4">
            <h3 className="text-xs font-serif uppercase tracking-widest text-slate-300 font-semibold">Delivery Timeline</h3>
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {/* Step 1: Pending */}
              <div className={`flex flex-col items-center space-y-2 ${currentStep >= 1 ? 'text-white' : 'text-slate-600'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs ${
                  currentStep >= 1 ? 'bg-white text-[#0A192F] border-white' : 'bg-[#020C1B] border-slate-700'
                }`}>
                  1
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Order Received</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">Pending Verification</span>
              </div>

              {/* Step 2: Packed / Processing */}
              <div className={`flex flex-col items-center space-y-2 ${currentStep >= 2 ? 'text-white' : 'text-slate-600'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs ${
                  currentStep >= 2 ? 'bg-white text-[#0A192F] border-white' : 'bg-[#020C1B] border-slate-700'
                }`}>
                  2
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Packed & Tailored</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">Quality Inspection</span>
              </div>

              {/* Step 3: Shipped */}
              <div className={`flex flex-col items-center space-y-2 ${currentStep >= 3 ? 'text-white' : 'text-slate-600'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs ${
                  currentStep >= 3 ? 'bg-white text-[#0A192F] border-white' : 'bg-[#020C1B] border-slate-700'
                }`}>
                  3
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Shipped</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">With Express Courier</span>
              </div>

              {/* Step 4: Delivered */}
              <div className={`flex flex-col items-center space-y-2 ${currentStep >= 4 ? 'text-white' : 'text-slate-600'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs ${
                  currentStep >= 4 ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-[#020C1B] border-slate-700'
                }`}>
                  4
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Delivered</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">Hand Delivered</span>
              </div>
            </div>
          </div>

          {/* Order Items Breakdown */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-serif uppercase tracking-widest text-slate-300 font-semibold">Items in this Package</h3>
            <div className="space-y-3">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 bg-[#020C1B] p-4 border border-white/10">
                  <div className="relative w-16 h-20 bg-[#0A192F] flex-shrink-0">
                    <Image src={item.imageUrl || '/placeholder.png'} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-xs space-y-1">
                    <h4 className="font-serif font-bold text-white">{item.name}</h4>
                    <p className="text-slate-400">Selected Size: <span className="text-white font-bold">{item.selectedSize}</span></p>
                    <p className="text-slate-400">Department: <span className="text-slate-300">{item.department}</span> | Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right font-serif text-sm font-bold text-white">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support Link */}
          <div className="p-4 bg-[#020C1B] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaWhatsapp className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white uppercase">Questions about your order delivery?</p>
                <p className="text-slate-400">Connect directly with our Logistics Concierge on +923451101520</p>
              </div>
            </div>
            <a
              href={`https://wa.me/923451101520?text=Hello%20J.%20VELORIA,%20I%20am%20tracking%20order%20${order.orderRef}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400 text-xs">Loading order tracking...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
