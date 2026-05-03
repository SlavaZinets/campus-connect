import bcrypt from 'bcrypt';

/**
 * Hashes a plain text password using bcrypt
 * @param {string} plainText - The plain text password
 * @returns {string} The bcrypt hash
 */
export async function hashPassword(plainText) {
  return await bcrypt.hash(plainText, 10);
}

/**
 * Verifies a plain text password against a bcrypt hash
 * @param {string} plainText - The plain text password attempt
 * @param {string} hash - The stored bcrypt hash
 * @returns {boolean} True if match, false if not
 */
export async function verifyPassword(plainText, hash) {
  return await bcrypt.compare(plainText, hash);
}