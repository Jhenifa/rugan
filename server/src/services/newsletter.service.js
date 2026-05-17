import NewsletterSubscriber from "../models/NewsletterSubscriber.model.js";
import { getFrontendUrl } from "../config/env.js";
import { sendBulkEmailSafely, sendEmailSafely } from "../utils/email.js";
import { escapeHtml, joinUrl } from "../utils/helpers.js";
import { wrapEmailTemplate } from "../utils/emailTemplate.js";

/**
 * Strip all HTML tags. Used for plain-text contexts like email subjects.
 */
function stripHtmlTags(text = "") {
  return String(text).replace(/<[^>]*>/g, "");
}

/**
 * Sanitize HTML from contentEditable blocks for email output.
 * Strips dangerous elements (script, iframe, object, embed) and event handlers
 * but preserves all formatting tags (b, i, strong, em, div, span, br, a, etc.)
 * since content comes from authenticated CMS editors, not public users.
 */
function sanitizeHtml(text = "") {
  return String(text)
    // Remove script/iframe/object/embed tags and their content
    .replace(/<\s*(script|iframe|object|embed)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, "")
    // Remove self-closing dangerous tags
    .replace(/<\s*(script|iframe|object|embed)[^>]*\/?>/gi, "")
    // Remove event handler attributes (onclick, onerror, onload, etc.)
    .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, "");
}

