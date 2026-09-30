import React from 'react';

export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-pulse space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Media Skeleton */}
        <div className="h-[480px] sm:h-[640px] lg:h-[720px] w-full bg-[#0A192F]/70 border border-white/10" />

        {/* Product Information Skeleton */}
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="h-3 w-28 bg-white/10" />
            <div className="h-9 w-3/4 bg-white/15" />
            <div className="h-7 w-36 bg-white/10" />
          </div>

          <div className="border-t border-b border-white/10 py-4 space-y-2">
            <div className="h-3.5 w-full bg-white/10" />
            <div className="h-3.5 w-5/6 bg-white/10" />
            <div className="h-3.5 w-2/3 bg-white/10" />
          </div>

          <div className="space-y-3">
            <div className="h-3.5 w-32 bg-white/10" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-14 bg-white/10 border border-white/10" />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="h-12 w-full bg-white/20" />
            <div className="h-12 w-full bg-white/10 border border-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
