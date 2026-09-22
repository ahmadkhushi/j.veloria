import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@jveloria.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    const inputEmail = (email || '').trim().toLowerCase();
    const inputPassword = (password || '').trim();

    // Check credentials (supports admin@jveloria.com or admin@jveloria.pk or custom env)
    const isValidEmail =
      inputEmail === expectedEmail.toLowerCase() ||
      inputEmail === 'admin@jveloria.pk' ||
      inputEmail === 'admin';

    const isValidPassword = inputPassword === expectedPassword;

    if (isValidEmail && isValidPassword) {
      await createSession(1, 'admin@jveloria.com', 'ADMIN');
      return NextResponse.json({ success: true, message: 'Admin authenticated successfully' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid admin credentials. Please check your email and password.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
