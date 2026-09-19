'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Plus, Trash2, CheckCircle2, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  department: string;
  brand: string | null;
  imageUrl: string | null;
  availableSizes: any;
  category?: { name: string } | null;
  stock: number;
  isFeatured: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [clothingSizes, setClothingSizes] = useState<string[]>(['S', 'M', 'L', 'XL', 'XXL']);
  const [shoeSizes, setShoeSizes] = useState<string[]>(['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45']);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterDept, setFilterDept] = useState<'ALL' | 'CLOTHES' | 'SHOES' | 'SIDESCROLL'>('ALL');

  // New Product Form State
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<'CLOTHES' | 'SHOES'>('CLOTHES');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [brand, setBrand] = useState('J. VELORIA');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [stock, setStock] = useState('50');
  const [isFeatured, setIsFeatured] = useState(false); // Side-Scroll Feature Toggle
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSizeSelection = (sizeCode: string) => {
    if (selectedSizes.includes(sizeCode)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== sizeCode));
    } else {
      setSelectedSizes([...selectedSizes, sizeCode]);
    }
  };

  const handleToggleSideScroll = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/feature`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === id ? { ...p, isFeatured: !currentStatus } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          department,
          price,
          salePrice,
          brand,
          imageUrl,
          videoUrl,
          description,
          availableSizes: selectedSizes,
          stock,
          isFeatured,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg('Product created successfully!');
        setShowAddModal(false);
        setName('');
        setPrice('');
        setSalePrice('');
        setImageUrl('');
        setVideoUrl('');
        setDescription('');
        setSelectedSizes([]);
        setIsFeatured(false);
        fetchProducts();
      } else {
        setMsg(data.error || 'Failed to create product.');
      }
    } catch (err) {
      setMsg('Error creating product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterDept === 'ALL') return true;
    if (filterDept === 'SIDESCROLL') return p.isFeatured;
    return p.department === filterDept;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Inventory Control</span>
          <h1 className="text-3xl font-serif text-white uppercase tracking-wider flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-white" /> Products & Sizes Manager
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" /> Create New Product
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-white/10 border border-white/20 text-xs text-white flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-slate-400 hover:text-white uppercase">Dismiss</button>
        </div>
      )}

      {/* Filter Tabs including Side-Scroll Only */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setFilterDept('ALL')}
          className={`px-4 py-2 text-xs uppercase font-bold tracking-wider transition-all ${
            filterDept === 'ALL' ? 'bg-white text-[#0A192F]' : 'bg-[#0A192F] text-slate-400 border border-white/10'
          }`}
        >
          All Items ({products.length})
        </button>
        <button
          onClick={() => setFilterDept('SIDESCROLL')}
          className={`px-4 py-2 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all ${
            filterDept === 'SIDESCROLL'
              ? 'bg-emerald-400 text-[#0A192F]'
              : 'bg-[#0A192F] text-emerald-400 border border-emerald-500/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Side-Scroll Featured ({products.filter((p) => p.isFeatured).length})
        </button>
        <button
          onClick={() => setFilterDept('CLOTHES')}
          className={`px-4 py-2 text-xs uppercase font-bold tracking-wider transition-all ${
            filterDept === 'CLOTHES' ? 'bg-white text-[#0A192F]' : 'bg-[#0A192F] text-slate-400 border border-white/10'
          }`}
        >
          Clothes ({products.filter((p) => p.department === 'CLOTHES').length})
        </button>
        <button
          onClick={() => setFilterDept('SHOES')}
          className={`px-4 py-2 text-xs uppercase font-bold tracking-wider transition-all ${
            filterDept === 'SHOES' ? 'bg-white text-[#0A192F]' : 'bg-[#0A192F] text-slate-400 border border-white/10'
          }`}
        >
          Shoes ({products.filter((p) => p.department === 'SHOES').length})
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-[#0A192F] border border-white/10 p-6 space-y-4">
        {loading ? (
          <p className="text-xs text-slate-400">Loading catalog...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020C1B] text-white uppercase tracking-wider font-serif">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Dept</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Side-Scroll Status</th>
                  <th className="p-3">Sizes</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((p) => {
                  const sizes = Array.isArray(p.availableSizes) ? (p.availableSizes as string[]) : [];
                  return (
                    <tr key={p.id} className="hover:bg-white/5">
                      <td className="p-3 flex items-center gap-3">
                        <div className="relative w-12 h-14 bg-[#020C1B] flex-shrink-0 border border-white/10">
                          <Image src={p.imageUrl || '/placeholder.png'} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-white text-sm">{p.name}</p>
                          <p className="text-[10px] text-slate-400">/product/{p.slug}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-[#020C1B] border border-white/20 text-white font-bold text-[10px] uppercase">
                          {p.department}
                        </span>
                      </td>
                      <td className="p-3 font-serif font-bold text-white">${p.price.toLocaleString()}</td>

                      {/* Independent Side-Scroll Feature Control */}
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleSideScroll(p.id, p.isFeatured)}
                          className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                            p.isFeatured
                              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-red-950/80 hover:border-red-500/50 hover:text-red-300'
                              : 'bg-[#020C1B] border-white/20 text-slate-400 hover:border-white hover:text-white'
                          }`}
                          title="Toggle whether this product displays in the Horizontal Side-Scroll section"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {p.isFeatured ? 'In Side-Scroll ✓' : 'Add to Side-Scroll'}
                        </button>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {sizes.map((s) => (
                            <span key={s} className="px-1.5 py-0.5 bg-[#020C1B] border border-white/10 text-[10px] text-slate-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A192F] border border-white/20 p-6 md:p-8 max-w-2xl w-full text-white space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider">Add New Garment / Shoe Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white uppercase text-xs">
                Close
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Cashmere Evening Blazer or Calfskin Oxfords"
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* CRITICAL FEATURE REQUIREMENT: Independent Side-Scroll Feature Checkbox */}
              <div className="p-4 bg-[#020C1B] border border-emerald-500/40 rounded-none space-y-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Add to Horizontal Side-Scroll Carousel</span>
                  </div>
                </label>
                <p className="text-[11px] text-slate-400 pl-7">
                  Check this box if you want this product to appear in the horizontal side-scrolling section on frontend pages.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => {
                      const dept = e.target.value as 'CLOTHES' | 'SHOES';
                      setDepartment(dept);
                      setBrand(dept === 'CLOTHES' ? 'J. VELORIA' : 'J. VELORIA');
                      setSelectedSizes([]);
                    }}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  >
                    <option value="CLOTHES">CLOTHES (Apparel)</option>
                    <option value="SHOES">SHOES (Footwear)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1850.00"
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="1650.00"
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Size Multi-Select */}
              <div className="space-y-2 border border-white/10 p-4 bg-[#020C1B]">
                <label className="block text-[11px] uppercase tracking-wider text-white font-bold">
                  Select Available Sizes for {department}:
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(department === 'CLOTHES' ? clothingSizes : shoeSizes).map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => toggleSizeSelection(sz)}
                        className={`px-3 py-1.5 text-xs uppercase font-bold border transition-all ${
                          isSelected
                            ? 'bg-white text-[#0A192F] border-white'
                            : 'bg-[#0A192F] text-slate-400 border-white/20'
                        }`}
                      >
                        {sz} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors"
              >
                {submitting ? 'Creating Product...' : 'Publish Product to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
