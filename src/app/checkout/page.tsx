'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { ShieldCheck, Truck, Lock, CreditCard, Banknote } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: 'Faisalabad',
    paymentMethod: 'cod',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif text-white uppercase">Your Bag is Empty</h1>
        <p className="text-xs text-slate-400">Please select garments or shoes before proceeding to checkout.</p>
        <button
          onClick={() => router.push('/clothes')}
          className="mt-4 px-6 py-2.5 bg-white text-[#0A192F] font-bold text-xs uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items,
          total,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        router.push(`/order-success?ref=${data.orderRef}`);
      } else {
        setErrorMsg(data.error || 'Failed to place order.');
      }
    } catch (err) {
      setErrorMsg('An unexpected network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="border-b border-white/10 pb-6 text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Secure Checkout</span>
        <h1 className="text-3xl font-serif text-white uppercase tracking-wider">Order Verification</h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-200 text-xs text-center">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Delivery & Billing Form */}
        <div className="lg:col-span-2 bg-[#0A192F] border border-white/10 p-8 space-y-6">
          <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4">
            1. Delivery Information
          </h2>

          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Full Name (Required)
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white"
                placeholder="Lord / Lady / Mr. John Smith"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Phone Number (For Courier SMS)
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white"
                  placeholder="03451101520"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Complete Delivery Address
              </label>
              <textarea
                rows={3}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white"
                placeholder="Street address, Suite, Residence, Postal Code..."
              />
            </div>

            <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wider border-b border-white/10 pt-4 pb-4">
              2. Payment Protocol
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'bg-[#112240] border-white text-white'
                    : 'bg-[#020C1B] border-white/10 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className="accent-white"
                />
                <Banknote className="w-5 h-5 text-white" />
                <div>
                  <p className="text-xs font-bold text-white uppercase">Cash on Delivery (COD)</p>
                  <p className="text-[11px] text-slate-400">Pay white-glove courier upon receiving and fitting your order.</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
                  formData.paymentMethod === 'bank'
                    ? 'bg-[#112240] border-white text-white'
                    : 'bg-[#020C1B] border-white/10 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={formData.paymentMethod === 'bank'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'bank' })}
                  className="accent-white"
                />
                <CreditCard className="w-5 h-5 text-white" />
                <div>
                  <p className="text-xs font-bold text-white uppercase">Direct VIP Bank Transfer</p>
                  <p className="text-[11px] text-slate-400">Wire transfer directly to J. VELORIA bank account.</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-4 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-colors"
            >
              {submitting ? 'Confirming Order...' : 'Confirm Order & Place Order'}
            </button>
          </form>
        </div>

        {/* Selected Items Summary */}
        <div className="bg-[#0A192F] border border-white/10 p-6 space-y-6 h-fit">
          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
            Summary ({items.length} items)
          </h3>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className="relative w-14 h-16 bg-[#020C1B] flex-shrink-0">
                  <Image src={item.imageUrl || '/placeholder.png'} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-serif font-semibold text-white line-clamp-1">{item.name}</p>
                  <p className="text-slate-400 text-[11px]">Size: <span className="text-white">{item.selectedSize}</span> | Qty: {item.quantity}</p>
                  <p className="font-semibold text-white mt-0.5">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between text-sm font-bold text-white">
              <span>Total Payable</span>
              <span className="font-serif text-lg">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
