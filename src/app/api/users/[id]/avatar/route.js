import { NextResponse } from 'next/server';
import pool from '@/lib/db'; 
import { getSession } from '@/lib/session'; 

export async function PATCH(req, { params }) {
  try {
    
    const { id } = await params;
    const userId = id;
    
    const session = await getSession(req);
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    
    const body = await req.json();
    const { avatarBase64 } = body;

    if (!avatarBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    
    if (session.id !== parseInt(userId)) {
      return NextResponse.json({ error: 'Forbidden: You cannot edit another user' }, { status: 403 });
    }

    
    
    const [result] = await pool.query(
      'UPDATE users SET avatar_img = ? WHERE id = ?',
      [avatarBase64, userId]
    );

    // 2. Check if it actually changed anything!
    if (result.affectedRows === 0) {
      console.log(`WARNING: Tried to update user ${userId}, but they don't exist!`);
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Avatar saved successfully' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}