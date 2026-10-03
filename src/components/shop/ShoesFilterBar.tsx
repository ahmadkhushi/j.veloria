'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SizeOption {
  id: number;
  code: string;
}

interface ShoesFilterBarProps {
  categories: Category[];
  shoeSizes: SizeOption[];
  /** Current active category from URL (server-resolved) */
  initialCategory: string;
  /** Current active size from URL (server-resolved) */
  initialSize: string;
  totalCount: number;
}

export function ShoesFilterBar({
  categories,
  shoeSizes,
  initialCategory,
  initialSize,
  totalCount,
}: ShoesFilterBarProps) {
  // Optimistic local state — highlights instantly on click
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSize, setActiveSize] = useState(initialSize);

  const router = useRouter();
  const [, startTransition] = useTransition();

  const buildUrl = (category: string, size: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (size) params.set('size', size);
    const qs = params.toString();
    return `/shoes${qs ? `?${qs}` : ''}`;
  };

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    // Keep size filter when switching category
    startTransition(() => {
      router.push(buildUrl(slug, activeSize));
    });
  };

  const handleSizeClick = (code: string) => {
    const next = activeSize === code ? '' : code; // toggle off if already selected
    setActiveSize(next);
    startTransition(() => {
      router.push(buildUrl(activeCategory, next));
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleCategoryClick('')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-colors ${
            !activeCategory
              ? 'bg-white text-[#0A192F] border-white'
              : 'bg-[#0A192F] text-slate-300 border-white/10 hover:border-white/30'
          }`}
        >
          All Footwear ({totalCount})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-colors ${
              activeCategory === cat.slug
                ? 'bg-white text-[#0A192F] border-white'
                : 'bg-[#0A192F] text-slate-300 border-white/10 hover:border-white/30'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* EU Size Filter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 uppercase tracking-wider">EU Size:</span>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => handleSizeClick('')}
            className={`px-2 py-1 text-[11px] border transition-colors ${
              !activeSize
                ? 'bg-white text-[#0A192F] border-white'
                : 'border-white/10 text-slate-400 hover:border-white/30'
            }`}
          >
            All
          </button>
          {shoeSizes.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSizeClick(s.code)}
              className={`px-2 py-1 text-[11px] border transition-colors ${
                activeSize === s.code
                  ? 'bg-white text-[#0A192F] border-white'
                  : 'border-white/10 text-slate-400 hover:border-white/30'
              }`}
            >
              {s.code}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
