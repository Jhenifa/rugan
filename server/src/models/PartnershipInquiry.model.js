import mongoose from 'mongoose'

const partnershipSchema = new mongoose.Schema(
  {
    orgName:     { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email:       { type: String, required: true, lowercase: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    partnership: {
      type: String,
      enum: ['Corporate Partnership', 'Programme Sponsorship', 'In-Kind Donations', 'Other'],
      required: true,
    },
    message: { type: String, required: true },
    status: {
      type:    String,
      enum:    ['new', 'in-review', 'responded', 'closed'],
      default: 'new',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

partnershipSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model('PartnershipInquiry', partnershipSchema)
