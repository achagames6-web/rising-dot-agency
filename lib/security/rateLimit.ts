/**
 * Rate Limiting Utilities
 * Implements rate limiting for API endpoints
 */

import { kv } from '@/lib/cache/kv';

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;

  /**
   * Time window in seconds
   */
  windowSeconds: number;

  /**
   * Optional custom identifier (defaults to IP address)
   */
  identifier?: string;
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;

  /**
   * Number of requests remaining in the current window
   */
  remaining: number;

  /**
   * Time in seconds until the rate limit resets
   */
  resetIn: number;

  /**
   * Total number of requests allowed
   */
  limit: number;
}

/**
 * Check if a request is within rate limits
 * @param identifier Unique identifier (e.g., IP address, user ID)
 * @param config Rate limit configuration
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { maxRequests, windowSeconds } = config;
  const key = `ratelimit:${identifier}`;

  try {
    // Get current count
    const current = await kv.get<number>(key);
    const count = current || 0;

    // Get TTL
    const ttl = await kv.ttl(key);
    const resetIn = ttl > 0 ? ttl : windowSeconds;

    if (count >= maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetIn,
        limit: maxRequests,
      };
    }

    // Increment counter
    const newCount = count + 1;
    
    if (count === 0) {
      // First request in window, set with expiry
      await kv.set(key, newCount, { ex: windowSeconds });
    } else {
      // Increment existing counter
      await kv.incr(key);
    }

    return {
      allowed: true,
      remaining: maxRequests - newCount,
      resetIn,
      limit: maxRequests,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    
    // On error, allow the request but log the issue
    return {
      allowed: true,
      remaining: maxRequests,
      resetIn: windowSeconds,
      limit: maxRequests,
    };
  }
}

/**
 * Rate limit middleware for API routes
 * @param config Rate limit configuration
 * @returns Middleware function
 */
export function rateLimitMiddleware(config: RateLimitConfig) {
  return async (request: Request): Promise<RateLimitResult> => {
    // Get identifier from request (IP address or custom identifier)
    const identifier =
      config.identifier ||
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    return checkRateLimit(identifier, config);
  };
}

/**
 * Default rate limit configurations
 */
export const RateLimits = {
  /**
   * Form submissions: 5 requests per minute
   */
  FORM_SUBMISSION: {
    maxRequests: 5,
    windowSeconds: 60,
  },

  /**
   * API requests: 100 requests per minute
   */
  API_REQUEST: {
    maxRequests: 100,
    windowSeconds: 60,
  },

  /**
   * Authentication attempts: 5 requests per 15 minutes
   */
  AUTH_ATTEMPT: {
    maxRequests: 5,
    windowSeconds: 900,
  },

  /**
   * Password reset: 3 requests per hour
   */
  PASSWORD_RESET: {
    maxRequests: 3,
    windowSeconds: 3600,
  },
} as const;
