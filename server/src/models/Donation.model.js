import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema(
  {
    amount:    { type: Number, required: true, min: 100 },
    currency:  { type: String, default: 'NGN' },
    frequency: { type: String, enum: ['one-time', 'monthly'], default: 'one-time' },
    paymentMethod: {
      type: String,
      enum: ['card', 'transfer'],
      required: true,
    },
    donorName:  { type: String, trim: true },
    donorEmail: { type: String, trim: true, lowercase: true },

    reference:  { type: String, unique: true, sparse: true },
    gateway:    { type: String, enum: ['paystack', 'flutterwave', 'manual'], default: 'manual' },
    status: {
      type:    String,
      enum:    ['pending', 'successful', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

donationSchema.index({ status: 1, createdAt: -1 })
donationSchema.index({ reference: 1 })

export default mongoose.model('Donation', donationSchema)
