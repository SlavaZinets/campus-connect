/**
 * Checks that all required fields are present and not empty
 * @param {object} fields - Key value pairs of field names and their values
 * @return {string|null} - error message or null
 */
export function validateRequired(fields) {
    for (const [key, value] of Object.entries(fields)) {
        if (!value) return `${key} is required`;
    }
    return null;
}

/**
 * Validates the email
 * @param {string} email - the email address to validate 
 * @return {string|null} - error message or null
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return 'Invalid email address';
    return null;
}

/**
 * Valdidates password
 * @param {string} password - the password to validate 
 * @return {string|null} - error message or null
 */
export function validatePassword(password) {
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return null;
}

/**
 * Validates the role
 * @param {string} role - the role to validate 
 * @return {string|null} - error message or null
 */
export function validateRole(role) {
    const allowedRoles = ['attendee', 'organiser', 'admin'];
    if(!allowedRoles.includes(role)) return 'Invalid role';
    return null;
}