'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center bg-[#0A192F] border border-white/10 p-8 md:p-12 shadow-2xl space-y-6">
        <span className="text-xs uppercase tracking-[0.35em] text-slate-400 font-light">
          J. VELORIA Luxury Ready-to-Wear
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-bold tracking-wider uppercase">
          Something went wrong
        </h1>
        <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          We encountered an unexpected issue while loading this page. Please try refreshing or return to the homepage.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Loading Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#112240] border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
