import jwt        from 'jsonwebtoken'
import User       from '../models/User.model.js'
import { AppError } from '../middleware/errorHandler.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) throw new AppError('Email and password are required', 400)

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      throw new AppError('Invalid email or password', 401)
    }
    if (!user.isActive) throw new AppError('Account is deactivated', 403)

    const token = signToken(user._id)
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
export async function getMe(req, res) {
  res.json({ success: true, user: req.user })
}

// POST /api/auth/register  (admin-only, used for creating editor accounts)
export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body
    const exists = await User.findOne({ email })
    if (exists) throw new AppError('Email already in use', 400)

    const user  = await User.create({ name, email, password, role: role || 'editor' })
    const token = signToken(user._id)
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}
