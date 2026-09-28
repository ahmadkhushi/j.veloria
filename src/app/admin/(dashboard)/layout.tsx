import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Ruler,
  FileText,
  ShoppingCart,
  LogOut,
  ArrowLeft,
  Store,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020C1B] text-white flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0A192F] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <Link href="/admin" className="block">
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-white uppercase block">
                J. VELORIA
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-amber-400 font-medium">
                ADMIN PORTAL
              </span>
            </Link>
          </div>

          <nav className="space-y-2 text-xs font-semibold uppercase tracking-wider">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-none bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              Overview & Sales
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 rounded-none text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              Products Manager
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-none text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              Customer Orders
            </Link>

            <Link
              href="/admin/sizes"
              className="flex items-center gap-3 px-4 py-3 rounded-none text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Ruler className="w-4 h-4 text-purple-400" />
              Size Management
            </Link>

            <Link
              href="/admin/pages"
              className="flex items-center gap-3 px-4 py-3 rounded-none text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <FileText className="w-4 h-4 text-pink-400" />
              Dynamic CMS Pages
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <Store className="w-4 h-4 text-slate-400" /> View Live Store
          </Link>

          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 text-[11px] font-semibold uppercase tracking-wider transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
