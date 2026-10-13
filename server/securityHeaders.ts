import type { Request, Response, NextFunction } from 'express';

// Content-Security-Policy starts in Report-Only mode: violations are reported but not blocked.
// The source list comes from an audit of the app: one bundled module script (no inline scripts),
// inline style attributes from React, Google Fonts, YouTube embeds, news images from many publishers.
// Switch the header name to "Content-Security-Policy" after the reports are reviewed.
export const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "connect-src 'self' https:",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'"
].join('; ');

// Conservative headers that do not break inline styles, Google Fonts, YouTube embeds or map tiles.
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(self)',
  'Content-Security-Policy-Report-Only': CSP_REPORT_ONLY
};

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(name, value);
  }
  next();
}
