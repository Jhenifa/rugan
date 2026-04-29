import NewsletterSubscriber from "../models/NewsletterSubscriber.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { sendEmailSafely } from "../utils/email.js";
import { sendNewsletterSubscriptionConfirmation } from "../services/newsletter.service.js";
import { escapeHtml } from "../utils/helpers.js";

export async function subscribe(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) throw new AppError("Email is required", 400);

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.json({ success: true, message: "Already subscribed!" });
      }

      existing.isActive = true;
      await existing.save();
      const emailTasks = [sendNewsletterSubscriptionConfirmation(email, true)];

      if (process.env.ADMIN_EMAIL) {
        emailTasks.push(
          sendEmailSafely(
            {
            to: process.env.ADMIN_EMAIL,
            subject: "Newsletter Subscriber Re-activated",
            html: `<p>Subscriber re-activated: ${escapeHtml(email)}</p>`,
            },
            "newsletter admin re-activation notification",
          ),
        );
      }

      await Promise.all(emailTasks);

      return res.json({
        success: true,
        message: "Welcome back! You are now re-subscribed.",
      });
    }

    await NewsletterSubscriber.create({ email });

    const emailTasks = [sendNewsletterSubscriptionConfirmation(email)];

    if (process.env.ADMIN_EMAIL) {
      emailTasks.push(
        sendEmailSafely(
          {
          to: process.env.ADMIN_EMAIL,
          subject: "New Newsletter Subscriber",
          html: `<p>New subscriber: ${escapeHtml(email)}</p>`,
          },
          "newsletter admin notification",
        ),
      );
    }

    await Promise.all(emailTasks);

    res
      .status(201)
      .json({
        success: true,
        message: "Subscribed successfully! Check your email for confirmation.",
      });
  } catch (err) {
    next(err);
  }
}

export async function unsubscribe(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const subscriber = await NewsletterSubscriber.findOne({ email });
    if (!subscriber) throw new AppError("Email not found", 404);

    subscriber.isActive = false;
    await subscriber.save();
    res.json({ success: true, message: "Unsubscribed successfully." });
  } catch (err) {
    next(err);
  }
}

export async function getSubscribers(req, res, next) {
  try {
    const subscribers = await NewsletterSubscriber.find({
      isActive: true,
    }).sort({ subscribedAt: -1 });
    res.json({ success: true, data: subscribers, total: subscribers.length });
  } catch (err) {
    next(err);
  }
}
