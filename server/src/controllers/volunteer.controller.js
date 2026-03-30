import VolunteerApplication from '../models/VolunteerApplication.model.js'
import { AppError }         from '../middleware/errorHandler.js'
import { sendEmail }        from '../utils/email.js'

// POST /api/volunteers/apply
export async function submitApplication(req, res, next) {
  try {
    const application = await VolunteerApplication.create(req.body)

    // Notify admin
    await sendEmail({
      to:      process.env.ADMIN_EMAIL,
      subject: 'New Volunteer Application',
      html: `
        <h2>New Volunteer Application</h2>
        <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
        <p><strong>WhatsApp:</strong> ${application.whatsapp}</p>
        <p><strong>Skills:</strong> ${application.skills}</p>
        <p><strong>Availability:</strong> ${application.availability}</p>
        <p><strong>Motivation:</strong> ${application.motivation}</p>
      `,
    }).catch(console.error) // Don't fail the request if email fails

    res.status(201).json({ success: true, message: 'Application submitted successfully.' })
  } catch (err) {
    next(err)
  }
}

// GET /api/volunteers  (admin only)
export async function getApplications(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const filter = status ? { status } : {}
    const skip   = (page - 1) * limit

    const [applications, total] = await Promise.all([
      VolunteerApplication.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      VolunteerApplication.countDocuments(filter),
    ])

    res.json({ success: true, data: applications, total })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/volunteers/:id/status  (admin only)
export async function updateStatus(req, res, next) {
  try {
    const { status, notes } = req.body
    const application = await VolunteerApplication.findByIdAndUpdate(
      req.params.id,
      { status, ...(notes && { notes }) },
      { new: true }
    )
    if (!application) throw new AppError('Application not found', 404)
    res.json({ success: true, data: application })
  } catch (err) {
    next(err)
  }
}
