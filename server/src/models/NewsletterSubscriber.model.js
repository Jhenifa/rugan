import mongoose from 'mongoose'

const subscriberSchema = new mongoose.Schema(
  {
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive:    { type: Boolean, default: true },
    subscribedAt:{ type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default mongoose.model('NewsletterSubscriber', subscriberSchema)

// Index for fast active subscriber queries (used in newsletter broadcasts)
subscriberSchema.index({ isActive: 1, subscribedAt: -1 });
