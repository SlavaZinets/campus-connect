import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req) {
    try {
        const session = await getSession(req);
        if(!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});

        // JOIN events + categories + users so the response carries everything the
        // /attendee/profile/bookings cards need to render without N+1 fetches.
        const sql = `
            SELECT
                bookings.id           AS booking_id,
                bookings.status,
                bookings.booked_at,
                events.id,
                events.title,
                events.description,
                events.location,
                events.start_at,
                events.capacity,
                categories.name       AS category,
                users.name            AS organiser
            FROM bookings
            JOIN events     ON bookings.event_id    = events.id
            JOIN categories ON events.category_id   = categories.id
            JOIN users      ON events.organiser_id  = users.id
            WHERE bookings.user_id = ?
            ORDER BY events.start_at ASC
        `;
        const [rows] = await pool.query(sql, [session.id]);
        return NextResponse.json(rows, {status: 200});
    } catch (error) {
        console.error('GET /api/bookings failed:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { event_id } = body;

        const session = await getSession(req);
        if(!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        if(session.role !== 'attendee') return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const [ event ] = await pool.query(
            'SELECT * FROM events WHERE id = ?',
            [event_id]
        );

        if (event.length === 0) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

        const [bookingCount] = await pool.query(
            'SELECT COUNT(*) as count FROM bookings WHERE event_id = ? AND status = ?',
            [event_id, 'confirmed']
        );
        if (bookingCount[0].count >= event[0].capacity) {
            return NextResponse.json({ error: 'Event is full' }, { status: 409 });
        }

        const [booking] = await pool.query(
            'INSERT INTO bookings (user_id, event_id, status) VALUES (?, ?, ?)',
            [session.id, event_id, 'confirmed']
        );

        return NextResponse.json({message: 'Event booked successfully'}, {status: 201});
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'You have already booked this event' }, { status: 409 });
        }
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}