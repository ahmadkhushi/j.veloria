'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart-store';
import { ShoppingBag, Check, ShieldCheck, Truck, RotateCcw, Info, Film } from 'lucide-react';
import Link from 'next/link';

interface ProductProps {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  brand: string | null;
  department: string;
  availableSizes: any;
  colors: any;
  categoryName: string;
}

export function ProductDetailClient({ product }: { product: ProductProps }) {
  const sizes = Array.isArray(product.availableSizes) ? (product.availableSizes as string[]) : [];
  const colorsList = Array.isArray(product.colors) ? product.colors : [];

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(colorsList[0]?.name || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedSize && sizes.length > 0) {
      alert('Please select a size before adding to bag.');
      return;
    }

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.salePrice || product.price,
      imageUrl: product.imageUrl || '/placeholder.png',
      selectedSize,
      selectedColor,
      department: product.department,
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Media Gallery / Video Preview */}
      <div className="space-y-4">
        <div className="relative h-[500px] w-full bg-[#020C1B] border border-white/10 overflow-hidden">
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            fill
            priority
            className="object-cover"
          />
          {product.salePrice && (
            <span className="absolute top-4 left-4 bg-white text-[#0A192F] text-xs font-bold px-3 py-1 uppercase tracking-wider">
              Sale Event
            </span>
          )}
        </div>

        {/* Video Preview section if available */}
        {product.videoUrl && (
          <div className="p-4 bg-[#0A192F] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Film className="w-4 h-4 text-white" />
              <span className="uppercase tracking-widest font-semibold text-white">Product Video & Showcase</span>
            </div>
            <video controls className="w-full h-44 object-cover border border-white/10">
              <source src={product.videoUrl} type="video/mp4" />
            </video>
          </div>
        )}
      </div>

      {/* Product Information & Sizing Form */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">
              {product.brand || 'J. VELORIA'}
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Dept: <span className="text-white font-medium">{product.department}</span>
            </span>
          </div>

          <h1 className="text-3xl font-serif text-white uppercase tracking-wide mt-2">{product.name}</h1>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-2xl font-serif font-bold text-white">${product.price.toLocaleString()}</span>
            {product.salePrice && (
              <span className="text-sm text-slate-500 line-through">${product.salePrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        <div className="border-t border-b border-white/10 py-4">
          <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>
        </div>

        {/* Size Selection */}
        {sizes.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="uppercase tracking-wider font-semibold text-slate-300">
                Select {product.department === 'SHOES' ? 'Footwear Size' : 'Garment Size'}:
              </span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-slate-400 hover:text-white flex items-center gap-1 uppercase tracking-wider"
              >
                <Info className="w-3.5 h-3.5" /> Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border transition-all ${
                    selectedSize === s
                      ? 'bg-white text-[#0A192F] border-white font-bold'
                      : 'bg-[#0A192F] text-slate-300 border-white/20 hover:border-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="space-y-4 pt-2">
          <div className="flex gap-4">
            <div className="flex items-center border border-white/20 bg-[#0A192F]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-slate-300 hover:text-white"
              >
                -
              </button>
              <span className="px-4 py-2 text-xs text-white font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-slate-300 hover:text-white"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-6 font-semibold text-xs uppercase tracking-widest transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-[#0A192F] hover:bg-slate-200'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Shopping Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                </>
              )}
            </button>
          </div>

          <Link
            href="/checkout"
            className="w-full block text-center py-3.5 bg-transparent border border-white/30 text-white font-semibold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Instant Express Checkout
          </Link>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-white" />
            <span>Global Express Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>100% Ready-to-Wear Luxury</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-white" />
            <span>Complimentary Returns</span>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A192F] border border-white/20 p-6 md:p-8 max-w-xl w-full text-white space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider">
                {product.department === 'SHOES' ? 'Footwear Sizing Chart' : 'Clothing Sizing Chart'}
              </h3>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="text-slate-400 hover:text-white uppercase text-xs"
              >
                Close
              </button>
            </div>

            {product.department === 'SHOES' ? (
              <div className="text-xs space-y-3">
                <p className="text-slate-300">All J. VELORIA footwear uses standard European sizing (EU).</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border border-white/10">
                    <thead className="bg-[#020C1B]">
                      <tr>
                        <th className="p-2 border-b border-white/10">EU</th>
                        <th className="p-2 border-b border-white/10">US</th>
                        <th className="p-2 border-b border-white/10">UK</th>
                        <th className="p-2 border-b border-white/10">CM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr><td className="p-2 font-bold">39</td><td className="p-2">6.5</td><td className="p-2">5.5</td><td className="p-2">25.0</td></tr>
                      <tr><td className="p-2 font-bold">40</td><td className="p-2">7.5</td><td className="p-2">6.5</td><td className="p-2">25.7</td></tr>
                      <tr><td className="p-2 font-bold">41</td><td className="p-2">8.5</td><td className="p-2">7.5</td><td className="p-2">26.4</td></tr>
                      <tr><td className="p-2 font-bold">42</td><td className="p-2">9.5</td><td className="p-2">8.5</td><td className="p-2">27.0</td></tr>
                      <tr><td className="p-2 font-bold">43</td><td className="p-2">10.5</td><td className="p-2">9.5</td><td className="p-2">27.7</td></tr>
                      <tr><td className="p-2 font-bold">44</td><td className="p-2">11.5</td><td className="p-2">10.5</td><td className="p-2">28.4</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-xs space-y-3">
                <p className="text-slate-300">Garment measurements for J. VELORIA ready-to-wear clothing and suits.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border border-white/10">
                    <thead className="bg-[#020C1B]">
                      <tr>
                        <th className="p-2 border-b border-white/10">Size</th>
                        <th className="p-2 border-b border-white/10">Chest (in)</th>
                        <th className="p-2 border-b border-white/10">Waist (in)</th>
                        <th className="p-2 border-b border-white/10">EU Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr><td className="p-2 font-bold">S</td><td className="p-2">36 - 38</td><td className="p-2">30 - 32</td><td className="p-2">46 - 48</td></tr>
                      <tr><td className="p-2 font-bold">M</td><td className="p-2">38 - 40</td><td className="p-2">32 - 34</td><td className="p-2">48 - 50</td></tr>
                      <tr><td className="p-2 font-bold">L</td><td className="p-2">40 - 42</td><td className="p-2">34 - 36</td><td className="p-2">50 - 52</td></tr>
                      <tr><td className="p-2 font-bold">XL</td><td className="p-2">42 - 44</td><td className="p-2">36 - 38</td><td className="p-2">52 - 54</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={() => setSizeGuideOpen(false)}
              className="w-full py-2.5 bg-white text-[#0A192F] font-bold text-xs uppercase"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
