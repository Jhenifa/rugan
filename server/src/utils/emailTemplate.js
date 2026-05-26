import { getFrontendUrl } from '../config/env.js'

/**
 * Shared email template wrapper for all RUGAN emails.
 * Provides consistent branding: logo, green header, and footer.
 *
 * @param {{ subject: string, heading?: string, subtitle?: string, body: string }} options
 * @returns {string} Complete HTML email string
 */
export function wrapEmailTemplate({ heading, subtitle, body }) {
  const frontendUrl = getFrontendUrl()
  const logoUrl = `${frontendUrl}/icons/square-rugan-logo.jpg`

  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">

      <!-- Header with logo -->
      <div style="background:#4F7B44;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center">
        <img src="${logoUrl}" alt="RUGAN" width="56" height="56" style="display:block;margin:0 auto 12px;border-radius:8px;width:56px;height:56px;object-fit:cover;border:2px solid rgba(255,255,255,0.3)">
        ${heading ? `<h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:800;letter-spacing:-0.3px">${heading}</h1>` : ''}
        ${subtitle ? `<p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600">${subtitle}</p>` : ''}
      </div>

      <!-- Body -->
      <div style="padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px;background:#ffffff">
        ${body}

        <!-- Footer -->
        <hr style="border:none;border-top:1px solid #E5E7EB;margin:28px 0">
        <p style="font-size:12px;color:#9CA3AF;margin:0;text-align:center;line-height:1.6">
          <a href="${frontendUrl}" style="color:#4F7B44;text-decoration:none;font-weight:600">rugan.org</a><br>
          Empowering girls through education and mentorship.
        </p>
      </div>

    </div>
  `
}
