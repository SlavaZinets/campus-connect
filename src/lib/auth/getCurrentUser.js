import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const [rows] = await pool.query(
      `SELECT id, name, email, phone_number, DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth, avatar_img, role
         FROM users WHERE id = ?`,
      [payload.id]
    );
    if (rows.length === 0) return null;

    const { id, name, email, phone_number, date_of_birth, avatar_img, role } = rows[0];
    const [firstName = '', ...rest] = (name || '').split(' ');
    return {
      id,
      firstName,
      lastName: rest.join(' '),
      email,
      phone: phone_number ?? '',
      dateOfBirth: date_of_birth ?? '',
      avatar_img,
      role,
    };
  } catch (err) {
    console.error('[getCurrentUser] failed:', err);
    return null;
  }
}
