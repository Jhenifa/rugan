import mongoose from 'mongoose'

const volunteerSchema = new mongoose.Schema(
  {
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, required: true, trim: true },
    whatsapp:     { type: String, required: true, trim: true },
    skills:       { type: String, required: true },
    availability: {
      type: String,
      enum: ['Weekdays', 'Weekends', 'Both', 'Flexible'],
      required: true,
    },
    motivation: { type: String, required: true },
    status: {
      type:    String,
      enum:    ['pending', 'reviewed', 'accepted', 'declined'],
      default: 'pending',
    },
    notes: { type: String, default: '' }, // Internal admin notes
  },
  { timestamps: true }
)

volunteerSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model('VolunteerApplication', volunteerSchema)
