export function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500
  let message    = err.message    || 'Internal Server Error'

  // Handle specific MongoDB / Mongoose errors to be more human-readable
  
  // 1. Mongoose buffering timeout (e.g., "Operation `users.findOne()` buffering timed out after 10000ms")
  if (err.message && err.message.includes('buffering timed out')) {
    statusCode = 503;
    message = 'The database connection timed out. Please try again in a moment.';
  }
  
  // 2. Mongoose CastError (invalid ObjectId format)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid item format or ID provided.';
  }
  
  // 3. MongoDB Duplicate Key Error (e.g., duplicate slug or email)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'record';
    message = `A ${field} with this information already exists.`;
  }
  
  // 4. Mongoose Validation Error
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(val => val.message);
    message = errors.join('. ');
  }
  
  // 5. Network / connection errors
  else if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
    statusCode = 503;
    message = 'We are currently experiencing database connection issues. Please try again later.';
  }

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
