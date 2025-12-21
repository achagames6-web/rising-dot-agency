import { kv } from '@vercel/kv';

/**
 * Vercel KV (Redis) caching utilities
 *
 * This module provides caching functionality using Vercel KV.
 * Environment variables required:
 * - KV_URL
 * - KV_REST_API_URL
 * - KV_REST_API_TOKEN
 * - KV_REST_API_READ_ONLY_TOKEN
 */

export { kv };

/**
 * Cache key prefixes for different data types
 */
export const CACHE_KEYS = {
  PAGE: 'page:',
  SERVICE: 'service:',
  PROJECT: 'project:',
  MEDIA: 'media:',
  ANIMATION_PRESET: 'preset:',
} as const;

/**
 * Default cache TTL (Time To Live) in seconds
 */
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

/**
 * Get cached data
 * @param key Cache key
 * @returns Cached data or null if not found
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const data = await kv.get<T>(key);
    return data;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set cached data
 * @param key Cache key
 * @param value Data to cache
 * @param ttl Time to live in seconds (default: 5 minutes)
 */
export async function setCached<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<void> {
  try {
    await kv.set(key, value, { ex: ttl });
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Delete cached data
 * @param key Cache key
 */
export async function deleteCached(key: string): Promise<void> {
  try {
    await kv.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

/**
 * Delete multiple cached items by pattern
 * @param pattern Key pattern (e.g., 'page:*')
 */
export async function deleteCachedByPattern(pattern: string): Promise<void> {
  try {
    const keys = await kv.keys(pattern);
    if (keys.length > 0) {
      await kv.del(...keys);
    }
  } catch (error) {
    console.error('Cache delete by pattern error:', error);
  }
}

/**
 * Invalidate all page caches
 */
export async function invalidatePageCache(): Promise<void> {
  await deleteCachedByPattern(`${CACHE_KEYS.PAGE}*`);
}

/**
 * Invalidate all service caches
 */
export async function invalidateServiceCache(): Promise<void> {
  await deleteCachedByPattern(`${CACHE_KEYS.SERVICE}*`);
}

/**
 * Invalidate all project caches
 */
export async function invalidateProjectCache(): Promise<void> {
  await deleteCachedByPattern(`${CACHE_KEYS.PROJECT}*`);
}

/**
 * Get or set cached data with a fallback function
 * @param key Cache key
 * @param fallback Function to get data if not cached
 * @param ttl Time to live in seconds
 * @returns Cached or freshly fetched data
 */
export async function getOrSetCached<T>(
  key: string,
  fallback: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  const cached = await getCached<T>(key);

  if (cached !== null) {
    return cached;
  }

  const data = await fallback();
  await setCached(key, data, ttl);

  return data;
}
