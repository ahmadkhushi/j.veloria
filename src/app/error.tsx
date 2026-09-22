'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Navigation Error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">J. VELORIA Executive Support</span>
        <h1 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-wider">Page Temporarily Unavailable</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          We encountered a temporary connection issue while loading live collection data. Please click below to try again or return home.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto px-6 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 bg-[#0A192F] border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
