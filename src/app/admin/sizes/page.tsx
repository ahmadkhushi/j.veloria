'use client';

import React, { useState, useEffect } from 'react';
import { Ruler, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SizeOptionItem {
  id: number;
  type: string;
  label: string;
  code: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminSizesPage() {
  const [sizes, setSizes] = useState<SizeOptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'CLOTHING' | 'FOOTWEAR'>('CLOTHING');

  const [newType, setNewType] = useState<'CLOTHING' | 'FOOTWEAR'>('CLOTHING');
  const [newCode, setNewCode] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newSortOrder, setNewSortOrder] = useState('0');
  const [msg, setMsg] = useState('');

  const fetchSizes = async () => {
    try {
      const res = await fetch('/api/admin/sizes');
      const data = await res.json();
      if (data.success) {
        setSizes(data.sizes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleAddSize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    try {
      const res = await fetch('/api/admin/sizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newType,
          code: newCode,
          label: newLabel || newCode,
          sortOrder: newSortOrder,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Size added successfully!');
        setNewCode('');
        setNewLabel('');
        fetchSizes();
      } else {
        setMsg(data.error || 'Failed to add size.');
      }
    } catch (e) {
      setMsg('Error adding size.');
    }
  };

  const handleDeleteSize = async (id: number) => {
    if (!confirm('Are you sure you want to delete this size option?')) return;
    try {
      const res = await fetch(`/api/admin/sizes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSizes();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clothingSizes = sizes.filter((s) => s.type === 'CLOTHING');
  const footwearSizes = sizes.filter((s) => s.type === 'FOOTWEAR');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Garments & Shoes Sizing</span>
          <h1 className="text-3xl font-serif text-white uppercase tracking-wider flex items-center gap-3">
            <Ruler className="w-7 h-7 text-white" /> Size Management System
          </h1>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-white/10 border border-white/20 text-xs text-white flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-slate-400 hover:text-white uppercase">Dismiss</button>
        </div>
      )}

      {/* Add New Size Option Form */}
      <div className="bg-[#0A192F] border border-white/10 p-6 space-y-4">
        <h2 className="font-serif text-base uppercase tracking-wider text-white font-bold border-b border-white/10 pb-3">
          Add New System Size Preset
        </h2>

        <form onSubmit={handleAddSize} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Department Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="w-full bg-[#020C1B] border border-white/20 p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="CLOTHING">Clothing (Apparel)</option>
              <option value="FOOTWEAR">Footwear (Shoes)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Size Code (e.g. S, EU 42)</label>
            <input
              type="text"
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g., EU 42 or XL"
              className="w-full bg-[#020C1B] border border-white/20 p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Label Description</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g., European 42 / US 9"
              className="w-full bg-[#020C1B] border border-white/20 p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Sort Order</label>
            <input
              type="number"
              value={newSortOrder}
              onChange={(e) => setNewSortOrder(e.target.value)}
              className="w-full bg-[#020C1B] border border-white/20 p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Size Option
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 space-x-4">
        <button
          onClick={() => setActiveTab('CLOTHING')}
          className={`pb-3 text-xs uppercase tracking-widest font-bold transition-all ${
            activeTab === 'CLOTHING'
              ? 'text-white border-b-2 border-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Clothing Sizes ({clothingSizes.length})
        </button>
        <button
          onClick={() => setActiveTab('FOOTWEAR')}
          className={`pb-3 text-xs uppercase tracking-widest font-bold transition-all ${
            activeTab === 'FOOTWEAR'
              ? 'text-white border-b-2 border-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Footwear Sizes ({footwearSizes.length})
        </button>
      </div>

      {/* Size Options Table */}
      <div className="bg-[#0A192F] border border-white/10 p-6">
        {loading ? (
          <p className="text-xs text-slate-400">Loading system sizes...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020C1B] text-white uppercase tracking-wider font-serif">
                <tr>
                  <th className="p-3">Sort</th>
                  <th className="p-3">Size Code</th>
                  <th className="p-3">Full Label</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(activeTab === 'CLOTHING' ? clothingSizes : footwearSizes).map((item) => (
                  <tr key={item.id} className="hover:bg-white/5">
                    <td className="p-3 font-mono">{item.sortOrder}</td>
                    <td className="p-3 font-bold text-white bg-[#020C1B] px-3 py-1 w-fit border border-white/10">
                      {item.code}
                    </td>
                    <td className="p-3 text-slate-300">{item.label}</td>
                    <td className="p-3 uppercase text-[10px] text-slate-400">{item.type}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteSize(item.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Size"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
