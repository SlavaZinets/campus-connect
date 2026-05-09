import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/session';

export async function POST(req) {
    try {
        const res = NextResponse.json({message: 'Logout successful'}, {status: 200});
        await clearSession(res);
        return res;
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}