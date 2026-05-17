import { Router }                    from 'express'
import { login, getMe, getUsers, register, updateUser, deleteUser }   from '../controllers/auth.controller.js'
import { protect, adminOnly }       from '../middleware/auth.js'

const router = Router()

router.post('/login',    login)
router.get('/me',        protect, getMe)
router.get('/users',     protect, adminOnly, getUsers)
router.post('/register', protect, adminOnly, register)
router.put('/users/:id', protect, adminOnly, updateUser)
router.delete('/users/:id', protect, adminOnly, deleteUser)

export default router
