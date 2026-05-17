import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Share2,
  User,
} from "lucide-react";

import NewsletterForm from "@/components/forms/NewsletterForm";
import { resolveApiAssetUrl } from "@/lib/api";
import api from "@/lib/api";
import { formatPostDate, getPostAuthorName, getPostImage } from "@/lib/blog";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/motion";
import SEO from "@/components/SEO";

function readingTime(content) {
  if (typeof content === "string") {
    const cleanContent = content.replace(/<[^>]*>/g, " ");
    return Math.max(
      1,
      Math.round(cleanContent.split(/\s+/).filter(Boolean).length / 200),
    );
  }

  if (!Array.isArray(content)) {
    return 1;
  }

  const words = content
    .map((block) => {
      if (
        block.type === "paragraph" ||
        block.type === "heading" ||
        block.type === "conclusion"
      ) {
        return block.text || "";
      }

      if (block.type === "list" || block.type === "tips") {
        return (block.items || [])
          .map((item) =>
            [item.title || "", item.text || "", ...(item.points || [])].join(
              " ",
            ),
          )
          .join(" ");
      }

      if (block.type === "bullets" || block.type === "numbered") {
        return (block.items || []).join(" ");
      }

      if (
        block.type === "subheading" ||
        block.type === "quote" ||
        block.type === "callout"
      ) {
        return block.text || "";
      }

      if (block.type === "image") {
        return block.caption || "";
      }

      return "";
    })
    .join(" ");

  const cleanWords = words.replace(/<[^>]*>/g, " ");
  return Math.max(
    1,
    Math.round(cleanWords.split(/\s+/).filter(Boolean).length / 200),
  );
}

function formatHtml(text) {
  if (!text) return { __html: "" };
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");
  return { __html: html };
}

