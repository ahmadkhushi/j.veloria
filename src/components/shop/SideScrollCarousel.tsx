'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export interface SideScrollProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  imageUrl: string | null;
  brand: string | null;
  department: string;
  availableSizes: any;
}

export function SideScrollCarousel({ products }: { products: SideScrollProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6 perspective-container">
      {/* Header with Navigation Controls */}
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-white text-xs uppercase tracking-[0.25em] font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Curated Ready-to-Wear</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-wider">
            The Signature Edit
          </h2>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="p-2.5 bg-[#0A192F] border border-white/20 text-white hover:bg-white hover:text-[#0A192F] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2.5 bg-[#0A192F] border border-white/20 text-white hover:bg-white hover:text-[#0A192F] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 px-1 scroll-smooth preserve-3d"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((prod) => {
          const sizes = Array.isArray(prod.availableSizes) ? (prod.availableSizes as string[]) : [];
          return (
            <div
              key={prod.id}
              className="flex-shrink-0 w-64 md:w-72 bg-[#0A192F] border border-white/10 flex flex-col justify-between group snap-start card-3d shimmer-3d transform-gpu"
            >
              <div>
                {/* Compact Product Image Size (h-52) */}
                <div className="relative h-52 w-full overflow-hidden bg-[#020C1B]">
                  <Image
                    src={prod.imageUrl || '/placeholder.png'}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#020C1B]/90 border border-white/20 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider layer-depth-1 shadow-lg">
                    {prod.department}
                  </div>
                  {prod.salePrice && (
                    <div className="absolute top-2.5 right-2.5 bg-white text-[#0A192F] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider layer-depth-1 shadow-lg">
                      Sale
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2 layer-depth-1">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{prod.brand}</p>
                  <h3 className="font-serif text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {prod.name}
                  </h3>

                  {sizes.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sizes:</span>
                      <div className="flex flex-wrap gap-1">
                        {sizes.slice(0, 4).map((s) => (
                          <span key={s} className="text-[10px] bg-[#112240] px-1.5 py-0.5 border border-white/10 text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-serif text-base font-bold text-white">${prod.price.toLocaleString()}</span>
                    {prod.salePrice && (
                      <span className="text-xs text-slate-500 line-through">${prod.salePrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 layer-depth-2">
                <Link
                  href={`/product/${prod.slug}`}
                  className="w-full flex items-center justify-center py-2 bg-white/10 border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:bg-white hover:text-[#0A192F] transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
