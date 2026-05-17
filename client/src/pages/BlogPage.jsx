import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams } from "react-router";
import { motion } from "framer-motion";

import BlogCard from "@/components/common/BlogCard";
import PageHeroBanner from "@/components/common/PageHeroBanner";
import NewsletterForm from "@/components/forms/NewsletterForm";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import { getCachedBlogPosts } from "@/lib/blogCache";
import { formatPostDate, getPostAuthorName, getPostImage } from "@/lib/blog";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const BLOG_PAGE_LIMIT = 12;

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

function LoadingCard() {
  return (
    <div
      className="overflow-hidden border border-[#E5E7EB] bg-white"
      style={{ borderRadius: "1rem" }}
    >
      <div
        className="animate-pulse bg-[linear-gradient(135deg,#E8F2E6_0%,#DDEDD9_100%)]"
        style={{ aspectRatio: "16 / 9" }}
      />
      <div className="space-y-4 p-6">
        <div className="h-3 w-24 animate-pulse rounded-full bg-[#E5E7EB]" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded-full bg-[#E5E7EB]" />
          <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#E5E7EB]" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded-full bg-[#F2F4F7]" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-[#F2F4F7]" />
          <div className="h-3 w-3/4 animate-pulse rounded-full bg-[#F2F4F7]" />
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-3 w-24 animate-pulse rounded-full bg-[#F2F4F7]" />
          <div className="h-3 w-28 animate-pulse rounded-full bg-[#F2F4F7]" />
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto grid max-w-[1220px] grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
}

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("query")?.trim() || "";
  const requestedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const isSearchMode = searchQuery.length > 0;

  const initialCachedPosts = useRef(
    !isSearchMode && currentPage === 1 ? getCachedBlogPosts(BLOG_PAGE_LIMIT) : [],
  ).current;

  const [posts, setPosts] = useState(initialCachedPosts);
  const [loading, setLoading] = useState(initialCachedPosts.length === 0);
  const [error, setError] = useState("");
  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const [pagination, setPagination] = useState({
    page: currentPage,
    pages: 1,
    total: initialCachedPosts.length,
  });

  useEffect(() => {
    setDraftQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      const freshCache = !isSearchMode && currentPage === 1 ? getCachedBlogPosts(BLOG_PAGE_LIMIT) : [];
      const hasFreshCache = freshCache.length > 0;

      if (hasFreshCache) {
        setPosts(freshCache);
      }

      setLoading(!hasFreshCache || isSearchMode || currentPage > 1);

      try {
        const response = await api.get("/blog/posts", {
          params: isSearchMode
            ? {
                limit: 100,
                includePagination: false,
              }
            : {
                page: currentPage,
                limit: BLOG_PAGE_LIMIT,
                includePagination: true,
              },
        });

        const remotePosts = response.data?.data || [];
        const filteredPosts = isSearchMode
          ? remotePosts.filter((post) => {
              const haystack = [
                post.title,
                post.excerpt,
                ...(Array.isArray(post.tags) ? post.tags : []),
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

              return haystack.includes(searchQuery.toLowerCase());
            })
          : remotePosts;

        if (active) {
          setPosts(filteredPosts);
          setPagination(
            isSearchMode
              ? {
                  page: 1,
                  pages: 1,
                  total: filteredPosts.length,
                }
              : response.data?.pagination || {
                  page: currentPage,
                  pages: 1,
                  total: filteredPosts.length,
                },
          );
          setError("");
        }
      } catch (err) {
        if (active && !hasFreshCache) {
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
  }, [currentPage, initialCachedPosts.length, isSearchMode, searchQuery]);

  const canonicalPath = isSearchMode
    ? `/blog?query=${encodeURIComponent(searchQuery)}`
    : currentPage > 1
      ? `/blog?page=${currentPage}`
      : "/blog";

  function updateSearch(nextValues) {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(nextValues).forEach(([key, value]) => {
      if (!value) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    if (nextValues.query !== undefined) {
      nextParams.delete("page");
    }

    setSearchParams(nextParams, { replace: false });
  }

  return (
    <>
      <SEO
        title={isSearchMode ? `Blog Search: ${searchQuery}` : "Blog"}
        description={
          isSearchMode
            ? `Search RUGAN blog articles for ${searchQuery}.`
            : "Updates, insights, and inspiring stories from our work in the field."
        }
        path={canonicalPath}
        noindex={isSearchMode}
        pageType={isSearchMode ? "SearchResultsPage" : "CollectionPage"}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

      <PageHeroBanner
        title="News & Stories"
        subtitle="Updates, insights, and inspiring stories from our work in the field"
        backgroundImage="/images/blog/hero.jpg"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
        centerText
        darkOverlay
      />

      <section className="section-padding !pt-8 sm:!pt-10">
        <div className="container-rugan">
          <form
            role="search"
            aria-label="Search blog articles"
            className="mx-auto mb-8 flex max-w-3xl flex-row items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-2 sm:gap-3 sm:p-4"
            onSubmit={(event) => {
              event.preventDefault();
              updateSearch({ query: draftQuery.trim() || null });
            }}
          >
            <label htmlFor="blog-search" className="sr-only">
              Search blog articles
            </label>
            <div className="relative flex-1 min-w-0">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3] sm:left-4"
              />
              <input
                id="blog-search"
                type="search"
                name="query"
                value={draftQuery}
                onChange={(event) => setDraftQuery(event.target.value)}
                placeholder="Search by topic, keyword..."
                className="h-11 sm:h-12 w-full min-w-0 rounded-xl border border-[#D0D5DD] pl-9 pr-3 sm:pl-11 sm:pr-4 text-sm text-[#111827] outline-none transition-colors focus:border-[#4F7B44]"
              />
            </div>
            <div className="flex shrink-0 gap-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex h-11 sm:h-12 shrink-0 items-center justify-center rounded-xl bg-[#4F7B44] px-4 sm:px-5 text-sm font-semibold text-white transition-colors hover:bg-[#41673a]"
              >
                Search
              </button>
              {isSearchMode ? (
                <button
                  type="button"
                  className="inline-flex h-11 sm:h-12 shrink-0 items-center justify-center rounded-xl border border-[#D0D5DD] px-3 sm:px-4 text-sm font-semibold text-[#475467]"
                  onClick={() => {
                    setDraftQuery("");
                    updateSearch({ query: null });
                  }}
                >
                  <X size={16} className="sm:mr-2" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              ) : null}
            </div>
          </form>

          {isSearchMode ? (
            <p className="mx-auto mb-6 max-w-3xl text-sm text-[#475467]">
              Showing {posts.length} result{posts.length === 1 ? "" : "s"} for{" "}
              <strong>{searchQuery}</strong>.
            </p>
          ) : null}

          {loading ? (
            <LoadingState />
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
            <>
              <motion.div
                key={isSearchMode ? `search-${draftQuery}` : `page-${currentPage}`}
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
                      tags={post.tags}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {!isSearchMode && pagination.pages > 1 ? (
                <nav
                  aria-label="Blog pagination"
                  className="mx-auto mt-10 flex max-w-[1220px] items-center justify-center gap-3"
                >
                  <button
                    type="button"
                    className="rounded-xl border border-[#D0D5DD] px-4 py-3 text-sm font-semibold text-[#344054] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={pagination.page <= 1}
                    onClick={() => updateSearch({ page: String(pagination.page - 1) })}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-[#475467]">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    type="button"
                    className="rounded-xl border border-[#D0D5DD] px-4 py-3 text-sm font-semibold text-[#344054] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => updateSearch({ page: String(pagination.page + 1) })}
                  >
                    Next
                  </button>
                </nav>
              ) : null}
            </>
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
