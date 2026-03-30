import { Router }                                                  from 'express'
import { getPosts, getPost, createPost, updatePost, deletePost }  from '../controllers/blog.controller.js'
import { protect, adminOnly }                                     from '../middleware/auth.js'

const router = Router()

// Public
router.get('/posts',       getPosts)
router.get('/posts/:slug', getPost)

// Protected
router.post('/posts',         protect, createPost)
router.put('/posts/:id',      protect, updatePost)
router.delete('/posts/:id',   protect, adminOnly, deletePost)

export default router
