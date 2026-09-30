'use client';

import React, { useState, useEffect } from 'react';
import { normalizeImageUrl } from '@/lib/image-helper';
import {
  Package,
  Plus,
  Trash2,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Link2,
  Wand2,
  Image as ImageIcon,
  Edit,
} from 'lucide-react';

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  department: string;
  availableSizes?: any;
  isFeatured: boolean;
  isActive: boolean;
  stock: number;
  category?: { name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<'ALL' | 'CLOTHES' | 'SHOES' | 'FEATURED'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<'CLOTHES' | 'SHOES'>('CLOTHES');
  const [brand, setBrand] = useState('J. VELORIA');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [extractingLink, setExtractingLink] = useState(false);
  const [linkMessage, setLinkMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Edit Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDepartment, setEditDepartment] = useState<'CLOTHES' | 'SHOES'>('CLOTHES');
  const [editBrand, setEditBrand] = useState('J. VELORIA');
  const [editPrice, setEditPrice] = useState('');
  const [editSalePrice, setEditSalePrice] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editSelectedSizes, setEditSelectedSizes] = useState<string[]>([]);
  const [editStock, setEditStock] = useState('50');
  const [editExtractingLink, setEditExtractingLink] = useState(false);
  const [editLinkMessage, setEditLinkMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const clothingSizes = ['S', 'M', 'L', 'XL', '2XL'];
  const shoeSizes = ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleFeature = async (id: number, currentState: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/feature`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentState }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: !currentState } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle feature status:', err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const toggleSizeSelection = (sizeCode: string) => {
    if (selectedSizes.includes(sizeCode)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== sizeCode));
    } else {
      setSelectedSizes([...selectedSizes, sizeCode]);
    }
  };

  const handleExtractFromLink = async (overrideUrl?: string) => {
    const targetUrl = overrideUrl || imageUrl;
    if (!targetUrl || !targetUrl.trim()) {
      setLinkMessage({ text: 'Please enter or paste a product link / image URL.', type: 'error' });
      return;
    }

    setExtractingLink(true);
    setLinkMessage({ text: 'Extracting product picture & info from link...', type: 'info' });

    try {
      const res = await fetch('/api/admin/extract-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      const data = await res.json();

      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);

        let msg = '✓ Product picture extracted successfully!';
        if (data.title && !name) {
          setName(data.title);
          msg += ' Title auto-filled.';
        }
        if (data.price && !price) {
          setPrice(data.price);
          msg += ' Price auto-filled.';
        }

        setLinkMessage({ text: msg, type: 'success' });
      } else {
        setLinkMessage({
          text: 'Could not extract image from web page. Using normalized link directly.',
          type: 'info',
        });
        setImageUrl(normalizeImageUrl(targetUrl));
      }
    } catch (err) {
      console.error('Error extracting image from link:', err);
      setLinkMessage({ text: 'Failed to extract picture from link. Using direct URL.', type: 'error' });
      setImageUrl(normalizeImageUrl(targetUrl));
    } finally {
      setExtractingLink(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const cleanImg = normalizeImageUrl(imageUrl);
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price,
          salePrice: salePrice || null,
          department,
          brand,
          imageUrl: cleanImg || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
          description,
          availableSizes: selectedSizes,
          isFeatured,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setName('');
        setPrice('');
        setSalePrice('');
        setImageUrl('');
        setDescription('');
        setSelectedSizes([]);
        setIsFeatured(false);
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to create product.');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Error creating product.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (p: ProductItem) => {
    setEditId(p.id);
    setEditName(p.name);
    setEditDepartment((p.department as 'CLOTHES' | 'SHOES') || 'CLOTHES');
    setEditBrand((p as any).brand || 'J. VELORIA');
    setEditPrice(String(p.price || ''));
    setEditSalePrice(p.salePrice ? String(p.salePrice) : '');
    setEditImageUrl(p.imageUrl || '');
    setEditDescription(p.description || '');
    setEditIsFeatured(p.isFeatured ?? false);
    setEditSelectedSizes(Array.isArray(p.availableSizes) ? p.availableSizes : []);
    setEditStock(String(p.stock ?? 50));
    setEditLinkMessage(null);
    setShowEditModal(true);
  };

  const toggleEditSizeSelection = (sizeCode: string) => {
    if (editSelectedSizes.includes(sizeCode)) {
      setEditSelectedSizes(editSelectedSizes.filter((s) => s !== sizeCode));
    } else {
      setEditSelectedSizes([...editSelectedSizes, sizeCode]);
    }
  };

  const handleEditExtractFromLink = async (overrideUrl?: string) => {
    const targetUrl = overrideUrl || editImageUrl;
    if (!targetUrl || !targetUrl.trim()) {
      setEditLinkMessage({ text: 'Please enter or paste a product link / image URL.', type: 'error' });
      return;
    }

    setEditExtractingLink(true);
    setEditLinkMessage({ text: 'Extracting product picture & info from link...', type: 'info' });

    try {
      const res = await fetch('/api/admin/extract-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      const data = await res.json();

      if (data.success && data.imageUrl) {
        setEditImageUrl(data.imageUrl);

        let msg = '✓ Product picture extracted successfully!';
        if (data.title && !editName) {
          setEditName(data.title);
          msg += ' Title auto-filled.';
        }
        if (data.price && !editPrice) {
          setEditPrice(data.price);
          msg += ' Price auto-filled.';
        }

        setEditLinkMessage({ text: msg, type: 'success' });
      } else {
        setEditLinkMessage({
          text: 'Could not extract image from web page. Using normalized link directly.',
          type: 'info',
        });
        setEditImageUrl(normalizeImageUrl(targetUrl));
      }
    } catch (err) {
      console.error('Error extracting image from link:', err);
      setEditLinkMessage({ text: 'Failed to extract picture from link. Using direct URL.', type: 'error' });
      setEditImageUrl(normalizeImageUrl(targetUrl));
    } finally {
      setEditExtractingLink(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setSubmitting(true);
    try {
      const cleanImg = normalizeImageUrl(editImageUrl);
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editId,
          name: editName,
          price: editPrice,
          salePrice: editSalePrice || null,
          department: editDepartment,
          brand: editBrand,
          imageUrl: cleanImg || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
          description: editDescription,
          availableSizes: editSelectedSizes,
          isFeatured: editIsFeatured,
          stock: editStock,
        }),
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditId(null);
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to update product.');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Error updating product.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedDept === 'CLOTHES') return matchesSearch && p.department === 'CLOTHES';
    if (selectedDept === 'SHOES') return matchesSearch && p.department === 'SHOES';
    if (selectedDept === 'FEATURED') return matchesSearch && p.isFeatured;
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-7 h-7 text-amber-400" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide uppercase text-white">
              Product Catalog Management
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, and manage luxury clothing and footwear inventory.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0A192F] border border-white/10 p-4 rounded-lg">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#020C1B] border border-white/10 text-xs text-white pl-10 pr-4 py-2.5 focus:outline-none focus:border-amber-400/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedDept('ALL')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded ${
              selectedDept === 'ALL'
                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setSelectedDept('CLOTHES')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded ${
              selectedDept === 'CLOTHES'
                ? 'bg-blue-400/10 text-blue-300 border border-blue-400/30'
                : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            Clothes ({products.filter((p) => p.department === 'CLOTHES').length})
          </button>
          <button
            onClick={() => setSelectedDept('SHOES')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded ${
              selectedDept === 'SHOES'
                ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/30'
                : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            Shoes ({products.filter((p) => p.department === 'SHOES').length})
          </button>
          <button
            onClick={() => setSelectedDept('FEATURED')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded ${
              selectedDept === 'FEATURED'
                ? 'bg-purple-400/10 text-purple-300 border border-purple-400/30'
                : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            Side-Scroll Featured ({products.filter((p) => p.isFeatured).length})
          </button>

          <button
            onClick={fetchProducts}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-[#0A192F] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading catalog data...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020C1B] text-slate-400 font-semibold uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Dept</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Side-Scroll Carousel</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((p) => {
                  const displayImg = normalizeImageUrl(p.imageUrl);
                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">#{p.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="w-10 h-12 bg-[#020C1B] border border-white/10 overflow-hidden relative flex-shrink-0">
                          <img
                            src={displayImg}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">/product/{p.slug}</div>
                      </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[10px] font-bold text-amber-300">
                        {p.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">Rs. {p.price.toLocaleString()}</div>
                      {p.salePrice && (
                        <div className="text-[10px] text-slate-500 line-through">
                          Rs. {p.salePrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeature(p.id, p.isFeatured)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition-all ${
                          p.isFeatured
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {p.isFeatured ? 'Featured Active' : 'Enable Side-Scroll'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-amber-400/80 hover:text-amber-300 hover:bg-amber-400/10 rounded transition-colors"
                          title="Edit product details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
          <div className="bg-[#0A192F] border border-white/20 p-6 md:p-8 max-w-2xl w-full text-white space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider">
                Add New Garment / Shoe Product
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white uppercase text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Product Title (Required)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Cashmere Evening Blazer or Handcrafted Calfskin Oxfords"
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Side-Scroll Feature Checkbox */}
              <div className="p-4 bg-[#020C1B] border border-amber-500/40 space-y-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Add to Horizontal Side-Scroll Carousel Section</span>
                  </div>
                </label>
                <p className="text-[11px] text-slate-400 pl-7">
                  Check this box if you want this item to appear in the side-scrolling carousel on frontend pages.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => {
                      const dept = e.target.value as 'CLOTHES' | 'SHOES';
                      setDepartment(dept);
                      setSelectedSizes([]);
                    }}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  >
                    <option value="CLOTHES">CLOTHES (Apparel)</option>
                    <option value="SHOES">SHOES (Footwear)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Brand Name
                  </label>
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
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="18500"
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Sale Price (Rs. Optional)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="16500"
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Size Selection */}
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

              <div className="space-y-3 bg-[#020C1B] border border-amber-500/30 p-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-amber-400" />
                    Product Link / Image URL (Add via Link)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleExtractFromLink()}
                    disabled={extractingLink || !imageUrl}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-400 text-[#0A192F] font-bold text-[10px] uppercase tracking-wider hover:bg-amber-300 disabled:opacity-50 transition-colors"
                  >
                    <Wand2 className="w-3 h-3" />
                    {extractingLink ? 'Extracting Picture...' : 'Fetch Picture from Link'}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData('text');
                      if (pasted) {
                        setTimeout(() => handleExtractFromLink(pasted), 100);
                      }
                    }}
                    placeholder="Paste ANY website link (e.g. Junaid Jamshed, Google Drive, Pinterest, Shopify, Unsplash, Imgur)..."
                    className="w-full bg-[#0A192F] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {linkMessage && (
                  <div
                    className={`text-[11px] p-2 border ${
                      linkMessage.type === 'success'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : linkMessage.type === 'error'
                        ? 'bg-red-950/40 border-red-500/40 text-red-300'
                        : 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                    }`}
                  >
                    {linkMessage.text}
                  </div>
                )}

                {/* Live Image Preview */}
                {imageUrl && (
                  <div className="mt-2 p-2 bg-[#0A192F] border border-white/10 flex items-center gap-3">
                    <div className="relative w-16 h-20 bg-[#020C1B] border border-white/10 flex-shrink-0 overflow-hidden">
                      <img
                        src={normalizeImageUrl(imageUrl)}
                        alt="Image preview"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const sibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                          if (sibling) sibling.style.display = 'flex';
                        }}
                        onLoad={(e) => {
                          (e.target as HTMLImageElement).style.display = 'block';
                          const sibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                          if (sibling) sibling.style.display = 'none';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="w-full h-full bg-red-900/30 border border-red-500/30 hidden items-center justify-center text-center p-1">
                        <span className="text-[9px] text-red-400">❌ Failed to load</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-300 space-y-1">
                      <p className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Picture Ready
                      </p>
                      <p className="text-slate-400 line-clamp-1 break-all text-[9px] font-mono">
                        {normalizeImageUrl(imageUrl)}
                      </p>
                      <p className="text-slate-500">
                        This picture will show across your store (Clothes Hub, Shoes Hub, Details & Cart).
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
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
                className="w-full py-3.5 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors"
              >
                {submitting ? 'Publishing...' : 'Publish Product to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A192F] border border-amber-500/30 p-6 md:p-8 max-w-2xl w-full text-white space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-amber-300">
                  Edit Product #{editId}
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white uppercase text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Product Title (Required)
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Side-Scroll Feature Checkbox */}
              <div className="p-4 bg-[#020C1B] border border-amber-500/40 space-y-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsFeatured}
                    onChange={(e) => setEditIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Featured in Horizontal Side-Scroll Carousel Section</span>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Department
                  </label>
                  <select
                    value={editDepartment}
                    onChange={(e) => {
                      const dept = e.target.value as 'CLOTHES' | 'SHOES';
                      setEditDepartment(dept);
                      setEditSelectedSizes([]);
                    }}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  >
                    <option value="CLOTHES">CLOTHES (Apparel)</option>
                    <option value="SHOES">SHOES (Footwear)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Sale Price (Rs.)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editSalePrice}
                    onChange={(e) => setEditSalePrice(e.target.value)}
                    placeholder="Optional"
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Stock Inventory
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Available Sizes Multi-Select */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">
                  Available Sizes ({editDepartment})
                </label>
                <div className="flex flex-wrap gap-2">
                  {(editDepartment === 'CLOTHES' ? clothingSizes : shoeSizes).map((sz) => {
                    const isSelected = editSelectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleEditSizeSelection(sz)}
                        className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all border ${
                          isSelected
                            ? 'bg-amber-400 text-[#0A192F] border-amber-300 shadow-md'
                            : 'bg-[#020C1B] text-slate-400 border-white/20 hover:text-white'
                        }`}
                      >
                        {sz} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image Input with Extract from Link button */}
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-slate-400">
                  Product Image Link / URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={editImageUrl}
                    onChange={(e) => {
                      setEditImageUrl(e.target.value);
                      if (editLinkMessage) setEditLinkMessage(null);
                    }}
                    placeholder="Paste direct picture URL or store product web page link..."
                    className="flex-1 bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleEditExtractFromLink()}
                    disabled={editExtractingLink}
                    className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-[#0A192F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {editExtractingLink ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Extracting...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" /> Auto-Extract
                      </>
                    )}
                  </button>
                </div>

                {editLinkMessage && (
                  <div
                    className={`p-2.5 text-xs border ${
                      editLinkMessage.type === 'success'
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                        : editLinkMessage.type === 'error'
                        ? 'bg-red-950/60 border-red-500/40 text-red-200'
                        : 'bg-blue-950/60 border-blue-500/40 text-blue-200'
                    }`}
                  >
                    {editLinkMessage.text}
                  </div>
                )}

                {/* Live Image Preview */}
                {editImageUrl && (
                  <div className="mt-2 p-2 bg-[#0A192F] border border-white/10 flex items-center gap-3">
                    <div className="relative w-16 h-20 bg-[#020C1B] border border-white/10 flex-shrink-0 overflow-hidden">
                      <img
                        src={normalizeImageUrl(editImageUrl)}
                        alt="Image preview"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const sibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                          if (sibling) sibling.style.display = 'flex';
                        }}
                        onLoad={(e) => {
                          (e.target as HTMLImageElement).style.display = 'block';
                          const sibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                          if (sibling) sibling.style.display = 'none';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="w-full h-full bg-red-900/30 border border-red-500/30 hidden items-center justify-center text-center p-1">
                        <span className="text-[9px] text-red-400">❌ Failed to load</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-300 space-y-1">
                      <p className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Picture Preview Ready
                      </p>
                      <p className="text-slate-400 line-clamp-1 break-all text-[9px] font-mono">
                        {normalizeImageUrl(editImageUrl)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-amber-400 text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg"
                >
                  {submitting ? 'Saving Changes...' : 'Save Product Updates'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3.5 bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-colors border border-white/20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
