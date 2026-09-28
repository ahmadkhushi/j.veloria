'use client';

import React, { useState, useEffect } from 'react';
import { Ruler, Plus, Trash2, RefreshCw } from 'lucide-react';

interface SizeItem {
  id: number;
  type: string;
  label: string;
  code: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminSizesPage() {
  const [sizes, setSizes] = useState<SizeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [type, setType] = useState<'CLOTHING' | 'FOOTWEAR'>('CLOTHING');
  const [label, setLabel] = useState('');
  const [code, setCode] = useState('');
  const [sortOrder, setSortOrder] = useState('0');

  const fetchSizes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sizes');
      const data = await res.json();
      if (data.sizes) {
        setSizes(data.sizes);
      }
    } catch (err) {
      console.error('Error fetching size presets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleCreateSize = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/sizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, label, code, sortOrder }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setLabel('');
        setCode('');
        setSortOrder('0');
        fetchSizes();
      } else {
        alert('Failed to add size preset.');
      }
    } catch (err) {
      console.error('Error creating size preset:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSize = async (id: number) => {
    if (!confirm('Are you sure you want to delete this size preset?')) return;
    try {
      const res = await fetch(`/api/admin/sizes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSizes((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Error deleting size preset:', err);
    }
  };

  const clothingSizes = sizes.filter((s) => s.type === 'CLOTHING');
  const footwearSizes = sizes.filter((s) => s.type === 'FOOTWEAR');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Ruler className="w-7 h-7 text-purple-400" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide uppercase text-white">
              Size Presets Management
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure sizing presets available when publishing clothing or shoe products.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Size Preset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Clothing Presets */}
        <div className="bg-[#0A192F] border border-white/10 p-6 rounded-lg space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-serif text-base uppercase tracking-wider font-bold text-white">
              Clothing Sizing Presets ({clothingSizes.length})
            </h2>
          </div>

          <div className="divide-y divide-white/5">
            {clothingSizes.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No clothing size presets configured.</p>
            ) : (
              clothingSizes.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-mono font-bold text-white text-sm">{s.code}</span>
                    <span className="text-xs text-slate-400 ml-3">{s.label}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSize(s.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footwear Presets */}
        <div className="bg-[#0A192F] border border-white/10 p-6 rounded-lg space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-serif text-base uppercase tracking-wider font-bold text-white">
              Footwear Sizing Presets ({footwearSizes.length})
            </h2>
          </div>

          <div className="divide-y divide-white/5">
            {footwearSizes.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No footwear size presets configured.</p>
            ) : (
              footwearSizes.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-mono font-bold text-white text-sm">{s.code}</span>
                    <span className="text-xs text-slate-400 ml-3">{s.label}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSize(s.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A192F] border border-white/20 p-6 md:p-8 max-w-md w-full text-white space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider">
                Add New Size Preset
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white uppercase text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateSize} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Preset Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                >
                  <option value="CLOTHING">CLOTHING (Apparel)</option>
                  <option value="FOOTWEAR">FOOTWEAR (Shoes)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Size Code (Required)
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. S, M, L, XL or EU 42"
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Display Label
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Medium (M) or European 42"
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors"
              >
                {submitting ? 'Saving...' : 'Add Size Preset'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
