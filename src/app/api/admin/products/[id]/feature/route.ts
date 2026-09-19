import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { isFeatured } = body;

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isFeatured: Boolean(isFeatured) },
    });

    return NextResponse.json({ success: true, isFeatured: updated.isFeatured });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update side-scroll feature state' }, { status: 500 });
  }
}
