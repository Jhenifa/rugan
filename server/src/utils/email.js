import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  return transporter
}

/**
 * sendEmail
 * @param {{ to, subject, html, replyTo? }} options
 */
export async function sendEmail({ to, subject, html, replyTo }) {
  if (process.env.NODE_ENV === 'test') return  // Skip in test env

  const transport = getTransporter()

  await transport.sendMail({
    from:    process.env.EMAIL_FROM || 'RUGAN <noreply@rugan.org>',
    to,
    subject,
    html,
    ...(replyTo && { replyTo }),
  })
}
