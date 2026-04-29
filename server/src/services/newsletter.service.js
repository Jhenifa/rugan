import NewsletterSubscriber from "../models/NewsletterSubscriber.model.js";
import { getFrontendUrl } from "../config/env.js";
import { sendBulkEmailSafely, sendEmailSafely } from "../utils/email.js";
import { escapeHtml, joinUrl } from "../utils/helpers.js";

export async function sendNewsletterSubscriptionConfirmation(
  email,
  welcomeBack = false,
) {
  return sendEmailSafely(
    {
      to: email,
      subject: welcomeBack
        ? "Welcome back to the RUGAN Newsletter!"
        : "Welcome to the RUGAN Newsletter!",
      html: `
        <h2>${welcomeBack ? "Welcome back to RUGAN!" : "Welcome to RUGAN!"}</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You will receive updates on our programmes, stories from the field, and new articles from our blog.</p>
        <br>
        <p>Best regards,<br>The RUGAN Team</p>
      `,
    },
    welcomeBack
      ? "newsletter re-subscribe confirmation"
      : "newsletter confirmation",
  );
}

export async function notifySubscribersOfPublishedPost(post) {
  const subscribers = await NewsletterSubscriber.find({ isActive: true })
    .select("email")
    .lean();

  if (subscribers.length === 0) {
    return {
      ok: true,
      skipped: false,
      reason: "no-active-subscribers",
      total: 0,
      sent: 0,
      failed: 0,
    };
  }

  const articleUrl = joinUrl(getFrontendUrl(), `blog/${post.slug}`);
  const articleTitle = escapeHtml(post.title);
  const articleExcerpt = escapeHtml(post.excerpt);
  const authorName = escapeHtml(post.authorName || "RUGAN Team");
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const messages = subscribers.map(({ email }) => ({
    to: email,
    subject: `New on the RUGAN Blog: ${post.title}`,
    html: `
      <h2>A new article has been published on the RUGAN Blog</h2>
      <p><strong>${articleTitle}</strong></p>
      <p>${articleExcerpt}</p>
      <p><strong>Author:</strong> ${authorName}</p>
      ${publishedDate ? `<p><strong>Published:</strong> ${publishedDate}</p>` : ""}
      <p><a href="${articleUrl}" target="_blank" rel="noopener noreferrer">Read the full article</a></p>
      <br>
      <p>Thank you for following RUGAN.</p>
    `,
  }));

  const result = await sendBulkEmailSafely(
    messages,
    `newsletter article publish: ${post.slug}`,
  );

  return {
    ...result,
    reason: result.skipped ? "email-not-configured" : "sent",
  };
}
