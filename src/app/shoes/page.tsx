import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

interface SearchParamsProps {
  searchParams: Promise<{
    category?: string;
    size?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ShoesHubPage({ searchParams }: SearchParamsProps) {
  const params = await searchParams;
  const categoryFilter = params.category || '';
  const sizeFilter = params.size || '';
  const sortFilter = params.sort || 'newest';
  const searchQuery = params.search || '';

  // Fetch footwear categories
  const categories = await prisma.category.findMany({
    where: { department: 'SHOES' },
  });

  // Fetch shoe size options
  const shoeSizes = await prisma.sizeOption.findMany({
    where: { type: 'FOOTWEAR', isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  // Build query filter
  const whereCondition: any = {
    isActive: true,
    department: 'SHOES',
  };

  if (categoryFilter) {
    whereCondition.category = { slug: categoryFilter };
  }

  if (searchQuery) {
    whereCondition.OR = [
      { name: { contains: searchQuery } },
      { description: { contains: searchQuery } },
      { keywords: { contains: searchQuery } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sortFilter === 'price_asc') orderBy = { price: 'asc' };
  if (sortFilter === 'price_desc') orderBy = { price: 'desc' };

  let products = await prisma.product.findMany({
    where: whereCondition,
    include: { category: true },
    orderBy,
  });

  if (sizeFilter) {
    products = products.filter((p) => {
      const sizes = Array.isArray(p.availableSizes) ? (p.availableSizes as string[]) : [];
      return sizes.includes(sizeFilter);
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#0A192F] border border-white/10 p-8 md:p-10 text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Savoir-Faire Footwear</span>
        <h1 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-wider">The Shoes Hub</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Hand-finished ready-to-wear calfskin oxfords, Tuscan suede Venetian loafers, Goodyear-welted boots, and low-top sneakers.
        </p>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/shoes"
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-all ${
              !categoryFilter
                ? 'bg-white text-[#0A192F] border-white'
                : 'bg-[#0A192F] text-slate-300 border-white/10 hover:border-white/30'
            }`}
          >
            All Footwear ({products.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shoes?category=${cat.slug}${sizeFilter ? `&size=${sizeFilter}` : ''}`}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-all ${
                categoryFilter === cat.slug
                  ? 'bg-white text-[#0A192F] border-white'
                  : 'bg-[#0A192F] text-slate-300 border-white/10 hover:border-white/30'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Shoe Size Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 uppercase tracking-wider">EU Size:</span>
          <div className="flex flex-wrap gap-1">
            <Link
              href={`/shoes${categoryFilter ? `?category=${categoryFilter}` : ''}`}
              className={`px-2 py-1 text-[11px] border ${!sizeFilter ? 'bg-white text-[#0A192F]' : 'border-white/10 text-slate-400'}`}
            >
              All
            </Link>
            {shoeSizes.map((s) => (
              <Link
                key={s.id}
                href={`/shoes?size=${s.code}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                className={`px-2 py-1 text-[11px] border ${sizeFilter === s.code ? 'bg-white text-[#0A192F]' : 'border-white/10 text-slate-400'}`}
              >
                {s.code}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid (Compact h-52 Image Height) */}
      {products.length === 0 ? (
        <div className="py-20 text-center text-slate-400 space-y-3 border border-white/5 bg-[#0A192F]">
          <p className="font-serif text-lg text-white">No footwear matches your selected filters</p>
          <Link href="/shoes" className="inline-block mt-4 px-6 py-2.5 bg-white text-[#0A192F] font-bold text-xs uppercase">
            Reset Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((prod) => {
            const sizes = Array.isArray(prod.availableSizes) ? (prod.availableSizes as string[]) : [];
            return (
              <div
                key={prod.id}
                className="group bg-[#0A192F] border border-white/10 flex flex-col justify-between transition-all duration-300 hover:border-white/30"
              >
                <div>
                  {/* Compact Image Height: h-52 */}
                  <div className="relative h-52 w-full overflow-hidden bg-[#020C1B]">
                    <Image
                      src={prod.imageUrl || '/placeholder.png'}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#020C1B]/90 border border-white/20 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {prod.category?.name || 'Footwear'}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{prod.brand}</p>
                    <h3 className="font-serif text-sm font-semibold text-white group-hover:text-slate-200 line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{prod.description}</p>

                    {sizes.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sizes:</span>
                        <div className="flex flex-wrap gap-1">
                          {sizes.map((s) => (
                            <span key={s} className="text-[10px] bg-[#112240] px-1.5 py-0.5 border border-white/10 text-slate-200">
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

                <div className="p-4 pt-0">
                  <Link
                    href={`/product/${prod.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:bg-white hover:text-[#0A192F] transition-all"
                  >
                    Select Shoe Size & Order
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
