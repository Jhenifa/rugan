import nodemailer from 'nodemailer'
import { isEmailConfigured } from '../config/env.js'

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  if (!isEmailConfigured()) {
    throw new Error('Email service is not fully configured.')
  }

  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
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
  if (process.env.NODE_ENV === 'test') return

  const transport = getTransporter()

  return transport.sendMail({
    from:    process.env.EMAIL_FROM || 'RUGAN <noreply@rugan.org>',
    to,
    subject,
    html,
    ...(replyTo && { replyTo }),
  })
}

export async function sendEmailSafely(options, label = 'email notification') {
  if (!isEmailConfigured()) {
    console.warn(`Email skipped: ${label}. SMTP configuration is incomplete.`)
    return { ok: false, skipped: true }
  }

  try {
    await sendEmail(options)
    return { ok: true }
  } catch (error) {
    console.error(`Email send failed: ${label}`, error)
    return { ok: false, error }
  }
}

export async function sendBulkEmailSafely(messages, label = 'bulk email notification') {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: true, total: 0, sent: 0, failed: 0, skipped: false }
  }

  if (!isEmailConfigured()) {
    console.warn(`Email skipped: ${label}. SMTP configuration is incomplete.`)
    return {
      ok: false,
      skipped: true,
      total: messages.length,
      sent: 0,
      failed: messages.length,
    }
  }

  const results = await Promise.all(messages.map((message) => sendEmailSafely(message, label)))
  const sent = results.filter((result) => result.ok).length
  const failed = results.length - sent

  if (failed > 0) {
    console.warn(`Bulk email completed with failures: ${label}. Sent ${sent}/${results.length}.`)
  }

  return {
    ok: failed === 0,
    skipped: false,
    total: results.length,
    sent,
    failed,
  }
}
