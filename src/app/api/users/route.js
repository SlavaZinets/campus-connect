import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req) {
    try {
        const session = await getSession(req);
        if (!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        if (session.role !== 'admin') return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const [users] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users'
        )

        if (users.length === 0) return NextResponse.json([], {status: 200});

        return NextResponse.json(users, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}