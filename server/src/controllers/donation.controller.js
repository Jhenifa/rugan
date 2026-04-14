import Donation from "../models/Donation.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { sendEmail } from "../utils/email.js";
import Paystack from "paystack-api";
import crypto from "crypto";

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

export async function recordDonation(req, res, next) {
  try {
    const { paymentMethod, amount, frequency, donorEmail, donorName } =
      req.body;

    if (paymentMethod === "card") {
      // Real Paystack integration
      const transaction = await paystack.transaction.initialize({
        amount: amount * 100, // Paystack expects kobo
        email: donorEmail,
        reference: `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        callback_url: `${process.env.FRONTEND_URL}/donation/success`,
        metadata: {
          donorName,
          frequency,
        },
      });

      // Save donation with pending status
      const donation = await Donation.create({
        ...req.body,
        reference: transaction.data.reference,
        gateway: "paystack",
        status: "pending",
      });

      return res.status(201).json({
        success: true,
        message: "Payment initialized.",
        data: {
          authorization_url: transaction.data.authorization_url,
          reference: transaction.data.reference,
        },
      });
    }

    // For bank transfer, record donation
    const donation = await Donation.create(req.body);

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Bank Transfer Donation — ₦${donation.amount.toLocaleString()}`,
      html: `
        <h2>New Bank Transfer Donation</h2>
        <p><strong>Amount:</strong> ₦${donation.amount.toLocaleString()}</p>
        <p><strong>Frequency:</strong> ${donation.frequency}</p>
        <p><strong>Account Number:</strong> 2281542767</p>
        <p><strong>Bank:</strong> First Bank of Nigeria</p>
        <p><strong>Account Name:</strong> RUGAN NGO</p>
        ${donation.donorName ? `<p><strong>Donor:</strong> ${donation.donorName}</p>` : ""}
        ${donation.donorEmail ? `<p><strong>Email:</strong> ${donation.donorEmail}</p>` : ""}
        <p>Please verify the transfer and update the donation status.</p>
      `,
    }).catch(console.error);

    res
      .status(201)
      .json({
        success: true,
        message: "Donation recorded. Please complete your bank transfer.",
        data: donation,
      });
  } catch (err) {
    next(err);
  }
}

export async function handleWebhook(req, res, next) {
  try {
    // Verify Paystack webhook signature
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const { reference, amount, customer } = event.data;

      const donation = await Donation.findOneAndUpdate(
        { reference },
        {
          status: "successful",
          donorName: customer.name || donation.donorName,
          donorEmail: customer.email,
        },
        { new: true },
      );

      if (donation) {
        // Send confirmation email to donor
        await sendEmail({
          to: donation.donorEmail,
          subject: "Thank you for your donation!",
          html: `
            <h2>Donation Successful!</h2>
            <p>Dear ${donation.donorName || "Valued Donor"},</p>
            <p>Thank you for your generous donation of ₦${donation.amount.toLocaleString()} to RUGAN NGO.</p>
            <p>Your contribution will directly help empower girls in Nigeria through our education and mentorship programs.</p>
            <p>You will receive a tax-deductible receipt via email within 24 hours.</p>
            <br>
            <p>Best regards,<br>The RUGAN Team</p>
          `,
        }).catch(console.error);

        // Notify admin
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `✅ Donation Successful — ₦${donation.amount.toLocaleString()}`,
          html: `
            <h2>Donation Completed Successfully</h2>
            <p><strong>Amount:</strong> ₦${donation.amount.toLocaleString()}</p>
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Donor:</strong> ${donation.donorName || "Anonymous"}</p>
            <p><strong>Email:</strong> ${donation.donorEmail}</p>
            <p><strong>Payment Method:</strong> Card</p>
          `,
        }).catch(console.error);
      }
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getDonations(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Donation.countDocuments(filter),
    ]);

    const totals = await Donation.aggregate([
      { $match: { status: "successful" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      success: true,
      data: donations,
      total,
      totalRaised: totals[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
}
