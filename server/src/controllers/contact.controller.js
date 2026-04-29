import { sendEmailSafely } from '../utils/email.js'
import { AppError }  from '../middleware/errorHandler.js'

export async function sendContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) throw new AppError('Name, email, and message are required', 400)
    if (!process.env.ADMIN_EMAIL) {
      throw new AppError('Contact inbox is not configured on the server.', 500)
    }

    const adminNotification = await sendEmailSafely({
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
    }, 'contact admin notification')

    if (!adminNotification.ok) {
      throw new AppError('We could not deliver your message right now. Please try again later.', 503)
    }

    await sendEmailSafely({
      to: email,
      subject: 'We received your message',
      html: `
        <h2>Thank you for contacting RUGAN</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and our team will get back to you soon.</p>
        <p><strong>Subject:</strong> ${subject || 'General inquiry'}</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <br>
        <p>Best regards,<br>The RUGAN Team</p>
      `,
    }, 'contact user confirmation')

    res.json({ success: true, message: 'Message sent successfully.' })
  } catch (err) {
    next(err)
  }
}
