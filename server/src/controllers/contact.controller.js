import { sendEmailSafely } from '../utils/email.js'
import { AppError }  from '../middleware/errorHandler.js'
import { wrapEmailTemplate } from '../utils/emailTemplate.js'

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
      html: wrapEmailTemplate({
        heading: 'RUGAN',
        subtitle: 'New Contact Message',
        body: `
          <h2 style="font-size:20px;font-weight:700;color:#101828;margin:0 0 16px">New Contact Message</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:20px">
            <tr>
              <td style="padding:8px 0;font-size:14px;color:#6B7280;width:80px;vertical-align:top"><strong>Name:</strong></td>
              <td style="padding:8px 0;font-size:14px;color:#374151">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:14px;color:#6B7280;vertical-align:top"><strong>Email:</strong></td>
              <td style="padding:8px 0;font-size:14px;color:#374151">${email}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:14px;color:#6B7280;vertical-align:top"><strong>Subject:</strong></td>
              <td style="padding:8px 0;font-size:14px;color:#374151">${subject || 'N/A'}</td>
            </tr>
          </table>
          <div style="background:#F9FAFB;border-radius:8px;padding:16px;border-left:3px solid #4F7B44">
            <p style="font-size:14px;color:#374151;line-height:1.7;margin:0;word-break:break-word"><strong>Message:</strong> ${message}</p>
          </div>
        `,
      }),
      replyTo: email,
    }, 'contact admin notification')

    if (!adminNotification.ok) {
      throw new AppError('We could not deliver your message right now. Please try again later.', 503)
    }

    await sendEmailSafely({
      to: email,
      subject: 'We received your message',
      html: wrapEmailTemplate({
        heading: 'RUGAN',
        subtitle: 'Message Received',
        body: `
          <h2 style="font-size:20px;font-weight:700;color:#101828;margin:0 0 12px">Thank you for contacting RUGAN</h2>
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 12px">Dear ${name},</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px">We have received your message and our team will get back to you soon.</p>
          <div style="background:#F9FAFB;border-radius:8px;padding:16px;margin-bottom:20px">
            <p style="font-size:14px;color:#374151;margin:0 0 12px"><strong>Subject:</strong> ${subject || 'General inquiry'}</p>
            <p style="font-size:14px;color:#374151;line-height:1.7;margin:0;word-break:break-word"><strong>Your message:</strong> ${message}</p>
          </div>
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0">Best regards,<br>The RUGAN Team</p>
        `,
      }),
    }, 'contact user confirmation')

    res.json({ success: true, message: 'Message sent successfully.' })
  } catch (err) {
    next(err)
  }
}
