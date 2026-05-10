import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req) {
    try {
        const session = await getSession(req);
        if (!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        if (session.role !== 'organiser') return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const [events] = await pool.query(
            'SELECT * FROM events WHERE organiser_id = ?',
            [session.id]
        );

        if (events.length === 0) return NextResponse.json([], {status: 200});
        
        return NextResponse.json(events, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}