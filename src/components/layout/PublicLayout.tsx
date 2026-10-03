'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

interface CustomPageHeaderLink {
  id: number;
  title: string;
  slug: string;
}

interface PublicLayoutProps {
  children: React.ReactNode;
  dynamicPages: CustomPageHeaderLink[];
}

export function PublicLayout({ children, dynamicPages }: PublicLayoutProps) {
  return (
    <>
      <Header dynamicPages={dynamicPages} />
      <CartDrawer />
      <main className="flex-1 pt-[120px]">
        {children}
      </main>
      <WhatsAppFloat />
      <Footer dynamicPages={dynamicPages} />
      <MobileNav />
    </>
  );
}