/* ── Render blocks to email-safe HTML ─────────────────────── */
function blocksToEmailHtml(content) {
  if (!Array.isArray(content)) {
    return typeof content === "string"
      ? `<p style="font-size:16px;color:#111827;line-height:1.8;margin:0 0 16px">${sanitizeHtml(content)}</p>`
      : "";
  }

  return content.map((b) => {
    switch (b.type) {
      case "paragraph":
        return `<p style="font-size:16px;color:#111827;line-height:1.8;margin:0 0 16px">${sanitizeHtml(b.text || "")}</p>`;

      case "heading":
        return `<h2 style="font-size:20px;font-weight:700;color:#111827;margin:28px 0 12px;padding-left:12px;border-left:3px solid #4F7B44">${sanitizeHtml(b.text || "")}</h2>`;

      case "subheading":
        return `<h3 style="font-size:17px;font-weight:600;color:#1F2937;margin:20px 0 8px">${sanitizeHtml(b.text || "")}</h3>`;

      case "image":
        if (!b.url) return "";
        return `
          <figure style="margin:24px 0">
            <img src="${b.url}" alt="${escapeHtml(b.alt || "")}" style="width:100%;border-radius:8px;display:block;border:1px solid #E5E7EB">
            ${b.caption ? `<figcaption style="text-align:center;font-size:13px;color:#9CA3AF;margin-top:8px;font-style:italic">${escapeHtml(b.caption)}</figcaption>` : ""}
          </figure>`;

      case "quote":
        return `<blockquote style="border-left:4px solid #4F7B44;margin:20px 0;padding:12px 20px;font-style:italic;color:#111827;background:#F9FAFB;border-radius:0 8px 8px 0">${sanitizeHtml(b.text || "")}</blockquote>`;

      case "bullets":
        return `<ul style="margin:8px 0 18px;padding-left:24px;list-style-type:disc">${(b.items || []).map(item => `<li style="font-size:15px;color:#111827;line-height:1.7;margin-bottom:6px">${sanitizeHtml(item)}</li>`).join("")}</ul>`;

      case "numbered":
        return `<ol style="margin:8px 0 18px;padding-left:24px">${(b.items || []).map(item => `<li style="font-size:15px;color:#111827;line-height:1.7;margin-bottom:6px">${sanitizeHtml(item)}</li>`).join("")}</ol>`;

      case "callout": {
        const icons = { info: "💡", tip: "✅", warning: "⚠️" };
        const bgs   = { info: "#EFF6FF", tip: "#F0FDF4", warning: "#FFFBEB" };
        const icon  = icons[b.variant || "info"];
        const bg    = bgs[b.variant || "info"];
        return `<div style="background:${bg};border-radius:8px;padding:14px 18px;margin:14px 0;display:flex;gap:10px"><span style="font-size:18px">${icon}</span><p style="margin:0;font-size:15px;color:#111827;line-height:1.7">${sanitizeHtml(b.text || "")}</p></div>`;
      }

      case "conclusion":
        return `<div style="background:#4F7B44;border-radius:8px;padding:20px 24px;margin:24px 0"><p style="margin:0;font-size:16px;color:#ffffff;line-height:1.8">${sanitizeHtml(b.text || "")}</p></div>`;

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

  const body = welcomeBack
    ? `
      <p style="font-size:15px;color:#111827;line-height:1.7;margin:0 0 16px">
        Great to have you back! You're now re-subscribed to the RUGAN newsletter.
      </p>
      <p style="font-size:15px;color:#111827;line-height:1.7;margin:0 0 28px">
        You'll continue receiving updates on our programmes, stories from the girls and communities we work with, and new content from the RUGAN blog.
      </p>
      <a href="${frontendUrl}" style="display:inline-block;padding:12px 24px;background:#4F7B44;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px">
        Visit RUGAN.org →
      </a>
    `
    : `
      <p style="font-size:15px;color:#111827;line-height:1.7;margin:0 0 16px">
        Thank you for subscribing to the RUGAN newsletter.
      </p>
      <p style="font-size:15px;color:#111827;line-height:1.7;margin:0 0 16px">
        In rural Nigeria, millions of girls are growing up without access to the education, health information, and opportunities that should be theirs by right. RUGAN exists to change that, one community, one girl, one programme at a time.
      </p>
      <p style="font-size:15px;color:#111827;line-height:1.7;margin:0 0 16px">
        You have just joined a community of people who believe the same thing.
      </p>
      <p style="font-size:15px;color:#111827;line-height:1.7;margin:0 0 10px">
        As a subscriber, you will receive:
      </p>
      <ul style="margin:0 0 18px;padding-left:24px;list-style-type:disc">
        <li style="font-size:15px;color:#111827;line-height:1.7;margin-bottom:6px">Updates on different projects</li>
        <li style="font-size:15px;color:#111827;line-height:1.7;margin-bottom:6px">Real stories from the girls and communities we work with across Nigerian states</li>
        <li style="font-size:15px;color:#111827;line-height:1.7;margin-bottom:6px">New content from the RUGAN blog on girl-child empowerment, rural advocacy, and social impact</li>
      </ul>
      <p style="font-size:15px;color:#111827;line-height:1.7;margin:0 0 16px">
        This is not just a newsletter. It is a window into work that is changing lives and an invitation to be part of something that matters.
      </p>
      <p style="font-size:15px;color:#111827;line-height:1.7;margin:0">
        With gratitude,<br>The RUGAN Team
      </p>
    `;

  return sendEmailSafely(
    {
      to: email,
      subject: welcomeBack
        ? "Welcome back to the RUGAN Community"
        : "Welcome to the RUGAN Community",
      html: wrapEmailTemplate({
        heading: "RUGAN",
        subtitle: "Newsletter",
        body,
      }),
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
  const title        = sanitizeHtml(post.title);
  const excerpt      = sanitizeHtml(post.excerpt || "");
  const authorName   = escapeHtml(post.authorName || "The RUGAN Team");
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  // Limit to first ~3 blocks as preview if content is long
  const previewBlocks = Array.isArray(post.content) ? post.content.slice(0, 3) : post.content;
  const previewHtml = blocksToEmailHtml(previewBlocks);
  const hasMore = Array.isArray(post.content) && post.content.length > 3;

  const articleBody = `
    ${post.coverImage ? `<img src="${post.coverImage}" alt="${title}" style="width:100%;display:block;max-height:300px;object-fit:cover;border-radius:8px;margin-bottom:24px">` : ""}

    <h1 style="font-size:24px;font-weight:800;color:#101828;margin:0 0 12px;line-height:1.3;letter-spacing:-0.5px">
      ${title}
    </h1>

    <!-- Author and date — clearly separated -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid #F3F4F6;width:100%">
      <tr>
        ${authorName ? `<td style="font-size:13px;color:#6B7280;padding-right:16px">By: <strong style="color:#111827">${authorName}</strong></td>` : ""}
        ${publishedDate ? `<td style="font-size:13px;color:#6B7280;text-align:right">${publishedDate}</td>` : ""}
      </tr>
    </table>

    ${excerpt ? `<p style="font-size:17px;color:#111827;line-height:1.75;font-style:italic;margin:0 0 24px;padding:16px;background:#F9FAFB;border-radius:8px;border-left:3px solid #4F7B44">${excerpt}</p>` : ""}

    <!-- Article preview content -->
    ${previewHtml}

    ${hasMore ? `
      <div style="text-align:center;padding:24px 0">
        <p style="color:#6B7280;font-size:14px;margin:0 0 16px">Continue reading the full story</p>
        <a href="${articleUrl}" style="display:inline-block;padding:14px 32px;background:#4F7B44;color:white;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px">
          Read Full Article →
        </a>
      </div>
    ` : `
      <div style="text-align:center;padding:20px 0">
        <a href="${articleUrl}" style="display:inline-block;padding:12px 28px;background:#4F7B44;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">
          Read Full Article →
        </a>
      </div>
    `}


  `;

  const messages = subscribers.map(({ email }) => ({
    to: email,
    subject: `New Article: ${stripHtmlTags(post.title)}`,
    html: wrapEmailTemplate({
      heading: "RUGAN Blog",
      subtitle: "New article published",
      body: articleBody,
    }),
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
