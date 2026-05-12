import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  // Hydrate from DB so we get the latest email/role/name (JWT carries id+name+role only).
  const [rows] = await pool.query(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [session.id]
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(rows[0], { status: 200 });
}
