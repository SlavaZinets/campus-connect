import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';
import { validateRequired } from '@/lib/validators';


export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search   = searchParams.get('search');
        const category = searchParams.get('category');
        const date     = searchParams.get('date');

        // Build WHERE clauses dynamically with parameterised args 
        const where = [];
        const args  = [];

        if (search) {
            where.push('events.title LIKE ?');
            args.push(`%${search}%`);
        }
        if (category) {
            where.push('categories.name = ?');
            args.push(category);
        }
        if (date) {
            where.push('DATE(events.start_at) = ?');
            args.push(date);
        }

        // JOIN categories + users so the UI receives `category` and `organiser`
        // as human-readable names instead of raw FK ids.
        const sql = `
            SELECT
                events.*,
                categories.name AS category,
                users.name      AS organiser
            FROM events
            JOIN categories ON events.category_id  = categories.id
            JOIN users      ON events.organiser_id = users.id
            ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
            ORDER BY events.start_at ASC
        `;

        const [rows] = await pool.query(sql, args);
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error('GET /api/events failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSession(req);
        if (!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        if (session.role !== 'organiser') return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const body = await req.json();
        
       
        const {
            title, 
            description, 
            location, 
            category_id, 
            start_at, 
            end_at,   // Added this
            capacity, 
            photo 
        } = body;

       
        const requiredError = validateRequired({title, description, location, category_id, start_at, capacity});
        if (requiredError) return NextResponse.json({error: requiredError}, {status: 400});

       
        const sql = `
            INSERT INTO events 
            (organiser_id, title, description, location, category_id, start_at, end_at, capacity, booked, photo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
        `;

        const [result] = await pool.query(sql, [
            session.id, 
            title, 
            description, 
            location, 
            category_id, 
            start_at, 
            end_at || null, 
            capacity, 
            photo || null   
        ]);

        return NextResponse.json({
            message: 'Event added successfully',
            eventId: result.insertId 
        }, {status: 201});

    } catch (error) {
       
        console.error('POST /api/events error:', error);
        
       
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}
