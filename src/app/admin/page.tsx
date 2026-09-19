import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ShoppingBag, Ruler, FileText, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export default async function AdminOverviewPage() {
  const [productCount, clothesCount, shoesCount, sizeCount, pagesCount, orderCount, totalRevenueResult] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { department: 'CLOTHES', isActive: true } }),
      prisma.product.count({ where: { department: 'SHOES', isActive: true } }),
      prisma.sizeOption.count({ where: { isActive: true } }),
      prisma.customPage.count({ where: { isPublished: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
    ]);

  const totalRevenue = totalRevenueResult._sum.total || 0;
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Admin Control Panel</span>
        <h1 className="text-3xl font-serif text-white uppercase tracking-wider">Dashboard Overview</h1>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0A192F] border border-white/10 p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">From all processed orders</p>
        </div>

        <div className="bg-[#0A192F] border border-white/10 p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Active Products</span>
            <ShoppingBag className="w-5 h-5 text-blue-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">{productCount}</p>
          <p className="text-[11px] text-slate-400">{clothesCount} Clothes | {shoesCount} Footwear</p>
        </div>

        <div className="bg-[#0A192F] border border-white/10 p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Dynamic CMS Pages</span>
            <FileText className="w-5 h-5 text-purple-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">{pagesCount}</p>
          <p className="text-[11px] text-slate-400">Live dynamic store subpages</p>
        </div>

        <div className="bg-[#0A192F] border border-white/10 p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Total Orders</span>
            <ShoppingCart className="w-5 h-5 text-amber-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">{orderCount}</p>
          <p className="text-[11px] text-slate-400">{sizeCount} Size Options Available</p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="p-6 bg-[#0A192F] border border-white/10 hover:border-white/30 text-white flex items-center justify-between group transition-all"
        >
          <div>
            <h3 className="font-serif text-base font-bold uppercase tracking-wider">Manage Products & Sizes</h3>
            <p className="text-xs text-slate-400 mt-1">Add or edit garments and shoes with multi-size options</p>
          </div>
          <ShoppingBag className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
        </Link>

        <Link
          href="/admin/pages"
          className="p-6 bg-[#0A192F] border border-white/10 hover:border-white/30 text-white flex items-center justify-between group transition-all"
        >
          <div>
            <h3 className="font-serif text-base font-bold uppercase tracking-wider">Create Dynamic Page</h3>
            <p className="text-xs text-slate-400 mt-1">Add custom pages or subpages to website navigation</p>
          </div>
          <FileText className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
        </Link>

        <Link
          href="/admin/sizes"
          className="p-6 bg-[#0A192F] border border-white/10 hover:border-white/30 text-white flex items-center justify-between group transition-all"
        >
          <div>
            <h3 className="font-serif text-base font-bold uppercase tracking-wider">Size Management</h3>
            <p className="text-xs text-slate-400 mt-1">Configure clothing and shoe sizing presets</p>
          </div>
          <Ruler className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
        </Link>
      </div>

      {/* Recent Customer Orders Table */}
      <div className="bg-[#0A192F] border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-serif text-lg uppercase tracking-wider font-bold text-white">Recent Customer Orders</h2>
          <Link href="/admin/orders" className="text-xs uppercase tracking-wider text-slate-400 hover:text-white">
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020C1B] text-white uppercase tracking-wider font-serif">
              <tr>
                <th className="p-3">Order Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5">
                    <td className="p-3 font-mono font-bold text-white">{order.orderRef}</td>
                    <td className="p-3">{order.customerName}</td>
                    <td className="p-3">{order.phone}</td>
                    <td className="p-3 uppercase">{order.paymentMethod}</td>
                    <td className="p-3 font-bold text-white">${order.total.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold uppercase text-[10px]">
                        {order.status}
                      </span>
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
