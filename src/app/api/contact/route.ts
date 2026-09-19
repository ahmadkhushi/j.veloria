import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const complaint = await prisma.complaint.create({
      data: {
        customerName: name,
        customerEmail: email,
        message: `[Subject: ${subject || 'General Inquiry'}] Phone: ${phone || 'N/A'} - ${message}`,
      },
    });

    return NextResponse.json({ success: true, complaint });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 });
  }
}
