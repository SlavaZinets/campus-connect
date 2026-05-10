import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req) {
    try {
        const session = await getSession(req);
        if(!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});

        // Admin sees every booking with attendee details; everyone else only sees their own.
        if (session.role === 'admin') {
            const adminSql = `
                SELECT
                    bookings.id           AS booking_id,
                    bookings.status,
                    bookings.booked_at,
                    bookings.user_id,
                    events.id             AS event_id,
                    events.title,
                    events.location,
                    events.start_at,
                    events.capacity,
                    categories.name       AS category,
                    organiser.name        AS organiser,
                    attendee.name         AS attendee_name,
                    attendee.email        AS attendee_email
                FROM bookings
                JOIN events     ON bookings.event_id      = events.id
                JOIN categories ON events.category_id     = categories.id
                JOIN users organiser ON events.organiser_id = organiser.id
                JOIN users attendee  ON bookings.user_id    = attendee.id
                ORDER BY bookings.booked_at DESC
            `;
            const [adminRows] = await pool.query(adminSql);
            return NextResponse.json(adminRows, {status: 200});
        }

        const sql = `
            SELECT
                bookings.id           AS booking_id,
                bookings.status,
                bookings.booked_at,
                events.id,
                events.title,
                events.description,
                events.location,
                events.booked,
                events.photo,
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