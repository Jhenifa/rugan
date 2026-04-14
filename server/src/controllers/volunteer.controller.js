import VolunteerApplication from "../models/VolunteerApplication.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { sendEmail } from "../utils/email.js";
import { appendToSheet } from "../utils/googleSheets.js";

export async function submitApplication(req, res, next) {
  try {
    const application = await VolunteerApplication.create(req.body);

    // Append to Google Sheets
    const spreadsheetId = process.env.VOLUNTEER_SHEET_ID;
    if (spreadsheetId) {
      const values = [
        [
          application.firstName,
          application.lastName,
          application.email,
          application.whatsapp,
          application.skills,
          application.availability,
          application.motivation,
          new Date().toISOString(),
        ],
      ];

      await appendToSheet(spreadsheetId, "Sheet1!A:H", values);
    }

    // Send confirmation email to volunteer
    await sendEmail({
      to: application.email,
      subject: "Thank you for your volunteer application!",
      html: `
        <h2>Thank you for applying to volunteer with RUGAN!</h2>
        <p>Dear ${application.firstName},</p>
        <p>We have received your volunteer application and are excited about your interest in joining our mission to empower girls in Nigeria.</p>
        <p>Our team will review your application and get back to you within 7-10 business days.</p>
        <p>In the meantime, feel free to follow us on social media for updates on our work.</p>
        <br>
        <p>Best regards,<br>The RUGAN Team</p>
      `,
    }).catch(console.error);

    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Volunteer Application",
      html: `
        <h2>New Volunteer Application</h2>
        <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>WhatsApp:</strong> ${application.whatsapp}</p>
        <p><strong>Skills:</strong> ${application.skills}</p>
        <p><strong>Availability:</strong> ${application.availability}</p>
        <p><strong>Motivation:</strong> ${application.motivation}</p>
      `,
    }).catch(console.error);

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
        .limit(Number(limit)),
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
