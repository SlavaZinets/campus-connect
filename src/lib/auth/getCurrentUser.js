import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);

/**
 * Reads the session cookie and returns the current user (or null) for use in
 * server components / layouts. Server-only — do not import from client code.
 *
 * Returns the same shape PersonalInfo / ProfileSidebar already expect:
 *   { id, firstName, lastName, email, phone, dateOfBirth, role }
 *
 * `phone` and `dateOfBirth` come back undefined because the users schema
 * doesn't have those columns yet.
 */
export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const [rows] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [payload.id]
    );
    if (rows.length === 0) return null;

    const { id, name, email, role } = rows[0];
    const [firstName = '', ...rest] = (name || '').split(' ');
    return {
      id,
      firstName,
      lastName: rest.join(' '),
      email,
      phone: undefined,
      dateOfBirth: undefined,
      role,
    };
  } catch {
    return null;
  }
}
