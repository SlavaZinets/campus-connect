import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { setSession } from '@/lib/session';
import { validateRequired, validateEmail, validatePassword } from '@/lib/validators';

export async function POST(req){
    try{
        const body = await req.json();
        const {name, email, password, role} = body;

        const requiredError = validateRequired({ name, email, password });
        if (requiredError) return NextResponse.json({ error: requiredError }, { status: 400});

        const emailError = validateEmail(email);
        if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });

        const passwordError = validatePassword(password);
        if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

        const [exisitng] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        )

        if (exisitng.length > 0) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }

        const hash = await hashPassword(password);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, hash, role || 'attendee']
        );

        const user = {id: result.insertId, name, role: role || 'attendee'};
        const res = NextResponse.json({ message: 'Registration successful' }, { status: 201 });
        await setSession(res, user);
        return res;
    } catch(error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}