'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export function WhatsAppFloat() {
  const whatsappNumber = '923451101520';
  const defaultMessage = encodeURIComponent(
    'Hello J. VELORIA, I would like to inquire about your ready-to-wear clothing and sizing...'
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-8 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-emerald-400/40 group"
      title="Chat with J. VELORIA on WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6 animate-pulse" />
      <span className="hidden group-hover:inline font-semibold text-xs uppercase tracking-wider pr-1">
        WhatsApp Concierge
      </span>
    </a>
  );
}
