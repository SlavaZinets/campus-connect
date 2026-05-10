import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const session = await getSession(req);
        if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

        // JOIN events + categories + users so the booking detail page receives
        // everything it needs in one round-trip.
        const sql = `
            SELECT
                bookings.id           AS booking_id,
                bookings.user_id,
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
            WHERE bookings.id = ?
        `;
        const [rows] = await pool.query(sql, [id]);

        

        if (rows.length === 0) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        if (session.role !== 'admin' && rows[0].user_id !== session.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
        console.error('GET /api/bookings/[id] failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const session = await getSession(req);
        if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

        const body = await req.json();
        const { status: newStatus } = body;

        if (!newStatus) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const [rows] = await pool.query(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        if (rows.length === 0) return NextResponse.json({ error: 'No bookings found' }, { status: 404 });

        const currentBooking = rows[0];
        const oldStatus = currentBooking.status;
        const eventId = currentBooking.event_id;


        if (currentBooking.user_id !== session.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }


        await pool.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [newStatus, id]
        );


        if (oldStatus !== 'cancelled' && newStatus === 'cancelled') {
            await pool.query('UPDATE events SET booked = booked - 1 WHERE id = ?', [eventId]);
        }

        else if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
            await pool.query('UPDATE events SET booked = booked + 1 WHERE id = ?', [eventId]);
        }

        return NextResponse.json({ message: 'Booking updated successfully' }, { status: 200 });

    } catch (error) {

        console.error('PATCH /api/bookings error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const session = await getSession(req);
        if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
        if (session.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const [booking] = await pool.query(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        if (booking.length === 0) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

        const [deleted] = await pool.query(
            'DELETE FROM bookings WHERE id = ?',
            [id]
        );

        return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}