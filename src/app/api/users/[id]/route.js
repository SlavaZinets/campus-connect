import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';
import { validateEmail, validateRole } from '@/lib/validators';

export async function GET(req, { params }) {
    try {
        const { id } = await params;
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
        const { id } = await params;
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

        if (email !== undefined) {
            const emailError = validateEmail(email);
            if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });
        }

        if (role !== undefined) {
            const roleError = validateRole(role);
            if (roleError) return NextResponse.json({ error: roleError }, { status: 400 });
        }

        const fields = [];
        const values = [];
        if (name !== undefined)  { fields.push('name = ?');  values.push(name); }
        if (email !== undefined) { fields.push('email = ?'); values.push(email); }
        if (role !== undefined)  { fields.push('role = ?');  values.push(role); }

        if (fields.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        values.push(id);
        await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

        return NextResponse.json({message: 'Updated successfully'}, {status: 200});
    } catch (error) {
        if (error?.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
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

        // Remove child rows in FK-safe order before deleting the user.
        // 1. Sessions belonging to this user.
        await pool.query('DELETE FROM sessions WHERE user_id = ?', [id]);
        // 2. Bookings made by this user (as attendee).
        await pool.query('DELETE FROM bookings WHERE user_id = ?', [id]);
        // 3. Bookings on events this user organised (so events can be deleted next).
        await pool.query(
            'DELETE FROM bookings WHERE event_id IN (SELECT id FROM events WHERE organiser_id = ?)',
            [id]
        );
        // 4. Events created by this user.
        await pool.query('DELETE FROM events WHERE organiser_id = ?', [id]);
        // 5. Finally the user row itself.
        await pool.query('DELETE FROM users WHERE id = ?', [id]);

        return NextResponse.json({message: 'Account deleted successfully'}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}