/**
 * cache.js — lightweight HTTP cache-control middleware
 *
 * Applied to public GET routes (blog posts, etc.) so browsers and
 * Cloudflare CDN can serve repeated reads without hitting the server.
 *
 * maxAge — seconds the response is fresh (browser + CDN cache)
 * staleWhileRevalidate — seconds CDN may serve stale while fetching fresh
 */
export function cacheControl({ maxAge = 60, staleWhileRevalidate = 300 } = {}) {
  return (_req, res, next) => {
    res.set(
      "Cache-Control",
      `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    );
    next();
  };
}

/** No caching — for authenticated/admin routes and form submissions */
export function noCache() {
  return (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  };
}
