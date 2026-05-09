import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const session = await getSession(req);
        if(!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        if (session.role !== 'admin') return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const [ user ] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );

        if (user.length === 0) return NextResponse.json({error: 'User not found'}, {status: 404});

        return NextResponse.json(user[0], {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function PATCH(req, { params }){
    try {
        const { id } = params;
        const body = await req.json();
        const { name, email, role } = body;
        const session = await getSession(req);
        if(!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        if (session.role !== 'admin') return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const [ user ] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );

        if (user.length === 0) return NextResponse.json({error: 'User not found'}, {status: 404});

        if (role) {
            const roleError = validateRole(role);
            if (roleError) return NextResponse.json({ error: roleError }, { status: 400 });
        }

        const [updated] = await pool.query(
            'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
            [name, email, role, id]
        );

        return NextResponse.json({message: 'Updated successfully'}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        const session = await getSession(req);
        if(!session) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
        if (session.role !== 'admin') return NextResponse.json({error: 'Forbidden'}, {status: 403});

        const [ user ] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );

        if (user.length === 0) return NextResponse.json({error: 'User not found'}, {status: 404});

        if (session.id === Number(id)) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
        }

        const [deleted] = await pool.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        return NextResponse.json({message: 'Account deleted successfully'}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}