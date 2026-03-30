import { Router }                    from 'express'
import { login, getMe, register }   from '../controllers/auth.controller.js'
import { protect, adminOnly }       from '../middleware/auth.js'

const router = Router()

router.post('/login',    login)
router.get('/me',        protect, getMe)
router.post('/register', protect, adminOnly, register)  // Only admins can create new users

export default router
