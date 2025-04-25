import bcrypt from "bcryptjs"

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a random session ID
 */
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Encrypt session data
 */
export async function encrypt(data: any): Promise<string> {
  return JSON.stringify(data)
}

/**
 * Decrypt session data
 */
export async function decrypt(encryptedData: string | undefined): Promise<any> {
  if (!encryptedData) return null
  try {
    return JSON.parse(encryptedData)
  } catch (error) {
    return null
  }
}
