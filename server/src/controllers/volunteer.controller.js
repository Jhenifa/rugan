import VolunteerApplication from "../models/VolunteerApplication.model.js";
import { getVolunteerSheetUrl, getFrontendUrl } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";
import { sendEmailSafely } from "../utils/email.js";
import { appendToSheet } from "../utils/googleSheets.js";
import { escapeHtml, nl2br } from "../utils/helpers.js";
import { wrapEmailTemplate } from "../utils/emailTemplate.js";

export async function submitApplication(req, res, next) {
  try {
    const application = await VolunteerApplication.create(req.body);
    const applicantName = `${application.firstName} ${application.lastName}`.trim();
    const volunteerSheetUrl = getVolunteerSheetUrl();

    // Append to Google Sheets
    const spreadsheetId = process.env.VOLUNTEER_SHEET_ID;
    if (spreadsheetId) {
      const values = [
        [
          application.firstName ?? "",
          application.lastName ?? "",
          application.email ?? "",
          application.whatsapp ?? "",
          application.skills ?? "",
          application.availability ?? "",
          application.motivation ?? "",
          new Date().toISOString(),
        ],
      ];

      try {
        await appendToSheet(spreadsheetId, "Sheet1!A:H", values);
      } catch (error) {
        console.error("Volunteer application saved, but Google Sheets sync failed.", error);
      }
    }

    const frontendUrl = getFrontendUrl();

    const emailTasks = [
      sendEmailSafely(
        {
          to: application.email,
          subject: "Your volunteer application has been received",
          html: wrapEmailTemplate({
            heading: "RUGAN",
            subtitle: "Volunteer Application",
            body: `
              <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px">Dear ${escapeHtml(application.firstName)},</p>
              <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px">Thank you for applying to volunteer with RUGAN. We have received your application and are genuinely encouraged by your interest in joining this mission.</p>
              <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px">RUGAN exists to advance the rights, education, and wellbeing of rural girls across Nigeria. Every volunteer who joins us brings us closer to a future where no girl is left behind because of where she was born.</p>
              <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 10px">Our team will carefully review your application and get back to you within 3 to 5 business days. In the meantime, we encourage you to:</p>
              <ul style="margin:0 0 18px;padding-left:24px;list-style-type:disc">
                <li style="font-size:15px;color:#374151;line-height:1.7;margin-bottom:6px">Follow us on social media for updates on our programmes and communities</li>
                <li style="font-size:15px;color:#374151;line-height:1.7;margin-bottom:6px">Visit <a href="${frontendUrl}" style="color:#4F7B44;text-decoration:none;font-weight:600">rugan.org</a> to learn more about our current initiatives</li>
                <li style="font-size:15px;color:#374151;line-height:1.7;margin-bottom:6px">Share our work with anyone who shares this vision</li>
              </ul>
              <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px">We look forward to the possibility of working with you.</p>
              <p style="font-size:15px;color:#374151;line-height:1.7;margin:0">
                Best regards,<br>The RUGAN Team
              </p>
            `,
          }),
        },
        "volunteer applicant confirmation",
      ),
    ];

    if (process.env.ADMIN_EMAIL) {
      emailTasks.push(
        sendEmailSafely(
          {
            to: process.env.ADMIN_EMAIL,
            subject: "New Volunteer Application",
            html: wrapEmailTemplate({
              heading: "RUGAN",
              subtitle: "New Volunteer Application",
              body: `
                <h2 style="font-size:20px;font-weight:700;color:#101828;margin:0 0 16px">New Volunteer Application</h2>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:20px">
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#6B7280;width:100px;vertical-align:top"><strong>Name:</strong></td>
                    <td style="padding:8px 0;font-size:14px;color:#374151">${escapeHtml(applicantName)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#6B7280;vertical-align:top"><strong>Email:</strong></td>
                    <td style="padding:8px 0;font-size:14px;color:#374151">${escapeHtml(application.email)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#6B7280;vertical-align:top"><strong>WhatsApp:</strong></td>
                    <td style="padding:8px 0;font-size:14px;color:#374151">${escapeHtml(application.whatsapp)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#6B7280;vertical-align:top"><strong>Availability:</strong></td>
                    <td style="padding:8px 0;font-size:14px;color:#374151">${escapeHtml(application.availability)}</td>
                  </tr>
                </table>
                ${
                  volunteerSheetUrl
                    ? `<a href="${volunteerSheetUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:10px 20px;background:#4F7B44;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">Open Volunteer Spreadsheet →</a>`
                    : `<div style="background:#F9FAFB;border-radius:8px;padding:16px;border-left:3px solid #4F7B44">
                        <p style="font-size:14px;color:#6B7280;margin:0 0 8px"><strong>Skills:</strong></p>
                        <p style="font-size:14px;color:#374151;margin:0 0 12px">${nl2br(application.skills)}</p>
                        <p style="font-size:14px;color:#6B7280;margin:0 0 8px"><strong>Motivation:</strong></p>
                        <p style="font-size:14px;color:#374151;margin:0">${nl2br(application.motivation)}</p>
                       </div>`
                }
              `,
            }),
            replyTo: application.email,
          },
          "volunteer admin notification",
        ),
      );
    }

    await Promise.all(emailTasks);

    res
      .status(201)
      .json({
        success: true,
        message:
          "Application submitted successfully! Check your email for confirmation.",
      });
  } catch (err) {
    next(err);
  }
}

export async function getApplications(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      VolunteerApplication.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      VolunteerApplication.countDocuments(filter),
    ]);

    res.json({ success: true, data: applications, total });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { status, notes } = req.body;
    const application = await VolunteerApplication.findByIdAndUpdate(
      req.params.id,
      { status, ...(notes && { notes }) },
      { new: true },
    );
    if (!application) throw new AppError("Application not found", 404);
    res.json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
}