function Paragraph({ text }) {
  return (
    <p
      style={{
        fontSize: "1rem",
        color: "#111827",
        lineHeight: 1.85,
        marginBottom: "1.25rem",
      }}
      dangerouslySetInnerHTML={formatHtml(text)}
    />
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
      dangerouslySetInnerHTML={formatHtml(text)}
    />
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
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}
        >
          <CheckCircle
            size={16}
            style={{
              color: "var(--color-primary)",
              flexShrink: 0,
              marginTop: "3px",
            }}
          />
          <span
            style={{ fontSize: "0.9375rem", color: "#111827", lineHeight: 1.7 }}
            dangerouslySetInnerHTML={formatHtml(item)}
          />
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
      {items.map((item, index) => (
        <div
          key={`${item.title}-${index}`}
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
              color: "#111827",
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
      {items.map((item, index) => (
        <div
          key={`${item.title}-${index}`}
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
            {index + 1}. {item.title}
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
            {(item.points || []).map((point, pointIndex) => (
              <li
                key={`${point}-${pointIndex}`}
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
                    color: "#111827",
                    lineHeight: 1.65,
                  }}
                >
                  {point}
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
        <span dangerouslySetInnerHTML={formatHtml(text)} />
      </p>
    </div>
  );
}

function renderBlock(block, index) {
  switch (block.type) {
    case "paragraph":
      return <Paragraph key={index} text={block.text} />;
    case "heading":
      return <Heading key={index} text={block.text} />;
    case "subheading":
      return (
        <h3
          key={index}
          style={{
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "#1F2937",
            margin: "1.5rem 0 0.5rem",
          }}
          dangerouslySetInnerHTML={formatHtml(block.text)}
        />
      );
    case "image":
      return block.url ? (
        <figure key={index} style={{ margin: "1.75rem 0" }}>
          <img
            src={resolveApiAssetUrl(block.url)}
            alt={block.alt || ""}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              borderRadius: "0.75rem",
              display: "block",
              border: "1px solid #E5E7EB",
            }}
          />
          {block.caption && (
            <figcaption
              style={{
                textAlign: "center",
                fontSize: "0.8125rem",
                color: "#9CA3AF",
                marginTop: "0.5rem",
                fontStyle: "italic",
              }}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      ) : null;
    case "quote":
      return (
        <blockquote
          key={index}
          style={{
            borderLeft: "4px solid #4F7B44",
            margin: "1.5rem 0",
            padding: "0.875rem 1.25rem",
            fontStyle: "italic",
            color: "#111827",
            background: "#F9FAFB",
            borderRadius: "0 0.625rem 0.625rem 0",
          }}
          dangerouslySetInnerHTML={formatHtml(block.text)}
        />
      );
    case "numbered":
      return (
        <ol
          key={index}
          style={{
            margin: "0.5rem 0 1.25rem",
            paddingLeft: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          {(block.items || []).map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: "0.9375rem",
                color: "#111827",
                lineHeight: 1.7,
              }}
              dangerouslySetInnerHTML={formatHtml(item)}
            />
          ))}
        </ol>
      );
    case "callout": {
      const variants = {
        info: { bg: "#EFF6FF", border: "#BFDBFE", icon: "💡" },
        tip: { bg: "#F0FDF4", border: "#BBF7D0", icon: "✅" },
        warning: { bg: "#FFFBEB", border: "#FDE68A", icon: "⚠️" },
      };
      const v = variants[block.variant || "info"];
      return (
        <div
          key={index}
          style={{
            background: v.bg,
            border: `1px solid ${v.border}`,
            borderRadius: "0.625rem",
            padding: "1rem 1.25rem",
            margin: "1rem 0",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{v.icon}</span>
          <p
            style={{
              margin: 0,
              fontSize: "0.9375rem",
              color: "#111827",
              lineHeight: 1.7,
            }}
            dangerouslySetInnerHTML={formatHtml(block.text)}
          />
        </div>
      );
    }
    case "divider":
      return (
        <hr
          key={index}
          style={{
            border: "none",
            borderTop: "1px solid #E5E7EB",
            margin: "2rem 0",
          }}
        />
      );
    case "list":
      return <CardList key={index} items={block.items || []} />;
    case "tips":
      return <TipsList key={index} items={block.items || []} />;
    case "bullets":
      return <BulletList key={index} items={block.items || []} />;
    case "conclusion":
      return <Conclusion key={index} text={block.text} />;
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
          style={{ color: "#111827", lineHeight: 1.85 }}
        />
      );
    }

    return content.split(/\n{2,}/).map((paragraph, index) => (
      <motion.p
        key={index}
        variants={fadeUp}
        style={{ color: "#111827", lineHeight: 1.85, marginBottom: "1.25rem" }}
      >
        {paragraph}
      </motion.p>
    ));
  }

  if (!Array.isArray(content)) {
    return null;
  }

  return content.map((block, index) => (
    <motion.div key={index} variants={fadeUp}>
      {renderBlock(block, index)}
    </motion.div>
  ));
}

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
        onMouseEnter={(event) => {
          event.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
          <img
            src={getPostImage(article)}
            alt={article.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 500ms ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = "scale(1)";
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
            {formatPostDate(article)}
          </p>
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.45,
              marginBottom: article.tags?.length ? "0.75rem" : 0,
            }}
          >
            {article.title}
          </p>
          {article.tags && article.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "2px 10px",
                    borderRadius: "9999px",
                    background: "#E8F2E6",
                    color: "#3d6235",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchArticle() {
      try {
        const response = await api.get(`/blog/posts/${slug}`);

        if (active) {
          setArticle(response.data.data);
          setRelated(response.data.data.related || []);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Article not found");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    fetchArticle();

    return () => {
      active = false;
    };
  }, [slug]);

  const location = useLocation();
  const minutes = article ? readingTime(article.content) : 0;

  if (loading) {
    return (
      <div className="container-rugan section-padding text-center">
        <h1 className="text-[2rem] font-bold text-[#111827]">
          Loading article...
        </h1>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container-rugan section-padding text-center">
        <h1 className="text-[2rem] font-bold text-[#111827]">
          {error || "Article not found"}
        </h1>
        <Link
          to="/blog"
          className="mt-4 inline-block font-semibold text-[var(--color-primary)]"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={article.title}
        description={
          article.excerpt || `${article.title} - Read more on RUGAN Blog`
        }
        image={getPostImage(article)}
        author={getPostAuthorName(article)}
        path={location.pathname}
        pageType="ArticlePage"
        keywords={article.tags || []}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: article.title, path: location.pathname },
        ]}
        article={{
          authorName: getPostAuthorName(article),
          publishedTime: article.publishedAt || article.createdAt,
          modifiedTime: article.updatedAt || article.publishedAt || article.createdAt,
          section: "Blog",
          keywords: article.tags || [],
        }}
      />
      <section
        style={{ position: "relative", minHeight: "340px", overflow: "hidden" }}
      >
        <img
          src={getPostImage(article)}
          alt={article.title}
          loading="eager"
          decoding="async"
          fetchpriority="high"
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
              onMouseEnter={(event) => {
                event.currentTarget.style.color = "white";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = "rgba(255,255,255,0.78)";
              }}
            >
              <ArrowLeft size={15} /> Back to Blog
            </button>
          </motion.div>

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
              { key: "author", icon: User, text: getPostAuthorName(article) },
              { key: "date", icon: Calendar, text: formatPostDate(article) },
              { key: "time", icon: Clock, text: `${minutes} min read` },
            ]
              .filter(({ text }) => Boolean(text))
              .map(({ key, icon: Icon, text }) => (
                <span
                  key={key}
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

      <section
        style={{
          background: "#FAFAFA",
          paddingTop: "3rem",
          paddingBottom: "4rem",
        }}
      >
        <div className="container-rugan" style={{ maxWidth: "780px" }}>
          {article.tags && article.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.375rem",
                marginBottom: "1.75rem",
              }}
            >
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "2px 10px",
                    borderRadius: "9999px",
                    background: "#E8F2E6",
                    color: "#3d6235",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <motion.article
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerContainer}>
              {renderBody(article.content)}
            </motion.div>
          </motion.article>

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
              onClick={async () => {
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title: article.title,
                      text: article.excerpt,
                      url: window.location.href,
                    });
                    return;
                  }

                  await navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard.");
                } catch (error) {
                  if (error?.name === "AbortError") return;
                  toast.error("Could not share this article right now.");
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
              onMouseEnter={(event) => {
                event.currentTarget.style.color = "var(--color-primary)";
                event.currentTarget.style.borderColor = "var(--color-primary)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = "#6B7280";
                event.currentTarget.style.borderColor = "#E5E7EB";
              }}
            >
              <Share2 size={14} /> Share article
            </button>
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-padding" style={{ background: "white" }}>
          <div className="container-rugan">
            <div style={{ maxWidth: "860px", margin: "0 auto" }}>
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
                className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {related.map((item) => (
                  <motion.div key={item.slug} variants={fadeUp}>
                    <RelatedCard article={item} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

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
