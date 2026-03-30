import Donation    from '../models/Donation.model.js'
import { AppError } from '../middleware/errorHandler.js'
import { sendEmail } from '../utils/email.js'

export async function recordDonation(req, res, next) {
  try {
    const donation = await Donation.create(req.body)

    await sendEmail({
      to:      process.env.ADMIN_EMAIL,
      subject: `New Donation — ₦${donation.amount.toLocaleString()}`,
      html: `
        <h2>New Donation Received</h2>
        <p><strong>Amount:</strong> ₦${donation.amount.toLocaleString()}</p>
        <p><strong>Frequency:</strong> ${donation.frequency}</p>
        <p><strong>Method:</strong> ${donation.paymentMethod}</p>
        ${donation.donorName  ? `<p><strong>Donor:</strong> ${donation.donorName}</p>` : ''}
        ${donation.donorEmail ? `<p><strong>Email:</strong> ${donation.donorEmail}</p>` : ''}
      `,
    }).catch(console.error)

    res.status(201).json({ success: true, message: 'Donation recorded.', data: donation })
  } catch (err) {
    next(err)
  }
}

export async function handleWebhook(req, res, next) {
  try {
    const { reference, status, amount } = req.body

    const donation = await Donation.findOneAndUpdate(
      { reference },
      { status: status === 'success' ? 'successful' : 'failed' },
      { new: true }
    )

    if (!donation) throw new AppError('Donation not found', 404)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function getDonations(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const filter = status ? { status } : {}
    const skip   = (page - 1) * limit

    const [donations, total] = await Promise.all([
      Donation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Donation.countDocuments(filter),
    ])

    const totals = await Donation.aggregate([
      { $match: { status: 'successful' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])

    res.json({ success: true, data: donations, total, totalRaised: totals[0]?.total || 0 })
  } catch (err) {
    next(err)
  }
}
