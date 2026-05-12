import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { setSession } from '@/lib/session';
import { validateRequired } from '@/lib/validators';

export async function POST(req){
    try {
        const body = await req.json();
        const {email, password} = body;

        const requiredError = validateRequired({email, password});
        if (requiredError) return NextResponse.json({error: requiredError}, {status: 400});

        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return NextResponse.json({error: 'Invalid email or password'}, {status: 401});
        }

        const user = rows[0];
        const passwordMatch = await verifyPassword(password, user.password_hash);

        if (!passwordMatch) {
            return NextResponse.json({error: 'Invalid email or password'}, {status: 401})
        };

        const res = NextResponse.json({message: 'Login successful'}, {status: 200});
        await setSession(res, user);
        return res;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}