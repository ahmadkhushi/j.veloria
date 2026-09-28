/**
 * POST /api/admin/login
 * Validates email + password, checks ADMIN role, sets jv_session cookie.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin accounts only.' },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Create the JWT session cookie (7-day expiry, httpOnly).
    await createSession(user.id, user.email, user.role);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/login] Error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
