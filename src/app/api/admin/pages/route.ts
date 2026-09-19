import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pages = await prisma.customPage.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, pages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dynamic pages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, content, metaTitle, metaDescription, showInHeader, showInFooter, isPublished, sortOrder } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const page = await prisma.customPage.create({
      data: {
        title,
        slug: generatedSlug,
        content,
        metaTitle: metaTitle || `${title} | J. VELORIA`,
        metaDescription,
        showInHeader: showInHeader ?? true,
        showInFooter: showInFooter ?? true,
        isPublished: isPublished ?? true,
        sortOrder: parseInt(sortOrder || '0'),
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Failed to create dynamic page' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.customPage.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
