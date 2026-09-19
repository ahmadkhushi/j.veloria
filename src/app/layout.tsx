import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'J. VELORIA | Luxury Ready-to-Wear Clothing & Footwear',
  description: 'J. VELORIA — Premium ready-to-wear clothing and luxury footwear. Shop precision-crafted trousers, shirts, and hand-finished calfskin shoes.',
  keywords: 'J. VELORIA, luxury fashion, ready-to-wear, premium clothing, luxury shoes, menswear, trousers, shirts',
};

async function getDynamicPages() {
  try {
    const pages = await prisma.customPage.findMany({
      where: {
        isPublished: true,
        showInHeader: true,
        NOT: [
          { slug: { in: ['atelier-craftsmanship', 'heritage-craftsmanship'] } },
          { title: { contains: 'Craftsmanship' } },
          { title: { contains: 'ATELIER' } },
        ],
      },
      select: { id: true, title: true, slug: true },
      orderBy: { sortOrder: 'asc' },
    });
    return pages;
  } catch (error) {
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dynamicPages = await getDynamicPages();
  const session = await getSession();
  const isAdmin = session?.role === 'ADMIN';

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#020C1B] text-white min-h-screen flex flex-col selection:bg-white selection:text-[#0A192F]">
        <Header dynamicPages={dynamicPages} isAdmin={isAdmin} />
        <CartDrawer />
        <main className="flex-1 pt-[108px]">
          {children}
        </main>
        <WhatsAppFloat />
        <Footer dynamicPages={dynamicPages} />
        <MobileNav />
      </body>
    </html>
  );
}
