import PartnershipInquiry from '../models/PartnershipInquiry.model.js'
import { AppError }       from '../middleware/errorHandler.js'
import { sendEmail }      from '../utils/email.js'

export async function submitInquiry(req, res, next) {
  try {
    const inquiry = await PartnershipInquiry.create(req.body)

    await sendEmail({
      to:      process.env.ADMIN_EMAIL,
      subject: `New Partnership Inquiry — ${inquiry.orgName}`,
      html: `
        <h2>New Partnership Inquiry</h2>
        <p><strong>Organization:</strong> ${inquiry.orgName}</p>
        <p><strong>Contact:</strong> ${inquiry.contactName}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone}</p>
        <p><strong>Type:</strong> ${inquiry.partnership}</p>
        <p><strong>Message:</strong> ${inquiry.message}</p>
      `,
    }).catch(console.error)

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully.' })
  } catch (err) {
    next(err)
  }
}

export async function getInquiries(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const filter = status ? { status } : {}
    const skip   = (page - 1) * limit

    const [inquiries, total] = await Promise.all([
      PartnershipInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      PartnershipInquiry.countDocuments(filter),
    ])

    res.json({ success: true, data: inquiries, total })
  } catch (err) {
    next(err)
  }
}

export async function updateStatus(req, res, next) {
  try {
    const inquiry = await PartnershipInquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!inquiry) throw new AppError('Inquiry not found', 404)
    res.json({ success: true, data: inquiry })
  } catch (err) {
    next(err)
  }
}
