'use client';

import React from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { ArrowRight, Truck, Mail } from 'lucide-react';

interface CustomPageFooterLink {
  id: number;
  title: string;
  slug: string;
}

export function Footer({ dynamicPages = [] }: { dynamicPages?: CustomPageFooterLink[] }) {
  const whatsappNumber = '923451101520';

  return (
    <footer className="bg-[#020C1B] text-slate-300 border-t border-white/10 pt-16 pb-24 lg:pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand & Story */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white uppercase block">
              J. VELORIA
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400 font-light">
              LUXURY READY-TO-WEAR
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Premium ready-to-wear clothing and luxury footwear. Precision-crafted trousers, shirts, and hand-finished calfskin shoes — ready for immediate wear.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20J.%20VELORIA`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-400 transition-colors"
              title="WhatsApp Concierge (+923451101520)"
            >
              <FaWhatsapp className="w-4 h-4 text-emerald-400" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-400 transition-colors"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-400 transition-colors"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <h3 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">Collections</h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/clothes" className="hover:text-white transition-colors">
                Clothes Collection
              </Link>
            </li>
            <li>
              <Link href="/shoes" className="hover:text-white transition-colors">
                Luxury Shoes & Oxfords
              </Link>
            </li>
            <li>
              <Link href="/clothes?category=suits" className="hover:text-white transition-colors">
                Suits & Tuxedos
              </Link>
            </li>
            <li>
              <Link href="/shoes?category=loafers" className="hover:text-white transition-colors">
                Venetian Suede Loafers
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care & Track Order */}
        <div className="space-y-4">
          <h3 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">Customer Care</h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/track-order" className="text-amber-300 font-bold hover:text-white transition-colors flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Track Live Order Status
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Concierge
              </Link>
            </li>
            <li>
              <a href="mailto:j.veloria.pk@gmail.com" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> j.veloria.pk@gmail.com
              </a>
            </li>
            {dynamicPages.map((page) => (
              <li key={page.id}>
                <Link href={`/pages/${page.slug}`} className="hover:text-white transition-colors">
                  {page.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="hover:text-white transition-colors text-slate-400">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-4">
          <h3 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">Private VIP Access</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Subscribe to receive private invitations to new luxury seasonal drops and exclusive new arrivals.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-[#0A192F] border border-white/20 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none flex-1"
            />
            <button
              type="submit"
              className="bg-white text-[#0A192F] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© {new Date().getFullYear()} J. VELORIA Luxury Ready-to-Wear. All Rights Reserved.</p>
        <div className="flex space-x-6 text-[11px]">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Returns Policy</span>
        </div>
      </div>
    </footer>
  );
}
