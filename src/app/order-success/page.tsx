import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

interface OrderSuccessProps {
  searchParams: Promise<{
    ref?: string;
  }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessProps) {
  const params = await searchParams;
  const orderRef = params.ref || 'JV-981245';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="p-8 bg-[#0A192F] border border-white/20 space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/30">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Order Placed Successfully</span>
          <h1 className="text-3xl font-serif text-white uppercase tracking-wider">Thank You For Your Order</h1>
          <p className="text-xs text-slate-300">
            Your reference number is: <span className="font-mono text-white font-bold text-sm bg-[#020C1B] px-3 py-1 border border-white/10">{orderRef}</span>
          </p>
        </div>

        <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed border-t border-b border-white/10 py-4">
          Our team has received your order and will prepare it for shipping. You will receive a tracking update via phone and SMS once your order is dispatched.
        </p>

        <div className="p-4 bg-[#020C1B] border border-emerald-500/30 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaWhatsapp className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white uppercase">Need Expedited Fitting or Customization?</p>
              <p className="text-[11px] text-slate-400">Message our WhatsApp Concierge with Order Ref: {orderRef}</p>
            </div>
          </div>
          <a
            href={`https://wa.me/923451101520?text=Hello%20J.%20VELORIA,%20I%20have%20placed%20order%20${orderRef}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/clothes"
            className="px-6 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
