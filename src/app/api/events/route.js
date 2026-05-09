import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';
import { validateRequired } from '@/lib/validators';


export async function GET(req) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM events'
        );

        if (rows.length === 0) return NextResponse.json([], {status: 200});
        
        return NextResponse.json(rows, {status: 200});    
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function POST(req) {
    try {
        const session = await getSession(req);
        if (!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        if (session.role !== 'organiser') return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const body = await req.json();
        const {title, description, location, category_id, start_at, capacity} = body;

        const requiredError = validateRequired({title, description, location, category_id, start_at, capacity});
        if (requiredError) return NextResponse.json({error: requiredError}, {status: 400});

        const [result] = await pool.query(
            'INSERT INTO events (organiser_id, title, description, location, category_id, start_at, capacity) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [session.id, title, description, location, category_id, start_at, capacity] 
        );

        return NextResponse.json({message: 'Event added successfully'}, {status: 201});

    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

