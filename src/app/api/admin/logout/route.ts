/**
 * POST /api/admin/logout
 * Clears the jv_session cookie and redirects to /admin/login.
 */

import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function POST() {
  await deleteSession();
  return NextResponse.json({ success: true });
}
