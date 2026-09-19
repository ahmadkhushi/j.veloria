import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetailClient } from '@/components/shop/ProductDetailClient';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    notFound();
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
    </div>
  );
}
