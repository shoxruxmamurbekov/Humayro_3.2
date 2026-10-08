import crypto from 'crypto';

/**
 * Validates that ADMIN_SECRET is configured.
 * Fails fast with a clear error message if missing.
 */
export function getRequiredAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || typeof secret !== 'string' || !secret.trim()) {
    const errorMsg = '[FATAL SECURITY ERROR] ADMIN_SECRET environment variable is missing or empty. Server startup aborted. Please set ADMIN_SECRET to a strong random token.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  return secret.trim();
}

/**
 * Constant-time comparison of two tokens using crypto.timingSafeEqual.
 * Mitigates timing attacks by ensuring comparison takes uniform time
 * regardless of match or length discrepancies.
 *
 * NOTE: The token values are NEVER logged.
 */
export function timingSafeAdminCheck(providedToken: unknown, secretToken: string): boolean {
  if (typeof providedToken !== 'string' || !providedToken || !secretToken) {
    return false;
  }

  const providedBuffer = Buffer.from(providedToken, 'utf8');
  const secretBuffer = Buffer.from(secretToken, 'utf8');

  if (providedBuffer.length !== secretBuffer.length) {
    // Perform a dummy timingSafeEqual on secretBuffer to avoid length-based early return timing leaks
    crypto.timingSafeEqual(secretBuffer, secretBuffer);
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, secretBuffer);
}
