import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { CinematicVideoHero } from '@/components/home/CinematicVideoHero';
import { SideScrollCarousel } from '@/components/shop/SideScrollCarousel';
import { ArrowRight, ShieldCheck, Sparkles, Feather } from 'lucide-react';

async function getFeaturedSideScrollProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (e) {
    return [];
  }
}

async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const sideScrollProducts = await getFeaturedSideScrollProducts();
  const regularProducts = await getAllProducts();

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 preserve-3d">
          {/* Clothes Hub Card */}
          <div className="group relative h-[400px] overflow-hidden border border-white/10 bg-[#0A192F] card-3d shimmer-3d shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop"
              alt="J. VELORIA Clothes Collection"
              fill
              className="object-cover opacity-70 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B] via-[#020C1B]/40 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white space-y-3 layer-depth-2">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-300 font-medium">Ready-to-Wear Apparel</span>
              <h3 className="text-2xl md:text-3xl font-serif uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">The Clothes Hub</h3>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                Tailored suits, evening tuxedos, silk dress shirts, and cashmere outerwear ready for immediate wear.
              </p>
              <div className="pt-2 layer-depth-3">
                <Link
                  href="/clothes"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#0A192F] font-semibold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all duration-300 shadow-xl hover:shadow-[0_10px_25px_rgba(255,255,255,0.2)] hover:-translate-y-1 transform-gpu"
                >
                  Explore Clothes <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Shoes Hub Card */}
          <div className="group relative h-[400px] overflow-hidden border border-white/10 bg-[#0A192F] card-3d shimmer-3d shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop"
              alt="J. VELORIA Footwear Collection"
              fill
              className="object-cover opacity-70 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B] via-[#020C1B]/40 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white space-y-3 layer-depth-2">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-300 font-medium">Savoir-Faire Footwear</span>
              <h3 className="text-2xl md:text-3xl font-serif uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">The Shoes Hub</h3>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                Hand-stained calfskin oxfords, Tuscan suede loafers, and Goodyear-welted dress boots.
              </p>
              <div className="pt-2 layer-depth-3">
                <Link
                  href="/shoes"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#0A192F] font-semibold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all duration-300 shadow-xl hover:shadow-[0_10px_25px_rgba(255,255,255,0.2)] hover:-translate-y-1 transform-gpu"
                >
                  Explore Shoes <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Regular Catalog Grid with 3D Depth Card Animations */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 perspective-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Complete Catalog</span>
            <h2 className="text-3xl font-serif text-white uppercase tracking-wider hero-3d-title">All Collections</h2>
          </div>
          <Link
            href="/clothes"
            className="text-xs font-semibold uppercase tracking-widest text-slate-300 hover:text-white flex items-center gap-2 group transition-all"
          >
            View Full Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 preserve-3d">
          {regularProducts.map((prod) => {
            const sizes = Array.isArray(prod.availableSizes) ? (prod.availableSizes as string[]) : [];
            return (
              <div
                key={prod.id}
                className="group bg-[#0A192F] border border-white/10 flex flex-col justify-between card-3d shimmer-3d transform-gpu shadow-xl"
              >
                <div>
                  {/* Reduced Image Height for Mobile (h-36 sm:h-52) */}
                  <div className="relative h-36 sm:h-52 w-full overflow-hidden bg-[#020C1B]">
                    <Image
                      src={prod.imageUrl || '/placeholder.png'}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-[#020C1B]/90 border border-white/20 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider layer-depth-1 shadow-lg">
                      {prod.department}
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2 layer-depth-1">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{prod.brand}</p>
                    <h3 className="font-serif text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {prod.name}
                    </h3>

                    {sizes.length > 0 && (
                      <div className="flex items-center gap-1 pt-0.5">
                        <span className="hidden sm:inline text-[10px] text-slate-400 uppercase tracking-wider">Sizes:</span>
                        <div className="flex flex-wrap gap-1">
                          {sizes.slice(0, 3).map((s) => (
                            <span key={s} className="text-[9px] sm:text-[10px] bg-[#112240] px-1 py-0.5 border border-white/10 text-slate-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="font-serif text-sm sm:text-base font-bold text-white">Rs. {prod.price.toLocaleString()}</span>
                      {prod.salePrice && (
                        <span className="text-[10px] sm:text-xs text-slate-500 line-through">Rs. {prod.salePrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 sm:p-4 pt-0 layer-depth-2">
                  <Link
                    href={`/product/${prod.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 sm:py-2 bg-white/10 border border-white/20 text-white font-semibold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-white hover:text-[#0A192F] transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
