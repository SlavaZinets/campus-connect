import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req) {
    try {
        const session = await getSession(req);
        
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
        }
        if (session.role !== 'organiser') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        
        const sql = `
            SELECT
                events.*,
                categories.name AS category
            FROM events
            LEFT JOIN categories ON events.category_id = categories.id
            WHERE events.organiser_id = ?
            ORDER BY events.created_at DESC
        `;

        const [events] = await pool.query(sql, [session.id]);

        
        return NextResponse.json(events, { status: 200 });

    } catch (error) {
        
        console.error('GET /api/organiser/events failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}