import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sizes = await prisma.sizeOption.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, sizes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sizes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, label, code, sortOrder } = body;

    if (!type || !code) {
      return NextResponse.json({ error: 'Size type and code are required' }, { status: 400 });
    }

    const newSize = await prisma.sizeOption.create({
      data: {
        type, // "CLOTHING" | "FOOTWEAR"
        label: label || code,
        code,
        sortOrder: parseInt(sortOrder || '0'),
      },
    });

    return NextResponse.json({ success: true, size: newSize });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create size' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.sizeOption.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete size' }, { status: 500 });
  }
}
