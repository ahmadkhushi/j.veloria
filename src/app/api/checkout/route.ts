import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, phone, address, city, paymentMethod, items, total } = body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    const orderRef = `JV-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        orderRef,
        customerName,
        phone,
        address,
        city: city || 'N/A',
        paymentMethod: paymentMethod || 'cod',
        status: 'PENDING',
        total: parseFloat(total),
        items: JSON.stringify(items),
      },
    });

    return NextResponse.json({ success: true, orderRef: order.orderRef, orderId: order.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
