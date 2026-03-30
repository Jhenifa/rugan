export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500
  const message    = err.message    || 'Internal Server Error'

  if (process.env.NODE_ENV === 'development') {
    console.error('💥 Error:', err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}
