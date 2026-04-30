import NewsletterSubscriber from "../models/NewsletterSubscriber.model.js";
import { getFrontendUrl } from "../config/env.js";
import { sendBulkEmailSafely, sendEmailSafely } from "../utils/email.js";
import { escapeHtml, joinUrl } from "../utils/helpers.js";

/* ── Render blocks to email-safe HTML ─────────────────────── */
function blocksToEmailHtml(content) {
  if (!Array.isArray(content)) {
    return typeof content === "string"
      ? `<p style="font-size:16px;color:#374151;line-height:1.8;margin:0 0 16px">${escapeHtml(content)}</p>`
      : "";
  }

  return content.map((b) => {
    switch (b.type) {
      case "paragraph":
        return `<p style="font-size:16px;color:#374151;line-height:1.8;margin:0 0 16px">${escapeHtml(b.text || "")}</p>`;

      case "heading":
        return `<h2 style="font-size:20px;font-weight:700;color:#111827;margin:28px 0 12px;padding-left:12px;border-left:3px solid #4F7B44">${escapeHtml(b.text || "")}</h2>`;

      case "subheading":
        return `<h3 style="font-size:17px;font-weight:600;color:#1F2937;margin:20px 0 8px">${escapeHtml(b.text || "")}</h3>`;

      case "image":
        if (!b.url) return "";
        return `
          <figure style="margin:24px 0">
            <img src="${b.url}" alt="${escapeHtml(b.alt || "")}" style="width:100%;border-radius:8px;display:block;border:1px solid #E5E7EB">
            ${b.caption ? `<figcaption style="text-align:center;font-size:13px;color:#9CA3AF;margin-top:8px;font-style:italic">${escapeHtml(b.caption)}</figcaption>` : ""}
          </figure>`;

      case "quote":
        return `<blockquote style="border-left:4px solid #4F7B44;margin:20px 0;padding:12px 20px;font-style:italic;color:#374151;background:#F9FAFB;border-radius:0 8px 8px 0">${escapeHtml(b.text || "")}</blockquote>`;

      case "bullets":
        return `<ul style="margin:8px 0 18px;padding-left:0;list-style:none">${(b.items || []).map(item => `<li style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px"><span style="color:#4F7B44;font-weight:700;margin-top:2px">•</span><span style="font-size:15px;color:#374151;line-height:1.7">${escapeHtml(item)}</span></li>`).join("")}</ul>`;

      case "numbered":
        return `<ol style="margin:8px 0 18px;padding-left:24px">${(b.items || []).map(item => `<li style="font-size:15px;color:#374151;line-height:1.7;margin-bottom:6px">${escapeHtml(item)}</li>`).join("")}</ol>`;

      case "callout": {
        const icons = { info: "💡", tip: "✅", warning: "⚠️" };
        const bgs   = { info: "#EFF6FF", tip: "#F0FDF4", warning: "#FFFBEB" };
        const icon  = icons[b.variant || "info"];
        const bg    = bgs[b.variant || "info"];
        return `<div style="background:${bg};border-radius:8px;padding:14px 18px;margin:14px 0;display:flex;gap:10px"><span style="font-size:18px">${icon}</span><p style="margin:0;font-size:15px;color:#374151;line-height:1.7">${escapeHtml(b.text || "")}</p></div>`;
      }

      case "divider":
        return `<hr style="border:none;border-top:1px solid #E5E7EB;margin:28px 0">`;

      default:
        return "";
    }
  }).join("\n");
}

