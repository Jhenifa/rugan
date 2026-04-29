import { Router }                    from 'express'
import { login, getMe, getUsers, register }   from '../controllers/auth.controller.js'
import { protect, adminOnly }       from '../middleware/auth.js'

const router = Router()

router.post('/login',    login)
router.get('/me',        protect, getMe)
router.get('/users',     protect, adminOnly, getUsers)
router.post('/register', protect, adminOnly, register)

export default router
