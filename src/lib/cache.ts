type CacheEntry<T> = {
    data: T
    timestamp: number
  }
  
  class SimpleCache {
    private cache: Map<string, CacheEntry<any>> = new Map()
    private defaultTTL: number = 5 * 60 * 1000 // 5 minutes in milliseconds
  
    /**
     * Get a value from the cache
     */
    get<T>(key: string): T | null {
      const entry = this.cache.get(key)
  
      if (!entry) {
        return null
      }
  
      const now = Date.now()
      if (now - entry.timestamp > this.defaultTTL) {
        // Entry has expired
        this.cache.delete(key)
        return null
      }
  
      return entry.data
    }
  
    /**
     * Set a value in the cache
     */
    set<T>(key: string, data: T, ttl?: number): void {
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      })
    }
  
    /**
     * Clear the entire cache or a specific key
     */
    clear(key?: string): void {
      if (key) {
        this.cache.delete(key)
      } else {
        this.cache.clear()
      }
    }
  }
  
  // Export a singleton instance
  export const cache = new SimpleCache()
  