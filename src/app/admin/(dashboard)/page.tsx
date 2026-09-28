import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  ShoppingBag,
  Ruler,
  FileText,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  Clock3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    productCount,
    clothesCount,
    shoesCount,
    sizeCount,
    pagesCount,
    orderCount,
    totalRevenueResult,
    todayOrders,
    weekOrders,
    monthOrders,
    yearOrders,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { department: 'CLOTHES', isActive: true } }),
    prisma.product.count({ where: { department: 'SHOES', isActive: true } }),
    prisma.sizeOption.count({ where: { isActive: true } }),
    prisma.customPage.count({ where: { isPublished: true } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.findMany({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.findMany({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.order.findMany({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.findMany({ where: { createdAt: { gte: startOfYear } } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalRevenue = totalRevenueResult._sum.total || 0;
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const weekRevenue = weekOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const yearRevenue = yearOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-medium">
          Executive Control Panel
        </span>
        <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wider mt-1">
          Sales & Analytics Dashboard
        </h1>
      </div>

      {/* Main Revenue Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0A192F] border border-white/10 p-6 space-y-2 rounded-lg shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">
            Rs. {totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">From all processed orders</p>
        </div>

        <div className="bg-[#0A192F] border border-white/10 p-6 space-y-2 rounded-lg shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Active Products</span>
            <ShoppingBag className="w-5 h-5 text-blue-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">{productCount}</p>
          <p className="text-[11px] text-slate-400">
            {clothesCount} Clothes | {shoesCount} Footwear
          </p>
        </div>

        <div className="bg-[#0A192F] border border-white/10 p-6 space-y-2 rounded-lg shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Total Orders</span>
            <ShoppingCart className="w-5 h-5 text-amber-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">{orderCount}</p>
          <p className="text-[11px] text-slate-400">{sizeCount} Size Presets Active</p>
        </div>

        <div className="bg-[#0A192F] border border-white/10 p-6 space-y-2 rounded-lg shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Dynamic CMS Pages</span>
            <FileText className="w-5 h-5 text-purple-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">{pagesCount}</p>
          <p className="text-[11px] text-slate-400">Published storefront subpages</p>
        </div>
      </div>

      {/* Sales Breakdown by Period */}
      <div className="bg-[#0A192F] border border-white/10 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-lg uppercase tracking-wider font-bold text-white">
              Sales Performance Summary
            </h2>
          </div>
          <span className="text-xs text-slate-400">Real-time calculations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-[#020C1B] border border-white/10 p-4 rounded">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Today&apos;s Sales</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-serif font-bold text-white">
              Rs. {todayRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{todayOrders.length} orders today</p>
          </div>

          <div className="bg-[#020C1B] border border-white/10 p-4 rounded">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>This Week</span>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl font-serif font-bold text-white">
              Rs. {weekRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{weekOrders.length} orders this week</p>
          </div>

          <div className="bg-[#020C1B] border border-white/10 p-4 rounded">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>This Month</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-serif font-bold text-white">
              Rs. {monthRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{monthOrders.length} orders this month</p>
          </div>

          <div className="bg-[#020C1B] border border-white/10 p-4 rounded">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>This Year</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl font-serif font-bold text-white">
              Rs. {yearRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{yearOrders.length} orders in {now.getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="p-6 bg-[#0A192F] border border-white/10 hover:border-amber-400/50 text-white flex items-center justify-between group transition-all rounded-lg"
        >
          <div>
            <h3 className="font-serif text-base font-bold uppercase tracking-wider">
              Manage Products
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add/Edit products, prices, and side-scroll features
            </p>
          </div>
          <ShoppingBag className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors" />
        </Link>

        <Link
          href="/admin/orders"
          className="p-6 bg-[#0A192F] border border-white/10 hover:border-emerald-400/50 text-white flex items-center justify-between group transition-all rounded-lg"
        >
          <div>
            <h3 className="font-serif text-base font-bold uppercase tracking-wider">
              Customer Orders
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Track live orders and update fulfillment statuses
            </p>
          </div>
          <ShoppingCart className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
        </Link>

        <Link
          href="/admin/pages"
          className="p-6 bg-[#0A192F] border border-white/10 hover:border-purple-400/50 text-white flex items-center justify-between group transition-all rounded-lg"
        >
          <div>
            <h3 className="font-serif text-base font-bold uppercase tracking-wider">
              Dynamic CMS Pages
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Manage custom storefront pages and header links
            </p>
          </div>
          <FileText className="w-6 h-6 text-slate-400 group-hover:text-purple-400 transition-colors" />
        </Link>
      </div>

      {/* Recent Customer Orders */}
      <div className="bg-[#0A192F] border border-white/10 p-6 rounded-lg space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-serif text-lg uppercase tracking-wider font-bold text-white">
            Recent Customer Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-wider text-amber-400 hover:text-white transition-colors"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020C1B] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
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
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-300">{order.orderRef}</td>
                    <td className="p-3 font-medium text-white">{order.customerName}</td>
                    <td className="p-3 text-slate-400">{order.phone}</td>
                    <td className="p-3 uppercase text-slate-400">{order.paymentMethod}</td>
                    <td className="p-3 font-semibold text-white">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold uppercase text-[10px] rounded">
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
