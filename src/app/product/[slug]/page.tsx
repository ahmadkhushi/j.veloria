import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductDetailClient } from '@/components/shop/ProductDetailClient';
import { normalizeImageUrl } from '@/lib/image-helper';
import { SafeImage } from '@/components/common/SafeImage';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug || '').toLowerCase().trim();

  let product: any = null;

  try {
    product = await prisma.product.findUnique({
      where: { slug: cleanSlug },
      include: { category: true },
    });

    if (!product) {
      product = await prisma.product.findFirst({
        where: { slug: { equals: cleanSlug } },
        include: { category: true },
      });
    }
  } catch (error) {
    console.error("DB_FETCH_ERROR (ProductPage):", error);
  }

  if (!product || !product.isActive) {
    notFound();
  }

  // Fetch related products (same category or department)
  let relatedProducts: any[] = [];
  try {
    relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        isActive: true,
        OR: [
          ...(product.categoryId ? [{ categoryId: product.categoryId }] : []),
          { department: product.department },
        ],
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    // Fallback if less than 4 matching products exist
    if (relatedProducts.length < 4) {
      const existingIds = [product.id, ...relatedProducts.map((p) => p.id)];
      const fillers = await prisma.product.findMany({
        where: {
          id: { notIn: existingIds },
          isActive: true,
        },
        take: 4 - relatedProducts.length,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      });
      relatedProducts = [...relatedProducts, ...fillers];
    }
  } catch (err) {
    console.error("DB_FETCH_ERROR (RelatedProducts):", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <ProductDetailClient
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          imageUrl: product.imageUrl,
          videoUrl: product.videoUrl,
          brand: product.brand,
          department: product.department,
          availableSizes: product.availableSizes,
          colors: product.colors,
          categoryName: product.category?.name || 'Ready-to-Wear',
        }}
      />

      {/* Related Products / You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">
              Curated Selection
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-wider mt-1">
              You May Also Like
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {relatedProducts.map((prod) => {
              const sizes = Array.isArray(prod.availableSizes) ? (prod.availableSizes as string[]) : [];
              return (
                <Link
                  key={prod.id}
                  href={`/product/${prod.slug}`}
                  className="group bg-[#0A192F] border border-white/10 flex flex-col justify-between shadow-xl cursor-pointer hover:border-white/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="relative h-52 sm:h-72 md:h-80 lg:h-[320px] w-full overflow-hidden bg-[#020C1B]">
                      <SafeImage
                        src={normalizeImageUrl(prod.imageUrl)}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-[#020C1B]/90 border border-white/20 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow-lg">
                        {prod.department}
                      </div>
                      {prod.salePrice && (
                        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 bg-white text-[#0A192F] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow-lg">
                          Sale
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                        {prod.brand || 'J. VELORIA'}
                      </p>
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
                        <span className="font-serif text-sm sm:text-base font-bold text-white">
                          Rs. {(prod.price || 0).toLocaleString()}
                        </span>
                        {prod.salePrice ? (
                          <span className="text-[10px] sm:text-xs text-slate-500 line-through">
                            Rs. {(prod.salePrice || 0).toLocaleString()}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-4 pt-0">
                    <span className="w-full flex items-center justify-center gap-1.5 py-1.5 sm:py-2 bg-white/10 border border-white/20 text-white font-semibold text-[10px] sm:text-xs uppercase tracking-widest group-hover:bg-white group-hover:text-[#0A192F] transition-all duration-300 shadow-md group-hover:shadow-xl">
                      View Details
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
