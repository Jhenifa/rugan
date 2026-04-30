/**
 * ArticlePreviewModal — full-screen modal that renders an article preview
 * using the same block rendering as the public ArticlePage.
 */
import { useEffect } from "react";
import { Calendar, Clock, User, X, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { parseFormattedText } from "@/lib/formatText";

function readingTime(blocks) {
  if (!Array.isArray(blocks)) return 1;
  const words = blocks
    .map((b) => {
      if (b.type === "paragraph" || b.type === "heading" || b.type === "subheading" || b.type === "quote" || b.type === "callout" || b.type === "conclusion") {
        return b.text || "";
      }
      if (b.type === "bullets" || b.type === "numbered") {
        return (b.items || []).join(" ");
      }
      return "";
    })
    .join(" ");
  return Math.max(1, Math.round(words.split(/\s+/).filter(Boolean).length / 200));
}

/* ─── Block renderers (mirror ArticlePage) ──────────────── */
function renderBlock(block, index) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} style={{ fontSize: "1rem", color: "#374151", lineHeight: 1.85, marginBottom: "1.25rem" }}>
          {parseFormattedText(block.text)}
        </p>
      );
    case "heading":
      return (
        <h2 key={index} style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginTop: "2rem", marginBottom: "0.875rem", paddingLeft: "0.875rem", borderLeft: "3px solid var(--color-primary)" }}>
          {parseFormattedText(block.text)}
        </h2>
      );
    case "subheading":
      return (
        <h3 key={index} style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1F2937", margin: "1.5rem 0 0.5rem" }}>
          {parseFormattedText(block.text)}
        </h3>
      );
    case "image":
      return block.url ? (
        <figure key={index} style={{ margin: "1.75rem 0" }}>
          <img src={block.url} alt={block.alt || ""} style={{ width: "100%", borderRadius: "0.75rem", display: "block", border: "1px solid #E5E7EB" }} />
          {block.caption && (
            <figcaption style={{ textAlign: "center", fontSize: "0.8125rem", color: "#9CA3AF", marginTop: "0.5rem", fontStyle: "italic" }}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      ) : null;
    case "quote":
      return (
        <blockquote key={index} style={{ borderLeft: "4px solid #4F7B44", margin: "1.5rem 0", padding: "0.875rem 1.25rem", fontStyle: "italic", color: "#374151", background: "#F9FAFB", borderRadius: "0 0.625rem 0.625rem 0" }}>
          {parseFormattedText(block.text)}
        </blockquote>
      );
    case "bullets":
      return (
        <ul key={index} style={{ margin: "0.5rem 0 1.25rem 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {(block.items || []).map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
              <CheckCircle size={16} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "3px" }} />
              <span style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7 }}>{parseFormattedText(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "numbered":
      return (
        <ol key={index} style={{ margin: "0.5rem 0 1.25rem", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {(block.items || []).map((item, i) => (
            <li key={i} style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7 }}>{parseFormattedText(item)}</li>
          ))}
        </ol>
      );
    case "callout": {
      const variants = { info: { bg: "#EFF6FF", border: "#BFDBFE", icon: "💡" }, tip: { bg: "#F0FDF4", border: "#BBF7D0", icon: "✅" }, warning: { bg: "#FFFBEB", border: "#FDE68A", icon: "⚠️" } };
      const v = variants[block.variant || "info"];
      return (
        <div key={index} style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: "0.625rem", padding: "1rem 1.25rem", margin: "1rem 0", display: "flex", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{v.icon}</span>
          <p style={{ margin: 0, fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7 }}>{parseFormattedText(block.text)}</p>
        </div>
      );
    }
    case "divider":
      return <hr key={index} style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "2rem 0" }} />;
    case "conclusion":
      return (
        <div key={index} style={{ margin: "2rem 0 0", padding: "1.5rem", background: "var(--color-primary)", borderRadius: "1rem" }}>
          <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "white", lineHeight: 1.8, margin: 0 }}>
            <strong style={{ display: "block", marginBottom: "0.375rem", fontSize: "1rem" }}>Conclusion</strong>
            {parseFormattedText(block.text)}
          </p>
        </div>
      );
    default:
      return null;
  }
}

export default function ArticlePreviewModal({ form, blocks, onClose }) {
  const { user } = useAuth();
  const minutes = readingTime(blocks);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // Close on ESC
  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      overflowY: "auto",
    }}>
      {/* Close button */}
      <button type="button" onClick={onClose}
        style={{
          position: "fixed", top: 16, right: 16, zIndex: 10001,
          width: 40, height: 40, borderRadius: "50%",
          background: "#1F2937", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}>
        <X size={20} />
      </button>

      {/* Preview banner */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10001,
        background: "#4F7B44", color: "white", textAlign: "center",
        padding: "6px 0", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.05em",
      }}>
        PREVIEW MODE — This is how your article will appear to readers
      </div>

      {/* Article content */}
      <div style={{ background: "white", minHeight: "100vh" }}>
        {/* Hero */}
        <section style={{ position: "relative", minHeight: 280, overflow: "hidden", background: form.coverImage ? "transparent" : "#1a3a1a" }}>
          {form.coverImage && (
            <img src={form.coverImage} alt={form.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,25,10,0.72)" }} />
          <div style={{ position: "relative", zIndex: 10, maxWidth: 780, margin: "0 auto", padding: "4rem 1.5rem 2rem" }}>
            <h1 style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: "white",
              lineHeight: 1.25, marginBottom: "1.25rem", textWrap: "balance",
            }}>
              {form.title || "Untitled Article"}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center" }}>
              {[
                { icon: User, text: user?.name || "Author" },
                { icon: Calendar, text: today },
                { icon: Clock, text: `${minutes} min read` },
              ].map(({ icon: Icon, text }, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                  <Icon size={14} /> {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Body */}
        <section style={{ background: "#FAFAFA", paddingTop: "3rem", paddingBottom: "4rem" }}>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 1.5rem" }}>
            <article>
              {blocks.map((block, index) => renderBlock(block, index))}
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
