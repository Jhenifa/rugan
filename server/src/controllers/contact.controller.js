import { sendEmail } from '../utils/email.js'
import { AppError }  from '../middleware/errorHandler.js'

// POST /api/contact
export async function sendContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) throw new AppError('Name, email, and message are required', 400)

    await sendEmail({
      to:      process.env.ADMIN_EMAIL,
      subject: `Contact Form: ${subject || 'New Message'}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      replyTo: email,
    })

    res.json({ success: true, message: 'Message sent successfully.' })
  } catch (err) {
    next(err)
  }
}
