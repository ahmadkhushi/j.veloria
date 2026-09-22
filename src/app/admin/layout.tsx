import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { LayoutDashboard, ShoppingBag, Ruler, FileText, ShoppingCart, LogOut, ArrowLeft } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#020C1B] text-white flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0A192F] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <Link href="/admin" className="block">
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-white uppercase block">
                J. VELORIA
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400 font-light">
                ADMIN PORTAL
              </span>
            </Link>
          </div>

          <nav className="space-y-2 text-xs font-semibold uppercase tracking-wider">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-none bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-white" />
              Overview
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 rounded-none text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              Products Manager
            </Link>

            {/* Size Management System (Rule 4 Requirement) */}
            <Link
              href="/admin/sizes"
              className="flex items-center gap-3 px-4 py-3 rounded-none text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Ruler className="w-4 h-4 text-white" />
              Size Management
            </Link>

            {/* Dynamic Pages Manager (Rule 5 Requirement) */}
            <Link
              href="/admin/pages"
              className="flex items-center gap-3 px-4 py-3 rounded-none text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <FileText className="w-4 h-4 text-white" />
              Dynamic CMS Pages
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-none text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              Customer Orders
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> View Storefront
          </Link>
          <a
            href="/api/admin/logout"
            className="flex items-center gap-2 text-red-400 hover:text-red-300 uppercase tracking-wider pt-2"
          >
            <LogOut className="w-4 h-4" /> Logout Session
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
