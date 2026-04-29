import { Router }                                                  from 'express'
import {
  getPosts,
  getPost,
  getAdminPosts,
  getAdminPost,
  createPost,
  updatePost,
  deletePost,
}  from '../controllers/blog.controller.js'
import { protect, adminOnly }                                     from '../middleware/auth.js'

const router = Router()

router.get('/posts',       getPosts)
router.get('/posts/:slug', getPost)
router.get('/admin/posts', protect, getAdminPosts)
router.get('/admin/posts/:id', protect, getAdminPost)

router.post('/posts',         protect, createPost)
router.put('/posts/:id',      protect, updatePost)
router.delete('/posts/:id',   protect, adminOnly, deletePost)

export default router
