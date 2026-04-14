import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { fadeUp, fadeIn, staggerContainer, viewportOnce } from "@/lib/motion";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { ARTICLES } from "./articleData";

/* ── Reading time estimate ── */
function readingTime(content) {
  const words = content
    .map((b) => {
      if (
        b.type === "paragraph" ||
        b.type === "heading" ||
        b.type === "conclusion"
      )
        return b.text;
      if (b.type === "list" || b.type === "tips")
        return b.items
          .map((i) => (i.text || "") + (i.points?.join(" ") || ""))
          .join(" ");
      if (b.type === "bullets") return b.items.join(" ");
      return "";
    })
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/* ── Content block renderers ── */
function Paragraph({ text }) {
  return (
    <p
      style={{
        fontSize: "1rem",
        color: "#374151",
        lineHeight: 1.85,
        marginBottom: "1.25rem",
      }}
    >
      {text}
    </p>
  );
}

function Heading({ text }) {
  return (
    <h2
      style={{
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "#111827",
        marginTop: "2rem",
        marginBottom: "0.875rem",
        paddingLeft: "0.875rem",
        borderLeft: "3px solid var(--color-primary)",
      }}
    >
      {text}
    </h2>
  );
}

function BulletList({ items }) {
  return (
    <ul
      style={{
        margin: "0.5rem 0 1.25rem 0",
        paddingLeft: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {items.map((item, i) => (
        <li
          key={i}
          style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}
        >
          <CheckCircle2
            size={16}
            style={{
              color: "var(--color-primary)",
              flexShrink: 0,
              marginTop: "3px",
            }}
          />
          <span
            style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7 }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function CardList({ items }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        margin: "0.5rem 0 1.5rem 0",
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: "#F0FDF4",
            border: "1px solid #4F7B4422",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
          }}
        >
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "var(--color-primary)",
              marginBottom: "0.25rem",
            }}
          >
            {item.title}
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#374151",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function TipsList({ items }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        margin: "0.5rem 0 1.5rem 0",
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "0.75rem",
            padding: "1.125rem 1.25rem",
            background: "white",
          }}
        >
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "0.5rem",
            }}
          >
            {i + 1}. {item.title}
          </p>
          <ul
            style={{
              paddingLeft: 0,
              listStyle: "none",
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
            }}
          >
            {item.points.map((pt, j) => (
              <li
                key={j}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    marginTop: "2px",
                  }}
                >
                  •
                </span>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#374151",
                    lineHeight: 1.65,
                  }}
                >
                  {pt}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Conclusion({ text }) {
  return (
    <div
      style={{
        margin: "2rem 0 0",
        padding: "1.5rem",
        background: "var(--color-primary)",
        borderRadius: "1rem",
      }}
    >
      <p
        style={{
          fontSize: "0.9375rem",
          fontWeight: 500,
          color: "white",
          lineHeight: 1.8,
          margin: 0,
        }}
      >
        <strong
          style={{
            display: "block",
            marginBottom: "0.375rem",
            fontSize: "1rem",
          }}
        >
          Conclusion
        </strong>
        {text}
      </p>
    </div>
  );
}

function renderBlock(block, i) {
  switch (block.type) {
    case "paragraph":
      return <Paragraph key={i} text={block.text} />;
    case "heading":
      return <Heading key={i} text={block.text} />;
    case "list":
      return <CardList key={i} items={block.items} />;
    case "tips":
      return <TipsList key={i} items={block.items} />;
    case "bullets":
      return <BulletList key={i} items={block.items} />;
    case "conclusion":
      return <Conclusion key={i} text={block.text} />;
    default:
      return null;
  }
}

function renderBody(content) {
  if (typeof content === "string") {
    const hasHtml = /<\/?[a-z][\s\S]*>/i.test(content);
    if (hasHtml) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ color: "#374151", lineHeight: 1.85 }}
        />
      );
    }

    return content.split(/\n{2,}/).map((paragraph, index) => (
      <motion.p
        key={index}
        variants={fadeUp}
        style={{ color: "#374151", lineHeight: 1.85, marginBottom: "1.25rem" }}
      >
        {paragraph}
      </motion.p>
    ));
  }

  return content.map((block, i) => (
    <motion.div key={i} variants={fadeUp}>
      {renderBlock(block, i)}
    </motion.div>
  ));
}

