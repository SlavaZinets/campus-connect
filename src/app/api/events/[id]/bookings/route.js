import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const session = await getSession(req);
        if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

        const [eventRows] = await pool.query(
            'SELECT organiser_id FROM events WHERE id = ?',
            [id]
        );
        if (eventRows.length === 0) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        if (session.role !== 'admin' && eventRows[0].organiser_id !== session.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const sql = `
            SELECT
                bookings.id,
                bookings.status,
                bookings.booked_at,
                users.name,
                users.email,
                users.avatar_img
            FROM bookings
            JOIN users ON bookings.user_id = users.id
            WHERE bookings.event_id = ?
            ORDER BY bookings.booked_at DESC
        `;
        const [rows] = await pool.query(sql, [id]);

        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error('GET /api/events/[id]/bookings failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
