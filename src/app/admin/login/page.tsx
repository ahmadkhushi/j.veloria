'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@jveloria.com');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020C1B] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0A192F] border border-white/10 p-8 shadow-2xl space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white uppercase block">
            J. VELORIA
          </span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400 font-light block">
            ADMIN PORTAL AUTHENTICATION
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/70 border border-red-500/40 text-red-200 text-xs text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-semibold">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jveloria.com"
                className="w-full bg-[#020C1B] border border-white/20 pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-semibold">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#020C1B] border border-white/20 pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Quick Credential Hint Box */}
          <div className="p-3 bg-[#020C1B] border border-white/10 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-amber-300 uppercase text-[10px] tracking-wider">Default Admin Credentials:</p>
            <p>Email: <code className="text-white font-mono">admin@jveloria.com</code></p>
            <p>Password: <code className="text-white font-mono">admin123456</code></p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-colors mt-6"
          >
            {submitting ? 'Authenticating...' : 'Enter Admin Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
