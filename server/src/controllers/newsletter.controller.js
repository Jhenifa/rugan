import NewsletterSubscriber from "../models/NewsletterSubscriber.model.js";
import { AppError } from "../middleware/errorHandler.js";

export async function subscribe(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError("Email is required", 400);

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.json({ success: true, message: "Already subscribed!" });
      }
      existing.isActive = true;
      await existing.save();
      return res.json({
        success: true,
        message: "Welcome back! You are now re-subscribed.",
      });
    }

    const subscriber = await NewsletterSubscriber.create({ email });

    // Send welcome email
    await sendEmail({
      to: email,
      subject: "Welcome to RUGAN Newsletter!",
      html: `
        <h2>Welcome to RUGAN!</h2>
        <p>Thank you for subscribing to our newsletter. You'll receive updates on our work empowering girls in Nigeria.</p>
        <p>Stay tuned for stories, updates, and ways to get involved.</p>
        <br>
        <p>Best regards,<br>The RUGAN Team</p>
      `,
    }).catch(console.error);

    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Newsletter Subscriber",
      html: `<p>New subscriber: ${email}</p>`,
    }).catch(console.error);

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
    const { email } = req.body;
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
