import mongoose from 'mongoose'

const partnershipSchema = new mongoose.Schema(
  {
    orgName:     { type: String, required: true, trim: true },
    contactName: { type: String, trim: true, default: '' },
    email:       { type: String, required: true, lowercase: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    partnership: {
      type: String,
      enum: [
        'Strategic Impact Partnership',
        'Program-Based Partnership',
        'Financial Sponsorship Partnership',
        'Technical and Knowledge Partnership',
        'Community Outreach Partnership',
        'Media and communications Partnership',
        'Volunteer Engagement Partnership',
        'Corporate Social Responsibility',
      ],
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


partnershipSchema.index({ status: 1, createdAt: -1 });
