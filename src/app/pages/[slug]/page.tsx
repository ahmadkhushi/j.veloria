import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

interface CustomPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CustomPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.customPage.findUnique({
    where: { slug },
  });

  if (!page) return { title: 'Page Not Found | J. VELORIA' };

  return {
    title: page.metaTitle || `${page.title} | J. VELORIA`,
    description: page.metaDescription || `Read ${page.title} on J. VELORIA luxury fashion platform.`,
  };
}

export default async function CustomDynamicPage({ params }: CustomPageProps) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug || '').toLowerCase().trim();

  let page = await prisma.customPage.findUnique({
    where: { slug: cleanSlug },
  });

  if (!page) {
    page = await prisma.customPage.findFirst({
      where: { slug: { equals: cleanSlug } },
    });
  }

  if (!page || !page.isPublished) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">J. VELORIA Official</span>
        <h1 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-wider">{page.title}</h1>
        <div className="w-16 h-0.5 bg-white mx-auto mt-4"></div>
      </div>

      {/* Content Renderer */}
      <div className="bg-[#0A192F] border border-white/10 p-6 md:p-10 shadow-2xl">
        <div
          className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}
