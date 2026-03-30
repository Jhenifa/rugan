import jwt     from 'jsonwebtoken'
import User    from '../models/User.model.js'
import { AppError } from './errorHandler.js'

export async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null

    if (!token) throw new AppError('Not authorized, no token', 401)

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user      = await User.findById(decoded.id).select('-password')

    if (!req.user) throw new AppError('User not found', 401)
    next()
  } catch (err) {
    next(err)
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Admin access only', 403))
  }
  next()
}
