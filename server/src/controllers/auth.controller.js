import jwt        from 'jsonwebtoken'
import User       from '../models/User.model.js'
import { AppError } from '../middleware/errorHandler.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

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

export async function getMe(req, res) {
  res.json({ success: true, user: req.user })
}

export async function getUsers(_req, res, next) {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('name email role isActive createdAt')

    res.json({ success: true, data: users, total: users.length })
  } catch (err) {
    next(err)
  }
}

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

export async function updateUser(req, res, next) {
  try {
    const { name, email, password, role, isActive } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) throw new AppError('User not found', 404);

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) throw new AppError('Email already in use', 400);
      user.email = email;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (password) user.password = password; // The pre-save hook handles hashing

    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) throw new AppError('User not found', 404);
    
    // Prevent self-deletion
    if (req.user._id.toString() === user._id.toString()) {
      throw new AppError('You cannot delete your own account', 400);
    }

    await user.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}
