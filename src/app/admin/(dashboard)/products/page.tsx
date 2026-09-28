import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Package, Plus, LogOut, Tag, CheckCircle2, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getAdminProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error('Failed to fetch admin products:', error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="min-h-screen bg-[#020C1B] text-slate-100 p-6 md:p-10">
      {/* Top Header & Admin Actions */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-7 h-7 text-amber-400" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide uppercase text-white">
              Product Management
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage inventory, pricing, and catalog listings for J. VELORIA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Stats Quick Overview */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0A192F] border border-white/10 p-5 rounded-lg">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">Total Products</span>
          <p className="text-2xl font-serif font-bold text-white mt-1">{products.length}</p>
        </div>
        <div className="bg-[#0A192F] border border-white/10 p-5 rounded-lg">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">Clothes Department</span>
          <p className="text-2xl font-serif font-bold text-amber-400 mt-1">
            {products.filter((p) => p.department === 'CLOTHES').length}
          </p>
        </div>
        <div className="bg-[#0A192F] border border-white/10 p-5 rounded-lg">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">Shoes Department</span>
          <p className="text-2xl font-serif font-bold text-emerald-400 mt-1">
            {products.filter((p) => p.department === 'SHOES').length}
          </p>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="max-w-7xl mx-auto bg-[#0A192F] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Catalog Inventory</h2>
          <span className="text-xs text-slate-400">Showing {products.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020C1B] text-slate-400 font-semibold uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No products found in database.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">#{prod.id}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{prod.name}</td>
                    <td className="py-3.5 px-4 uppercase text-[10px] tracking-wider text-amber-300">
                      {prod.department}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {prod.category?.name || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      Rs. {prod.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{prod.stock} units</td>
                    <td className="py-3.5 px-4">
                      {prod.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
