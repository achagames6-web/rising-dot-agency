/**
 * API Security Helpers
 * Utilities for securing API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, type RateLimitConfig } from './rateLimit';
import { sanitizeText, sanitizeJSON } from './sanitization';

export interface SecureAPIOptions {
  /**
   * Rate limit configuration
   */
  rateLimit?: RateLimitConfig;

  /**
   * Require authentication
   */
  requireAuth?: boolean;

  /**
   * Required role
   */
  requiredRole?: string;

  /**
   * Sanitize request body
   */
  sanitizeBody?: boolean;
}

/**
 * Wrap an API handler with security features
 * @param handler API route handler
 * @param options Security options
 * @returns Wrapped handler
 */
export function secureAPI(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: SecureAPIOptions = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Rate limiting
      if (options.rateLimit) {
        const identifier =
          req.headers.get('x-forwarded-for') ||
          req.headers.get('x-real-ip') ||
          'unknown';

        const rateLimitResult = await checkRateLimit(
          identifier,
          options.rateLimit
        );

        if (!rateLimitResult.allowed) {
          return NextResponse.json(
            {
              error: 'Too many requests',
              message: 'Rate limit exceeded. Please try again later.',
              resetIn: rateLimitResult.resetIn,
            },
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.resetIn.toString(),
                'Retry-After': rateLimitResult.resetIn.toString(),
              },
            }
          );
        }

        // Add rate limit headers to response
        const response = await handler(req);
        response.headers.set(
          'X-RateLimit-Limit',
          rateLimitResult.limit.toString()
        );
        response.headers.set(
          'X-RateLimit-Remaining',
          rateLimitResult.remaining.toString()
        );
        response.headers.set(
          'X-RateLimit-Reset',
          rateLimitResult.resetIn.toString()
        );

        return response;
      }

      // Sanitize request body
      if (options.sanitizeBody && req.method !== 'GET') {
        try {
          const body = await req.json();
          const sanitized = sanitizeJSON(JSON.stringify(body));

          // Create a new request with sanitized body
          const sanitizedReq = new NextRequest(req.url, {
            method: req.method,
            headers: req.headers,
            body: JSON.stringify(sanitized),
          });

          return handler(sanitizedReq);
        } catch {
          // If body parsing fails, continue with original request
          return handler(req);
        }
      }

      return handler(req);
    } catch (error) {
      console.error('API security error:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'An unexpected error occurred',
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Validate request origin to prevent CSRF
 * @param req Request object
 * @returns True if origin is valid
 */
export function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  if (!origin) {
    // Allow requests without origin (e.g., same-origin requests)
    return true;
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

/**
 * Get client IP address from request
 * @param req Request object
 * @returns IP address
 */
export function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Log security event
 * @param event Event type
 * @param details Event details
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, any>
): void {
  console.log('[SECURITY]', {
    timestamp: new Date().toISOString(),
    event,
    ...details,
  });

  // In production, send to monitoring service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to monitoring service
  }
}
