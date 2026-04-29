import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import BlogCard from "@/components/common/BlogCard";
import PageHeroBanner from "@/components/common/PageHeroBanner";
import NewsletterForm from "@/components/forms/NewsletterForm";
import api from "@/lib/api";
import { formatPostDate, getPostAuthorName, getPostImage } from "@/lib/blog";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

function EmptyState() {
  return (
    <div
      className="rounded-2xl border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-6 py-14 text-center"
      style={{ borderRadius: "1rem" }}
    >
      <h2 className="text-xl font-bold text-[#101828]">No posts yet</h2>
      <p className="mt-3 text-sm text-[#667085]">
        New stories and updates will appear here once they are published.
      </p>
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        const response = await api.get("/blog/posts", {
          params: { limit: 12 },
        });

        if (active) {
          setPosts(response.data.data || []);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Could not load blog posts.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeroBanner
        title="News & Stories"
        subtitle="Updates, insights, and inspiring stories from our work in the field"
        backgroundImage="/images/blog/hero.jpg"
        centerText
        darkOverlay
      />

      <section className="section-padding">
        <div className="container-rugan">
          {loading ? (
            <div className="py-10 text-center">
              <p className="text-base text-[#667085]">Loading stories...</p>
            </div>
          ) : error ? (
            <div
              className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-5 text-center"
              style={{ borderRadius: "1rem" }}
            >
              <p className="text-sm font-medium text-[#991B1B]">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              className="mx-auto grid max-w-[1220px] grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {posts.map((post) => (
                <motion.div
                  key={post._id || post.slug}
                  variants={fadeUp}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <BlogCard
                    image={getPostImage(post)}
                    title={post.title}
                    excerpt={post.excerpt}
                    author={getPostAuthorName(post)}
                    date={formatPostDate(post)}
                    to={`/blog/${post.slug}`}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

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