/* ── Related articles ── */
function RelatedCard({ article }) {
  return (
    <Link to={`/blog/${article.slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: "1rem",
          overflow: "hidden",
          background: "white",
          transition: "box-shadow 200ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
          <img
            src={article.image}
            alt={article.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 500ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        </div>
        <div style={{ padding: "1.125rem" }}>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-primary)",
              fontWeight: 600,
              marginBottom: "0.375rem",
            }}
          >
            {article.date}
          </p>
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.45,
            }}
          >
            {article.title}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ── Page ── */
export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    function fetchArticle() {
      setLoading(true);
      setError(null);

      try {
        const articleData = ARTICLES.find((article) => article.slug === slug);
        if (!articleData) {
          setError("Article not found");
          return;
        }

        setArticle(articleData);
        // Set related articles (all articles except current one)
        setRelated(
          ARTICLES.filter((article) => article.slug !== slug).slice(0, 3),
        );
      } catch (err) {
        setError("Article not found");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  const articleContent = article?.content;
  const minutes = article
    ? readingTime(
        Array.isArray(articleContent)
          ? articleContent
          : [{ type: "paragraph", text: articleContent || "" }],
      )
    : 0;

  if (loading) {
    return (
      <div
        className="container-rugan section-padding"
        style={{ textAlign: "center" }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "1rem",
          }}
        >
          Loading article…
        </h1>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div
        className="container-rugan section-padding"
        style={{ textAlign: "center" }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "1rem",
          }}
        >
          {error || "Article not found"}
        </h1>
        <Link
          to="/blog"
          style={{ color: "var(--color-primary)", fontWeight: 600 }}
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section
        style={{ position: "relative", minHeight: "340px", overflow: "hidden" }}
      >
        <img
          src={article.coverImage || article.image || "/images/blog/hero.jpg"}
          alt={article.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,25,10,0.72)",
          }}
        />
        <motion.div
          className="container-rugan"
          style={{
            position: "relative",
            zIndex: 10,
            paddingTop: "4rem",
            paddingBottom: "2rem",
          }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Back link */}
          <motion.div variants={fadeIn}>
            <button
              onClick={() => navigate("/blog")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                color: "rgba(255,255,255,0.78)",
                fontSize: "0.875rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginBottom: "1.25rem",
                padding: 0,
                transition: "color 200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.78)";
              }}
            >
              <ArrowLeft size={15} /> Back to Blog
            </button>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 700,
              color: "white",
              maxWidth: "52rem",
              lineHeight: 1.25,
              textWrap: "balance",
              marginBottom: "1.25rem",
            }}
          >
            {article.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.25rem",
              alignItems: "center",
            }}
          >
            {[
              { icon: User, text: article.author?.name || article.authorName },
              {
                icon: Calendar,
                text: new Date(
                  article.publishedAt || article.createdAt,
                ).toLocaleDateString(),
              },
              { icon: Clock, text: `${minutes} min read` },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.875rem",
                }}
              >
                <Icon size={14} />
                {text}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Article body */}
      <section
        style={{
          background: "#FAFAFA",
          paddingTop: "3rem",
          paddingBottom: "4rem",
        }}
      >
        <div className="container-rugan" style={{ maxWidth: "780px" }}>
          <motion.article
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Lead excerpt */}
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: "1.125rem",
                color: "#374151",
                lineHeight: 1.8,
                fontWeight: 500,
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              {article.excerpt}
            </motion.p>

            {/* Content blocks */}
            <motion.div variants={staggerContainer}>
              {renderBody(article.content)}
            </motion.div>
          </motion.article>

          {/* Share strip */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "3rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #E5E7EB",
            }}
          >
            <Link
              to="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={15} /> Back to all articles
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#6B7280",
                background: "none",
                border: "1px solid #E5E7EB",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                transition: "color 200ms, border-color 200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-primary)";
                e.currentTarget.style.borderColor = "var(--color-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#6B7280";
                e.currentTarget.style.borderColor = "#E5E7EB";
              }}
            >
              <Share2 size={14} /> Share article
            </button>
          </motion.div>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="section-padding" style={{ background: "white" }}>
          <div className="container-rugan" style={{ maxWidth: "860px" }}>
            <h2
              style={{
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "1.5rem",
              }}
            >
              You may also like
            </h2>
            <motion.div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.25rem",
              }}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {related.map((a) => (
                <motion.div key={a.slug} variants={fadeUp}>
                  <RelatedCard article={a} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="section-padding" style={{ background: "#5B8A8C" }}>
        <div className="container-rugan" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            Stay Updated
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.82)",
              fontSize: "1rem",
              marginBottom: "2rem",
            }}
          >
            Subscribe to our newsletter for the latest stories and updates
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
