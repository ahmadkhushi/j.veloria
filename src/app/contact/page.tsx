'use client';

import React, { useState } from 'react';
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Ready-to-Wear Order & Size Inquiry',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: 'Ready-to-Wear Order & Size Inquiry', message: '' });
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Customer Service</span>
        <h1 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-wider">Contact Us</h1>
        <div className="w-16 h-0.5 bg-white mx-auto mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Direct WhatsApp & Atelier Details */}
        <div className="bg-[#0A192F] border border-white/10 p-8 space-y-8">
          <div>
            <h2 className="text-xl font-serif text-white uppercase tracking-wider mb-2">Private Concierge</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our dedicated luxury advisors are available to assist with ready-to-wear sizing guidance, order status, or trunk show invitations.
            </p>
          </div>

          {/* Quick WhatsApp Action Button */}
          <div className="p-6 bg-[#020C1B] border border-emerald-500/30 rounded-none space-y-3">
            <div className="flex items-center gap-3">
              <FaWhatsapp className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-serif text-sm font-bold text-white uppercase">Instant WhatsApp Concierge</h3>
                <p className="text-[11px] text-slate-400">Direct assistance on +923451101520</p>
              </div>
            </div>
            <a
              href="https://wa.me/923451101520?text=Hello%20J.%20VELORIA%20Concierge,%20I%20would%20like%20to%20inquire%20about..."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Start WhatsApp Chat (+923451101520)
            </a>
          </div>

          {/* Social Icons */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Social Channels</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/923451101520"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#112240] border border-white/10 text-xs text-slate-200 hover:text-white"
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-400" /> WhatsApp
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#112240] border border-white/10 text-xs text-slate-200 hover:text-white"
              >
                <FaFacebookF className="w-4 h-4 text-blue-400" /> Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#112240] border border-white/10 text-xs text-slate-200 hover:text-white"
              >
                <FaInstagram className="w-4 h-4 text-pink-400" /> Instagram
              </a>
            </div>
          </div>

          {/* Atelier Locations */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Global Headquarters</p>
                <p className="text-slate-400">Via Toledo 180, Naples, Italy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-white flex-shrink-0" />
              <a href="mailto:j.veloria.pk@gmail.com" className="hover:text-emerald-400 transition-colors font-medium">
                j.veloria.pk@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-white flex-shrink-0" />
              <span>+92 345 1101520</span>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-[#0A192F] border border-white/10 p-8 space-y-6">
          <h2 className="text-xl font-serif text-white uppercase tracking-wider">Send an Inquiry</h2>

          {status === 'success' ? (
            <div className="p-6 bg-emerald-950/50 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="font-serif text-lg text-white">Inquiry Received</h3>
              <p className="text-xs text-slate-300">
                Thank you for contacting J. VELORIA. Our team will respond to your message within 24 hours.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="px-6 py-2 bg-white text-[#0A192F] text-xs font-bold uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white"
                    placeholder="Mr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white"
                    placeholder="+92 345 1101520"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white"
                  >
                    <option value="Ready-to-Wear Order & Size Inquiry">Ready-to-Wear Order & Size Inquiry</option>
                    <option value="Footwear Size Advice">Footwear Size Advice</option>
                    <option value="Order Status & Delivery">Order Status & Delivery</option>
                    <option value="VIP Private Concierge">VIP Private Concierge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Message</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white"
                  placeholder="Please provide details about your ready-to-wear order or size questions..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
              >
                {status === 'submitting' ? 'Transmitting...' : 'Submit Concierge Message'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
