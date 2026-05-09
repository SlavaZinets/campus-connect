import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req) {
    try {
        const session = await getSession(req);
        if(!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});

        const [bookings] = await pool.query(
            'SELECT * FROM bookings WHERE user_id = ?',
            [session.id]
        )

        if(bookings.length === 0) return NextResponse.json([], {status: 200});

        return NextResponse.json(bookings, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { event_id } = body;

        const session = await getSession(req);
        if(!session) return NextResponse.json({error: Unauthorised}, {status: 401});
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