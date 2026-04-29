import PartnershipInquiry from '../models/PartnershipInquiry.model.js'
import { AppError }       from '../middleware/errorHandler.js'
import { sendEmailSafely } from '../utils/email.js'
import { escapeHtml, nl2br } from '../utils/helpers.js'

async function sendPartnerConfirmation(inquiry) {
  const recipientName = inquiry.contactName || inquiry.orgName

  return sendEmailSafely({
    to: inquiry.email,
    subject: 'We received your partnership inquiry',
    html: `
      <h2>Thank you for reaching out to RUGAN</h2>
      <p>Dear ${escapeHtml(recipientName)},</p>
      <p>We have received your partnership inquiry and our team will review it shortly.</p>
      <p><strong>Organization:</strong> ${escapeHtml(inquiry.orgName)}</p>
      <p><strong>Partnership Type:</strong> ${escapeHtml(inquiry.partnership)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>
      <p><strong>Message:</strong><br>${nl2br(inquiry.message)}</p>
      <br>
      <p>We will get back to you as soon as possible.</p>
      <p>Best regards,<br>The RUGAN Team</p>
    `,
  }, 'partnership user confirmation')
}

export async function submitInquiry(req, res, next) {
  try {
    const inquiry = await PartnershipInquiry.create(req.body)
    const contactName = inquiry.contactName || inquiry.orgName
    const emailTasks = [sendPartnerConfirmation(inquiry)]

    if (process.env.ADMIN_EMAIL) {
      emailTasks.push(
        sendEmailSafely({
          to:      process.env.ADMIN_EMAIL,
          subject: `New Partnership Inquiry - ${inquiry.orgName}`,
          html: `
            <h2>New Partnership Inquiry</h2>
            <p><strong>Organization:</strong> ${escapeHtml(inquiry.orgName)}</p>
            <p><strong>Contact:</strong> ${escapeHtml(contactName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>
            <p><strong>Type:</strong> ${escapeHtml(inquiry.partnership)}</p>
            <p><strong>Message:</strong><br>${nl2br(inquiry.message)}</p>
          `,
          replyTo: inquiry.email,
        }, 'partnership admin notification'),
      )
    }

    await Promise.all(emailTasks)

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
