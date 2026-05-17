import PartnershipInquiry from '../models/PartnershipInquiry.model.js'
import { AppError }       from '../middleware/errorHandler.js'
import { sendEmailSafely } from '../utils/email.js'
import { escapeHtml, nl2br } from '../utils/helpers.js'
import { wrapEmailTemplate } from '../utils/emailTemplate.js'
import { appendToSheet } from '../utils/googleSheets.js'
import { getFrontendUrl, getPartnershipSheetUrl } from '../config/env.js'

async function sendPartnerConfirmation(inquiry) {
  const recipientName = inquiry.contactName || inquiry.orgName
  const frontendUrl = getFrontendUrl()
  return sendEmailSafely({
    to: inquiry.email,
    subject: 'We have received your partnership inquiry',
    html: wrapEmailTemplate({
      heading: 'RUGAN',
      subtitle: 'Partnership Inquiry',
      body: `
        <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px">Dear ${escapeHtml(inquiry.orgName)},</p>
        <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px">Thank you for reaching out to RUGAN. We have received your partnership inquiry and a member of our team will review it and be in touch with you shortly.</p>
        <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 12px">For reference, here is a summary of the information you submitted:</p>
        <div style="background:#F9FAFB;border-radius:8px;padding:16px;margin:0 0 20px;border-left:3px solid #4F7B44">
          <p style="font-size:14px;color:#374151;margin:0 0 12px"><strong>Organisation:</strong> ${escapeHtml(inquiry.orgName)}</p>
          <p style="font-size:14px;color:#374151;margin:0 0 12px"><strong>Partnership Type:</strong> ${escapeHtml(inquiry.partnership)}</p>
          <p style="font-size:14px;color:#374151;margin:0 0 12px"><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>
          <p style="font-size:14px;color:#374151;line-height:1.7;margin:0;word-break:break-word"><strong>Message:</strong> ${nl2br(inquiry.message)}</p>
        </div>
        <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px">At RUGAN, every partnership conversation matters to us. Whether you are exploring sponsorship, programme collaboration, or advocacy support, we are committed to building relationships that create meaningful impact for the girls and communities we serve.</p>
        <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px">If you have any additional information to share in the meantime, please do not hesitate to reply to this email.</p>
        <p style="font-size:15px;color:#374151;line-height:1.7;margin:0">
          Best regards,<br>The RUGAN Team
        </p>
      `,
    }),
  }, 'partnership user confirmation')
}

export async function submitInquiry(req, res, next) {
  try {
    const inquiry = await PartnershipInquiry.create(req.body)
    const contactName = inquiry.contactName || inquiry.orgName
    const partnershipSheetUrl = getPartnershipSheetUrl()
    
    // Append to Google Sheets
    const spreadsheetId = process.env.PARTNERSHIP_SHEET_ID
    if (spreadsheetId) {
      const values = [
        [
          inquiry.orgName ?? "",
          inquiry.email ?? "",
          inquiry.phone ?? "",
          inquiry.partnership ?? "",
          inquiry.message ?? "",
          new Date().toISOString(),
        ],
      ]

      try {
        await appendToSheet(spreadsheetId, "Sheet1!A:F", values)
      } catch (error) {
        console.error("Partnership inquiry saved, but Google Sheets sync failed.", error)
      }
    }

    const emailTasks = [sendPartnerConfirmation(inquiry)]

    if (process.env.ADMIN_EMAIL) {
      emailTasks.push(
        sendEmailSafely({
          to: process.env.ADMIN_EMAIL,
          subject: `New Partnership Inquiry - ${inquiry.orgName}`,
          html: wrapEmailTemplate({
            heading: 'RUGAN',
            subtitle: 'New Partnership Inquiry',
            body: `
              <h2 style="font-size:20px;font-weight:700;color:#101828;margin:0 0 16px">New Partnership Inquiry</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:20px">
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#6B7280;width:100px;vertical-align:top"><strong>Organization:</strong></td>
                  <td style="padding:8px 0;font-size:14px;color:#374151">${escapeHtml(inquiry.orgName)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#6B7280;vertical-align:top"><strong>Contact:</strong></td>
                  <td style="padding:8px 0;font-size:14px;color:#374151">${escapeHtml(contactName)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#6B7280;vertical-align:top"><strong>Email:</strong></td>
                  <td style="padding:8px 0;font-size:14px;color:#374151">${escapeHtml(inquiry.email)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#6B7280;vertical-align:top"><strong>Phone:</strong></td>
                  <td style="padding:8px 0;font-size:14px;color:#374151">${escapeHtml(inquiry.phone)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#6B7280;vertical-align:top"><strong>Type:</strong></td>
                  <td style="padding:8px 0;font-size:14px;color:#374151">${escapeHtml(inquiry.partnership)}</td>
                </tr>
              </table>
              ${
                partnershipSheetUrl
                  ? `<a href="${partnershipSheetUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:10px 20px;background:#4F7B44;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">Open Partnership Spreadsheet →</a>`
                  : `<div style="background:#F9FAFB;border-radius:8px;padding:16px;border-left:3px solid #4F7B44">
                      <p style="font-size:14px;color:#6B7280;margin:0 0 8px"><strong>Message:</strong></p>
                      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0">${nl2br(inquiry.message)}</p>
                     </div>`
              }
            `,
          }),
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
