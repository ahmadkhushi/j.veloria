import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CinematicVideoHero } from '@/components/home/CinematicVideoHero';
import { SideScrollCarousel } from '@/components/shop/SideScrollCarousel';
import { ArrowRight, ShieldCheck, Sparkles, Feather } from 'lucide-react';

export const revalidate = 60;

async function getFeaturedSideScrollProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (e) {
    console.error("DB_FETCH_ERROR (HomePage Featured):", e);
    return [];
  }
}


export default async function HomePage() {
  const sideScrollProducts = await getFeaturedSideScrollProducts();

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Cinematic Video Hero Showcase Section (Centered, Upward Shifted, Ready-to-Wear Tagline) */}
      <CinematicVideoHero />

      {/* 2. Brand Value Bar with 3D Card Depth & Ambient Rim Highlights */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 perspective-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 px-6 bg-[#0A192F]/90 backdrop-blur-md border border-white/10 text-center shadow-2xl preserve-3d">
          <div className="flex flex-col items-center space-y-2 p-4 card-3d shimmer-3d group cursor-default">
            <Feather className="w-6 h-6 text-slate-300 stroke-1 group-hover:scale-125 group-hover:text-amber-300 transition-all duration-500 layer-depth-2" />
            <h3 className="font-serif text-sm uppercase tracking-widest text-white font-semibold group-hover:text-amber-300 transition-colors layer-depth-1">Premium Craftsmanship</h3>
            <p className="text-xs text-slate-400 leading-relaxed layer-depth-1">Crafted from the finest materials to ensure unmatched comfort, durability, and a luxurious feel everyday.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 border-y md:border-y-0 md:border-x border-white/10 card-3d shimmer-3d group cursor-default">
            <ShieldCheck className="w-6 h-6 text-slate-300 stroke-1 group-hover:scale-125 group-hover:text-amber-300 transition-all duration-500 layer-depth-2" />
            <h3 className="font-serif text-sm uppercase tracking-widest text-white font-semibold group-hover:text-amber-300 transition-colors layer-depth-1">Impeccable Fit</h3>
            <p className="text-xs text-slate-400 leading-relaxed layer-depth-1">Expertly designed for a flawless, modern fit right off the rack—saving you time with zero need for alterations.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 card-3d shimmer-3d group cursor-default">
            <Sparkles className="w-6 h-6 text-slate-300 stroke-1 group-hover:scale-125 group-hover:text-amber-300 transition-all duration-500 layer-depth-2" />
            <h3 className="font-serif text-sm uppercase tracking-widest text-white font-semibold group-hover:text-amber-300 transition-colors layer-depth-1">Priority Pakistan Delivery</h3>
            <p className="text-xs text-slate-400 leading-relaxed layer-depth-1">Enjoy fast, complimentary shipping across Pakistan straight to your doorstep, backed by our dedicated premium customer support.</p>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Side-Scroll Carousel Section (Independently Managed in Admin) */}
      {sideScrollProducts.length > 0 && (
        <SideScrollCarousel products={sideScrollProducts} />
      )}

      {/* 4. Department Hubs Showcase: Clothes vs Shoes with 3D Depth Viewports */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 perspective-container">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Explore Our Universe</span>
          <h2 className="text-3xl md:text-4xl font-serif text-white uppercase tracking-wider hero-3d-title">The Signature Hubs</h2>
          <div className="w-16 h-0.5 bg-white mx-auto mt-4 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Clothes Hub Card */}
          <Link
            href="/clothes"
            className="block group relative h-[400px] overflow-hidden border border-white/10 bg-[#0A192F] shadow-2xl cursor-pointer transition-all duration-300 hover:border-white/30"
          >
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop"
              alt="J. VELORIA Clothes Collection"
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B] via-[#020C1B]/40 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-300 font-medium">Ready-to-Wear Apparel</span>
              <h3 className="text-2xl md:text-3xl font-serif uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">The Clothes Hub</h3>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                Tailored suits, evening tuxedos, silk dress shirts, and cashmere outerwear ready for immediate wear.
              </p>
              <div className="pt-2">
                <span
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#0A192F] font-semibold text-xs uppercase tracking-widest group-hover:bg-slate-200 transition-all duration-300 shadow-xl group-hover:shadow-[0_10px_25px_rgba(255,255,255,0.2)]"
                >
                  Explore Clothes <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Shoes Hub Card */}
          <Link
            href="/shoes"
            className="block group relative h-[400px] overflow-hidden border border-white/10 bg-[#0A192F] shadow-2xl cursor-pointer transition-all duration-300 hover:border-white/30"
          >
            <img
              src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop"
              alt="J. VELORIA Footwear Collection"
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B] via-[#020C1B]/40 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-300 font-medium">Savoir-Faire Footwear</span>
              <h3 className="text-2xl md:text-3xl font-serif uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">The Shoes Hub</h3>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                Hand-stained calfskin oxfords, Tuscan suede loafers, and Goodyear-welted dress boots.
              </p>
              <div className="pt-2">
                <span
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#0A192F] font-semibold text-xs uppercase tracking-widest group-hover:bg-slate-200 transition-all duration-300 shadow-xl group-hover:shadow-[0_10px_25px_rgba(255,255,255,0.2)]"
                >
                  Explore Shoes <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
