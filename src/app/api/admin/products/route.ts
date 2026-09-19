import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      imageUrl,
      videoUrl,
      brand,
      department,
      categoryId,
      availableSizes,
      stock,
      isFeatured,
      isNewArrival,
    } = body;

    if (!name || !price || !department) {
      return NextResponse.json({ error: 'Name, price, and department are required' }, { status: 400 });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        imageUrl,
        videoUrl,
        brand: brand || 'J. VELORIA',
        department: department || 'CLOTHES',
        categoryId: categoryId ? parseInt(categoryId) : null,
        availableSizes: availableSizes || [],
        stock: parseInt(stock || '50'),
        isFeatured: isFeatured ?? false,
        isNewArrival: isNewArrival ?? true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
