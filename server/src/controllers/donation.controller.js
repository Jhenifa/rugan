import crypto from "crypto";
import mongoose from "mongoose";

import Paystack from "paystack-api";

import Donation from "../models/Donation.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { sendEmailSafely } from "../utils/email.js";

function getPaystackClient() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new AppError("Paystack is not configured on the server.", 500);
  }

  return Paystack(secretKey);
}

function getFrontendUrl(req) {
  const origin = req.get("origin");
  if (origin) return origin;

  const referer = req.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      // Fall back to FRONTEND_URL when the referer is malformed.
    }
  }

  return process.env.FRONTEND_URL?.trim();
}

function ensureDatabaseConnected() {
  if (mongoose.connection.readyState !== 1) {
    throw new AppError(
      process.env.NODE_ENV === "production"
        ? "The donations database is temporarily unavailable."
        : "MongoDB is not connected. Start your local database before testing donations.",
      503,
    );
  }
}

function formatAmount(amount) {
  return `NGN ${Number(amount || 0).toLocaleString()}`;
}

export async function recordDonation(req, res, next) {
  try {
    const { paymentMethod, amount, frequency, donorEmail, donorName } =
      req.body;
    const normalizedDonorEmail = donorEmail?.trim().toLowerCase();
    const normalizedDonorName = donorName?.trim();

    if (paymentMethod === "card") {
      if (!normalizedDonorEmail) {
        throw new AppError("Email is required for card payments.", 400);
      }

      const frontendUrl = getFrontendUrl(req);
      if (!frontendUrl) {
        throw new AppError(
          "FRONTEND_URL is not configured for donation redirects.",
          500,
        );
      }

      ensureDatabaseConnected();
      const paystack = getPaystackClient();

      const transaction = await paystack.transaction.initialize({
        amount: amount * 100,
        email: normalizedDonorEmail,
        reference: `DON-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        callback_url: `${frontendUrl}/donation/success`,
        metadata: {
          donorName: normalizedDonorName,
          frequency,
        },
      });

      await Donation.create({
        ...req.body,
        donorEmail: normalizedDonorEmail,
        donorName: normalizedDonorName,
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

    ensureDatabaseConnected();

    const donation = await Donation.create({
      ...req.body,
      donorEmail: normalizedDonorEmail,
      donorName: normalizedDonorName,
    });

    if (process.env.ADMIN_EMAIL) {
      await sendEmailSafely(
        {
          to: process.env.ADMIN_EMAIL,
          subject: `New Bank Transfer Donation - ${formatAmount(donation.amount)}`,
          html: `
            <h2>New Bank Transfer Donation</h2>
            <p><strong>Amount:</strong> ${formatAmount(donation.amount)}</p>
            <p><strong>Frequency:</strong> ${donation.frequency}</p>
            <p><strong>Account Number:</strong> 2281542767</p>
            <p><strong>Bank:</strong> First Bank of Nigeria</p>
            <p><strong>Account Name:</strong> RUGAN NGO</p>
            ${donation.donorName ? `<p><strong>Donor:</strong> ${donation.donorName}</p>` : ""}
            ${donation.donorEmail ? `<p><strong>Email:</strong> ${donation.donorEmail}</p>` : ""}
            <p>Please verify the transfer and update the donation status.</p>
          `,
        },
        "bank transfer admin notification",
      );
    }

    res.status(201).json({
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
    const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
    if (!secret) {
      throw new AppError("Paystack is not configured on the server.", 500);
    }

    const payload = req.rawBody || JSON.stringify(req.body);
    const hash = crypto
      .createHmac("sha512", secret)
      .update(payload)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const { reference, customer } = event.data;
      ensureDatabaseConnected();

      const donation = await Donation.findOne({ reference });

      if (donation) {
        donation.status = "successful";
        donation.donorName = customer?.name || donation.donorName;
        donation.donorEmail = customer?.email || donation.donorEmail;
        await donation.save();

        const emailTasks = [];

        if (donation.donorEmail) {
          emailTasks.push(
            sendEmailSafely(
              {
                to: donation.donorEmail,
                subject: "Thank you for your donation!",
                html: `
                  <h2>Donation Successful!</h2>
                  <p>Dear ${donation.donorName || "Valued Donor"},</p>
                  <p>Thank you for your generous donation of ${formatAmount(donation.amount)} to RUGAN NGO.</p>
                  <p>Your contribution will directly help empower girls in Nigeria through our education and mentorship programs.</p>
                  <p>You will receive a tax-deductible receipt via email within 24 hours.</p>
                  <br>
                  <p>Best regards,<br>The RUGAN Team</p>
                `,
              },
              "donation donor confirmation",
            ),
          );
        }

        if (process.env.ADMIN_EMAIL) {
          emailTasks.push(
            sendEmailSafely(
              {
                to: process.env.ADMIN_EMAIL,
                subject: `Donation Successful - ${formatAmount(donation.amount)}`,
                html: `
                  <h2>Donation Completed Successfully</h2>
                  <p><strong>Amount:</strong> ${formatAmount(donation.amount)}</p>
                  <p><strong>Reference:</strong> ${reference}</p>
                  <p><strong>Donor:</strong> ${donation.donorName || "Anonymous"}</p>
                  <p><strong>Email:</strong> ${donation.donorEmail || "N/A"}</p>
                  <p><strong>Payment Method:</strong> Card</p>
                `,
              },
              "donation admin notification",
            ),
          );
        }

        await Promise.all(emailTasks);
      }
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getDonations(req, res, next) {
  try {
    ensureDatabaseConnected();

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
