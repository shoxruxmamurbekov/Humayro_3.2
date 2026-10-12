import type { Request, Response, NextFunction } from 'express';

// Conservative headers that do not break inline styles, Google Fonts, YouTube embeds or map tiles.
// A strict Content-Security-Policy is intentionally left out until the app's inline usage is audited.
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(self)'
};

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(name, value);
  }
  next();
}
