import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req, { params }) {
    try{
        const { id } = params;
        const session = await getSession(req);
        if(!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        
        const [booking] = await pool.query(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        if (booking.length === 0) return NextResponse.json({error: 'Booking not found'}, {status: 404});
        if (session.role !== 'admin' && booking[0].user_id !== session.id) {
            return NextResponse.json({error: 'Forbidden'}, {status: 403});
        }

        return NextResponse.json(booking[0], {status: 200});
    } catch(error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const session = await getSession(req);
        if(!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});

        const [booking] = await pool.query(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        if (booking.length === 0) return NextResponse.json({error: 'No bookings found'}, {status: 404});
        if (booking[0].user_id !== session.id) return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const [updated] = await pool.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            ['cancelled', id]
        );

        return NextResponse.json({message: 'Event cancelled'}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        const session = await getSession(req);
        if(!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        if(session.role !== 'admin') return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const [booking] = await pool.query(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        if (booking.length === 0) return NextResponse.json({error: 'Booking not found'}, {status: 404});

        const [deleted] = await pool.query(
            'DELETE FROM bookings WHERE id = ?',
            [id]
        );

        return NextResponse.json({message: 'Booking deleted successfully'}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}