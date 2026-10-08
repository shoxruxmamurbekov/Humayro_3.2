import rateLimit from 'express-rate-limit';

/**
 * General rate limiter for all /api/* routes.
 * 120 requests per minute per IP.
 */
export const generalApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many API requests. Please slow down and try again shortly.'
    });
  }
});

/**
 * Strict rate limiter for compute-heavy AI endpoints (/api/ai/*).
 * 20 requests per minute per IP.
 */
export const aiApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'AI request rate limit reached. Please wait a moment before sending another AI query.'
    });
  }
});
