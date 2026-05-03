import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);

/**
 * Creates a signed session cookie on login
 * @param {object} res - Next.js response object
 * @param {object} user - User object containing id, role, name
 */
export async function setSession(res, user){
    const token = await new SignJWT({ id: user.id, role: user.role, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);

    res.cookies.set('session', token, {
        httpOnly: true,
        maxAge: 60*60*24*7
    });
}

/**
 * Reads and verifies the session cookie from a request
 * @param {object} req - Next.js request object
 */
export async function getSession(req){
    const token = req.cookies.get('session')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}

/**
 * Clears the session cookie on logout
 * @param {object} res - Next.js response object
 */
export async function clearSession(res){
    res.cookies.set('session', '', { maxAge: 0 });
}