import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'J. VELORIA | Luxury Ready-to-Wear Clothing & Footwear',
  description: 'J. VELORIA — Premium ready-to-wear clothing and luxury footwear. Shop precision-crafted trousers, shirts, and hand-finished calfskin shoes.',
  keywords: 'J. VELORIA, luxury fashion, ready-to-wear, premium clothing, luxury shoes, menswear, trousers, shirts',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020C1B',
};

async function getDynamicPages() {
  try {
    const pages = await prisma.customPage.findMany({
      where: {
        isPublished: true,
        showInHeader: true,
      },
      select: { id: true, title: true, slug: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (!Array.isArray(pages)) return [];

    return pages.filter(
      (p) =>
        p &&
        p.slug &&
        !p.slug.includes('admin') &&
        !p.title.toLowerCase().includes('admin') &&
        !p.title.toLowerCase().includes('craftsmanship') &&
        !p.title.toLowerCase().includes('atelier')
    );
  } catch (error) {
    console.error('Error fetching dynamic header pages:', error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dynamicPages = await getDynamicPages();

  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#020C1B] text-white min-h-screen flex flex-col selection:bg-white selection:text-[#0A192F]" suppressHydrationWarning>
        <PublicLayout dynamicPages={dynamicPages}>
          {children}
        </PublicLayout>
      </body>
    </html>
  );
}

