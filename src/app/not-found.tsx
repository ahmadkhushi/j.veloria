import React from 'react';
import Link from 'next/link';
import { Home, Shirt, Footprints, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center bg-[#0A192F] border border-white/10 p-8 md:p-12 shadow-2xl space-y-6">
        <span className="text-xs uppercase tracking-[0.35em] text-slate-400 font-light">
          J. VELORIA Luxury Ready-to-Wear
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-white font-bold tracking-wider">
          404
        </h1>
        <h2 className="font-serif text-xl md:text-2xl text-slate-200 font-medium uppercase tracking-wide">
          Page Not Found
        </h2>
        <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          The luxury garment, footwear, or page you requested could not be located. It may have been moved, updated, or is temporarily unavailable.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            href="/clothes"
            className="w-full sm:w-auto px-6 py-3 bg-[#112240] border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Shirt className="w-4 h-4" /> Clothes Hub
          </Link>
          <Link
            href="/shoes"
            className="w-full sm:w-auto px-6 py-3 bg-[#112240] border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Footprints className="w-4 h-4" /> Shoes Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
