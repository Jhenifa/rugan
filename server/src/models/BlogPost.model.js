import mongoose from 'mongoose'
import slugify  from 'slugify'

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: true,
      trim:     true,
      maxlength: 200,
    },
    slug: {
      type:   String,
      unique: true,
    },
    excerpt: {
      type:     String,
      required: true,
      maxlength: 300,
    },
    content: {
      type:     String,  // Rich HTML / Markdown content
      required: true,
    },
    coverImage: {
      type:    String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
    },
    authorName: {
      type:    String,
      default: 'RUGAN Team',
    },
    tags: [{ type: String }],
    status: {
      type:    String,
      enum:    ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: { type: Date },
    views:       { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Auto-generate slug from title
blogPostSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

// Set publishedAt when status changes to published
blogPostSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

blogPostSchema.index({ slug: 1 })
blogPostSchema.index({ status: 1, publishedAt: -1 })

export default mongoose.model('BlogPost', blogPostSchema)
