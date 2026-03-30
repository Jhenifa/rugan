import BlogPost   from '../models/BlogPost.model.js'
import { AppError } from '../middleware/errorHandler.js'

export async function getPosts(req, res, next) {
  try {
    const { page = 1, limit = 10, status = 'published' } = req.query
    const skip   = (page - 1) * limit
    const filter = req.user ? { status } : { status: 'published' }

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-content')
        .populate('author', 'name'),
      BlogPost.countDocuments(filter),
    ])

    res.json({
      success: true,
      data:    posts,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    next(err)
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug }).populate('author', 'name')
    if (!post) throw new AppError('Post not found', 404)
    if (post.status !== 'published' && !req.user) throw new AppError('Post not found', 404)

    post.views += 1
    await post.save({ validateBeforeSave: false })

    res.json({ success: true, data: post })
  } catch (err) {
    next(err)
  }
}

export async function createPost(req, res, next) {
  try {
    const post = await BlogPost.create({ ...req.body, author: req.user._id, authorName: req.user.name })
    res.status(201).json({ success: true, data: post })
  } catch (err) {
    next(err)
  }
}

export async function updatePost(req, res, next) {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!post) throw new AppError('Post not found', 404)
    res.json({ success: true, data: post })
  } catch (err) {
    next(err)
  }
}

export async function deletePost(req, res, next) {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id)
    if (!post) throw new AppError('Post not found', 404)
    res.json({ success: true, message: 'Post deleted' })
  } catch (err) {
    next(err)
  }
}
