/**
 * asyncHandler
 * Wraps an async route handler to automatically catch errors and pass to next()
 * Usage: router.get('/route', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

/**
 * paginate
 * Returns mongoose-compatible skip/limit from query params
 */
export function paginate(query, defaultLimit = 10) {
  const page  = Math.max(1, parseInt(query.page)  || 1)
  const limit = Math.min(100, parseInt(query.limit) || defaultLimit)
  const skip  = (page - 1) * limit
  return { page, limit, skip }
}

/**
 * sanitizeMongoQuery
 * Strips keys that start with $ to prevent NoSQL injection
 */
export function sanitizeMongoQuery(obj) {
  if (typeof obj !== 'object' || obj === null) return obj
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => !key.startsWith('$'))
      .map(([key, val]) => [key, sanitizeMongoQuery(val)])
  )
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function nl2br(value = '') {
  return escapeHtml(value).replace(/\r?\n/g, '<br />')
}

export function joinUrl(baseUrl = '', path = '') {
  const normalizedBase = String(baseUrl).trim().replace(/\/+$/, '')
  const normalizedPath = String(path).trim().replace(/^\/+/, '')

  if (!normalizedBase) {
    return normalizedPath ? `/${normalizedPath}` : '/'
  }

  return normalizedPath ? `${normalizedBase}/${normalizedPath}` : normalizedBase
}
