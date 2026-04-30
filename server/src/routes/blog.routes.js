import { Router } from 'express'
import {
  getPosts,
  getPost,
  getAdminPosts,
  getAdminPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blog.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { cacheControl, noCache } from '../middleware/cache.js'

const router = Router()

// Public — cached at CDN/browser level
// Blog listing: fresh for 60s, CDN may serve stale for 5min
router.get('/posts',       cacheControl({ maxAge: 60, staleWhileRevalidate: 300 }), getPosts)
// Individual post: fresh for 2min (view count updates make instant freshness impractical)
router.get('/posts/:slug', cacheControl({ maxAge: 120, staleWhileRevalidate: 600 }), getPost)

// Admin — never cached
router.get('/admin/posts',     protect, noCache(), getAdminPosts)
router.get('/admin/posts/:id', protect, noCache(), getAdminPost)

router.post('/posts',       protect,              noCache(), createPost)
router.put('/posts/:id',    protect,              noCache(), updatePost)
router.delete('/posts/:id', protect, adminOnly,   noCache(), deletePost)

export default router