/* ── Subscription confirmation ────────────────────────────── */
export async function sendNewsletterSubscriptionConfirmation(
  email,
  welcomeBack = false,
) {
  const frontendUrl = getFrontendUrl();
  return sendEmailSafely(
    {
      to: email,
      subject: welcomeBack
        ? "Welcome back to the RUGAN Newsletter!"
        : "You're subscribed to RUGAN updates",
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#3d6235,#4F7B44);padding:36px 32px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:white;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px">RUGAN</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase">
              ${welcomeBack ? "Welcome back" : "Newsletter"}
            </p>
          </div>
          <div style="padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px;background:white">
            <h2 style="font-size:20px;font-weight:700;color:#101828;margin:0 0 12px">
              ${welcomeBack ? "Great to have you back!" : "Thanks for subscribing!"}
            </h2>
            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px">
              You'll receive updates on our programmes, stories from girls we work with, and new articles from the RUGAN blog — delivered right to your inbox.
            </p>
            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 28px">
              Together, we're building a future where every rural girl has the chance to learn, grow, and lead.
            </p>
            <a href="${frontendUrl}" style="display:inline-block;padding:12px 24px;background:#4F7B44;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px">
              Visit RUGAN.org →
            </a>
            <hr style="border:none;border-top:1px solid #E5E7EB;margin:28px 0">
            <p style="font-size:12px;color:#9CA3AF;margin:0">
              You subscribed at <a href="${frontendUrl}" style="color:#9CA3AF">${frontendUrl}</a>.
              To unsubscribe, reply to this email with "unsubscribe".
            </p>
          </div>
        </div>
      `,
    },
    welcomeBack ? "newsletter re-subscribe confirmation" : "newsletter confirmation",
  );
}

/* ── Notify subscribers of new published post ─────────────── */
export async function notifySubscribersOfPublishedPost(post) {
  const subscribers = await NewsletterSubscriber.find({ isActive: true })
    .select("email")
    .lean();

  if (subscribers.length === 0) {
    return { ok: true, skipped: false, reason: "no-active-subscribers", total: 0, sent: 0, failed: 0 };
  }

  const frontendUrl  = getFrontendUrl();
  const articleUrl   = joinUrl(frontendUrl, `blog/${post.slug}`);
  const title        = escapeHtml(post.title);
  const excerpt      = escapeHtml(post.excerpt || "");
  const authorName   = escapeHtml(post.authorName || "The RUGAN Team");
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  // Render the full article content for the email
  const bodyHtml = blocksToEmailHtml(post.content);

  // Limit to first ~3 blocks as preview if content is long
  const previewBlocks = Array.isArray(post.content) ? post.content.slice(0, 3) : post.content;
  const previewHtml = blocksToEmailHtml(previewBlocks);
  const hasMore = Array.isArray(post.content) && post.content.length > 3;

  const messages = subscribers.map(({ email }) => ({
    to: email,
    subject: `New Article: ${post.title}`,
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#3d6235,#4F7B44);padding:28px 32px;border-radius:12px 12px 0 0">
          <p style="color:rgba(255,255,255,0.75);font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px;font-weight:600">RUGAN Blog</p>
          <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0">New article published</p>
        </div>

        <!-- Cover image -->
        ${post.coverImage ? `<img src="${post.coverImage}" alt="${title}" style="width:100%;display:block;max-height:300px;object-fit:cover">` : ""}

        <!-- Body -->
        <div style="padding:32px;border:1px solid #E5E7EB;border-top:none;background:white;${!post.coverImage ? "border-radius:0 0 12px 12px" : ""}">

          <h1 style="font-size:24px;font-weight:800;color:#101828;margin:0 0 8px;line-height:1.3;letter-spacing:-0.5px">
            ${title}
          </h1>

          <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid #F3F4F6">
            ${authorName ? `<span style="font-size:13px;color:#6B7280">By <strong style="color:#374151">${authorName}</strong></span>` : ""}
            ${publishedDate ? `<span style="font-size:13px;color:#6B7280">${publishedDate}</span>` : ""}
          </div>

          ${excerpt ? `<p style="font-size:17px;color:#374151;line-height:1.75;font-style:italic;margin:0 0 24px;padding:16px;background:#F9FAFB;border-radius:8px;border-left:3px solid #4F7B44">${excerpt}</p>` : ""}

          <!-- Article preview content -->
          ${previewHtml}

          ${hasMore ? `
            <div style="text-align:center;padding:24px 0">
              <p style="color:#6B7280;font-size:14px;margin:0 0 16px">Continue reading on rugan.org</p>
              <a href="${articleUrl}" style="display:inline-block;padding:14px 32px;background:#4F7B44;color:white;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px">
                Read Full Article →
              </a>
            </div>
          ` : `
            <div style="text-align:center;padding:20px 0">
              <a href="${articleUrl}" style="display:inline-block;padding:12px 28px;background:#4F7B44;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">
                View on RUGAN.org →
              </a>
            </div>
          `}

          <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0">
          <p style="font-size:12px;color:#9CA3AF;margin:0;text-align:center">
            You're receiving this because you subscribed at <a href="${frontendUrl}" style="color:#9CA3AF">rugan.org</a>.
            To unsubscribe, reply with "unsubscribe".
          </p>
        </div>

      </div>
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
