/**
 * Client-side redirects cache
 * Prevents excessive API calls by caching redirects data
 */

interface RedirectData {
  source: string;
  destination: string;
  type: number;
}

class RedirectsCache {
  private cache: RedirectData[] = [];
  private lastFetch: number = 0;
  private cacheDuration: number = 300000; // 5 minutes
  private isFetching: boolean = false;
  private fetchPromise: Promise<RedirectData[]> | null = null;

  async getRedirects(): Promise<RedirectData[]> {
    const now = Date.now();

    // Return cached data if still valid
    if (now - this.lastFetch < this.cacheDuration && this.cache.length > 0) {
      return this.cache;
    }

    // If already fetching, wait for that fetch to complete
    if (this.isFetching && this.fetchPromise) {
      return this.fetchPromise;
    }

    // Start new fetch
    this.isFetching = true;
    this.fetchPromise = this.fetchData();

    try {
      const data = await this.fetchPromise;
      this.cache = data;
      this.lastFetch = now;
      return data;
    } finally {
      this.isFetching = false;
      this.fetchPromise = null;
    }
  }

  private async fetchData(): Promise<RedirectData[]> {
    try {
      const res = await fetch('/api/redirects');
      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error('Error fetching redirects:', error);
    }
    return this.cache; // Return stale cache on error
  }

  clearCache() {
    this.cache = [];
    this.lastFetch = 0;
  }
}

// Singleton instance
export const redirectsCache = new RedirectsCache();
