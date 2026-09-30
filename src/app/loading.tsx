import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-4 p-8">
      <div className="w-10 h-10 border-2 border-white/20 border-t-amber-300 rounded-full animate-spin" />
      <span className="text-xs font-serif uppercase tracking-[0.3em] text-slate-300 font-semibold animate-pulse">
        J. VELORIA Luxury
      </span>
    </div>
  );
}
