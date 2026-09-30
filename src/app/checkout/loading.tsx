import React from 'react';

export default function CheckoutLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8 animate-pulse">
      <div className="space-y-2 text-center">
        <div className="h-3 w-28 bg-white/10 mx-auto" />
        <div className="h-8 w-60 bg-white/15 mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 bg-[#0A192F]/60 p-6 border border-white/10">
          <div className="h-6 w-40 bg-white/15" />
          <div className="space-y-4">
            <div className="h-10 w-full bg-white/10" />
            <div className="h-10 w-full bg-white/10" />
            <div className="h-10 w-full bg-white/10" />
          </div>
        </div>

        <div className="space-y-4 bg-[#0A192F]/60 p-6 border border-white/10 h-64">
          <div className="h-6 w-32 bg-white/15" />
          <div className="h-4 w-full bg-white/10" />
          <div className="h-4 w-full bg-white/10" />
          <div className="h-12 w-full bg-white/20 mt-4" />
        </div>
      </div>
    </div>
  );
}
