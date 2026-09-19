import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Order reference number or phone is required' }, { status: 400 });
    }

    const trimmedQuery = query.trim();

    // Query order by orderRef or phone
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderRef: { equals: trimmedQuery } },
          { phone: { contains: trimmedQuery } },
        ],
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'No order found matching this reference or phone number' }, { status: 404 });
    }

    let itemsList = [];
    try {
      itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    } catch (e) {
      itemsList = [];
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderRef: order.orderRef,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        city: order.city,
        status: order.status,
        total: order.total,
        paymentMethod: order.paymentMethod,
        items: itemsList,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error tracking order' }, { status: 500 });
  }
}
