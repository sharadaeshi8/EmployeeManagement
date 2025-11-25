// Performance monitoring and optimization utilities

// Query performance monitoring
export class QueryPerformanceMonitor {
  private queryTimes: Map<string, number[]> = new Map();

  logQuery(queryName: string, executionTime: number) {
    if (!this.queryTimes.has(queryName)) {
      this.queryTimes.set(queryName, []);
    }

    const times = this.queryTimes.get(queryName)!;
    times.push(executionTime);

    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift();
    }

    // Log slow queries
    if (executionTime > 1000) {
      // 1 second
      console.warn(`Slow query detected: ${queryName} took ${executionTime}ms`);
    }
  }

  getStats(queryName: string) {
    const times = this.queryTimes.get(queryName) || [];
    if (times.length === 0) return null;

    const sorted = [...times].sort((a, b) => a - b);
    return {
      count: times.length,
      avg: times.reduce((sum, time) => sum + time, 0) / times.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  getAllStats() {
    const stats: Record<string, any> = {};
    for (const [queryName] of this.queryTimes) {
      stats[queryName] = this.getStats(queryName);
    }
    return stats;
  }
}

export const performanceMonitor = new QueryPerformanceMonitor();

// Rate limiting configuration (can be extended with Redis for production)
export class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  checkLimit(identifier: string): boolean {
    const now = Date.now();
    const userLimits = this.requests.get(identifier);

    if (!userLimits || now > userLimits.resetTime) {
      // Reset window
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (userLimits.count >= this.maxRequests) {
      return false; // Rate limit exceeded
    }

    userLimits.count++;
    return true;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Clean up rate limiter every hour
setInterval(() => {
  rateLimiter.cleanup();
}, 60 * 60 * 1000);
