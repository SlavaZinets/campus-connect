import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';
import { validateRequired } from '@/lib/validators';

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        // JOIN categories + users so the response uses human names matching the UI.
        // LEFT JOIN bookings (filtered to confirmed) and COUNT for the booked total —
        // events table has no booked column.
        const sql = `
            SELECT
                events.*,
                categories.name AS category,
                users.name      AS organiser,
                COUNT(CASE WHEN bookings.status = 'confirmed' THEN 1 END) AS booked
            FROM events
            JOIN categories      ON events.category_id  = categories.id
            JOIN users           ON events.organiser_id = users.id
            LEFT JOIN bookings   ON bookings.event_id   = events.id
            WHERE events.id = ?
            GROUP BY events.id
        `;

        const [result] = await pool.query(sql, [id]);

        if (result.length === 0) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(result[0], { status: 200 });
    } catch (error) {
        console.error('GET /api/events/[id] failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;

        const body = await req.json();
        const { title, description, location, category_id, start_at, end_at, capacity, photo } = body;

        const session = await getSession(req);
        if (!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        if (session.role !== 'organiser' && session.role !== 'admin') return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const [existing] = await pool.query(
            'SELECT * FROM events WHERE id = ?',
            [id]
        );

        if (existing.length === 0) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        if (session.role === 'organiser' && existing[0].organiser_id !== session.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const toMysqlDt = (v) => v ? v.replace('T', ' ') : null;

        await pool.query(
            'UPDATE events SET title = ?, description = ?, location = ?, category_id = ?, start_at = ?, end_at = ?, capacity = ?, photo = ? WHERE id = ?',
            [title, description, location, category_id, toMysqlDt(start_at), toMysqlDt(end_at), capacity, photo || null, id]
        );

        const [result] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
        return NextResponse.json(result[0], {status: 200});
        
    } catch (error) {
        console.error('PUT /api/events/[id] failed:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const session = await getSession(req);

        if (!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        
        
        const [eventRows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
        if (eventRows.length === 0) return NextResponse.json({error: 'Event not found'}, {status: 404});

        const event = eventRows[0];

        
        if (session.role === 'organiser' && event.organiser_id !== session.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await pool.query('DELETE FROM bookings WHERE event_id = ?', [id]);
        await pool.query('DELETE FROM events WHERE id = ?', [id]);

        return NextResponse.json({message: 'Deleted successfully'}, {status: 200});
    } catch (error) {
        
        console.error('DELETE /api/events error:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}