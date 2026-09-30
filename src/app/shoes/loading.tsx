import React from 'react';

export default function CatalogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8 animate-pulse">
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="h-3 w-32 bg-white/10" />
        <div className="h-8 w-64 bg-white/15" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-[#0A192F]/60 border border-white/10 flex flex-col justify-between h-[360px] sm:h-[460px]">
            <div className="h-52 sm:h-72 w-full bg-white/5" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-white/10" />
              <div className="h-4 w-3/4 bg-white/15" />
              <div className="h-4 w-20 bg-white/10" />
            </div>
            <div className="p-4 pt-0">
              <div className="h-8 w-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
