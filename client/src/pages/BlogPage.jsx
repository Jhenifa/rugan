import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { Link } from "react-router";
import { User, Calendar, ArrowRight } from "lucide-react";
import PageHeroBanner from "@/components/common/PageHeroBanner";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { ARTICLES } from "./blog/articleData";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Blog Card ── */
function BlogCard({ image, title, excerpt, author, date, to }) {
  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: "1rem",
        overflow: "hidden",
        background: "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "box-shadow 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div style={{ aspectRatio: "16/9", overflow: "hidden", flexShrink: 0 }}>
        <img
          src={image}
          alt={title}
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

      {/* Content */}
      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.45,
            marginBottom: "0.625rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </h3>

        {excerpt && (
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6B7280",
              lineHeight: 1.65,
              marginBottom: "1rem",
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </p>
        )}

        <div style={{ marginTop: "auto" }}>
          {/* Meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              fontSize: "0.8125rem",
              color: "#9CA3AF",
              marginBottom: "1rem",
            }}
          >
            {author && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <User size={13} />
                {author}
              </span>
            )}
            {date && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <Calendar size={13} />
                {date}
              </span>
            )}
          </div>

          {/* Read More */}
          <Link
            to={to}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--color-primary)",
              textDecoration: "none",
              transition: "gap 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.gap = "0.625rem";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.gap = "0.375rem";
            }}
          >
            Read More <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function BlogList() {
  const posts = ARTICLES;

  if (!posts.length) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <p style={{ fontSize: "1rem", color: "#9CA3AF" }}>
          No posts yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 600px))",
        gap: "1.5rem",
        justifyContent: "center",
        alignItems: "stretch",
      }}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {posts.map((post) => (
        <motion.div
          key={post._id}
          variants={fadeUp}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <BlogCard
            image={post.image}
            title={post.title}
            excerpt={post.excerpt}
            author={post.author}
            date={post.date}
            to={`/blog/${post.slug}`}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ── Page ── */
export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <PageHeroBanner
        title="News & Stories"
        subtitle="Updates, insights, and inspiring stories from our work in the field"
        backgroundImage="/images/blog/hero.jpg"
        centerText
        darkOverlay
      />

      {/* Blog Posts Grid */}
      <section className="section-padding">
        <div className="container-rugan">
          <BlogList />
        </div>
      </section>

      {/* Newsletter — teal section */}
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
