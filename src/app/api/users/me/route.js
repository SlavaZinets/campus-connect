import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';
import { validateEmail } from '@/lib/validators';

export async function PATCH(req) {
    try {
        const session = await getSession(req);
        if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

        const body = await req.json();
        const { firstName, lastName, email, phone, dateOfBirth } = body;

        if (email !== undefined) {
            const emailError = validateEmail(email);
            if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });
        }

        const fields = [];
        const values = [];

        if (firstName !== undefined || lastName !== undefined) {
            const name = [firstName ?? '', lastName ?? ''].filter(Boolean).join(' ').trim();
            if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
            fields.push('name = ?');
            values.push(name);
        }
        if (email !== undefined)       { fields.push('email = ?');         values.push(email); }
        if (phone !== undefined)       { fields.push('phone_number = ?');  values.push(phone || null); }
        if (dateOfBirth !== undefined) { fields.push('date_of_birth = ?'); values.push(dateOfBirth || null); }

        if (fields.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        values.push(session.id);
        await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

        return NextResponse.json({ message: 'Updated successfully' }, { status: 200 });
    } catch (error) {
        if (error?.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }
        console.error('PATCH /api/users/me error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
