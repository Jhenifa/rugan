import { useDeferredValue, useEffect, useState } from "react";
import {
  Eye,
  FilePlus2,
  RefreshCw,
  Save,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { formatPostDate } from "@/lib/blog";
import { cn } from "@/lib/cn";

const EMPTY_EDITOR = {
  title: "",
  excerpt: "",
  coverImage: "",
  tags: "",
  content: "",
  status: "draft",
  slug: "",
  publishedAt: "",
  newsletterSentAt: "",
};

function toEditorState(post) {
  return {
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    coverImage: post?.coverImage || "",
    tags: Array.isArray(post?.tags) ? post.tags.join(", ") : "",
    content:
      typeof post?.content === "string"
        ? post.content
        : JSON.stringify(post?.content || "", null, 2),
    status: post?.status || "draft",
    slug: post?.slug || "",
    publishedAt: post?.publishedAt || "",
    newsletterSentAt: post?.newsletterSentAt || "",
  };
}

function StatusPill({ status }) {
  const styles =
    status === "published"
      ? "bg-[#ECFDF3] text-[#027A48]"
      : "bg-[#F2F4F7] text-[#475467]";

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", styles)}>
      {status}
    </span>
  );
}

function normalizeContentInput(value) {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
}

export default function AdminPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [editor, setEditor] = useState(EMPTY_EDITOR);
  const [editorLoading, setEditorLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        setLoading(true);

        const response = await api.get("/blog/admin/posts", {
          params: {
            status: statusFilter,
            search: deferredSearch,
            limit: 50,
          },
        });

        if (active) {
          setPosts(response.data.data || []);
        }
      } catch (error) {
        if (active) {
          toast.error(error.response?.data?.message || "Could not load posts.");
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
  }, [statusFilter, deferredSearch]);

  async function refreshPosts() {
    setLoading(true);

    try {
      const response = await api.get("/blog/admin/posts", {
        params: {
          status: statusFilter,
          search: deferredSearch,
          limit: 50,
        },
      });

      setPosts(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not refresh posts.");
    } finally {
      setLoading(false);
    }
  }

  async function selectPost(id) {
    setSelectedId(id);
    setEditorLoading(true);

    try {
      const response = await api.get(`/blog/admin/posts/${id}`);
      setEditor(toEditorState(response.data.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load the post.");
    } finally {
      setEditorLoading(false);
    }
  }

  function startNewPost() {
    setSelectedId("");
    setEditor(EMPTY_EDITOR);
    setEditorLoading(false);
  }

  function updateEditor(field, value) {
    setEditor((current) => ({ ...current, [field]: value }));
  }

  async function submitEditor(forcedStatus = null) {
    setSaving(true);

    try {
      const payload = {
        title: editor.title,
        excerpt: editor.excerpt,
        coverImage: editor.coverImage,
        tags: editor.tags,
        content: normalizeContentInput(editor.content),
        status: forcedStatus || editor.status,
      };

      const response = selectedId
        ? await api.put(`/blog/posts/${selectedId}`, payload)
        : await api.post("/blog/posts", payload);

      const savedPost = response.data.data;
      const newsletter = response.data.meta?.newsletter;

      setSelectedId(savedPost._id);
      setEditor(toEditorState(savedPost));
      await refreshPosts();

      if (newsletter?.reason === "email-not-configured") {
        toast.error("Post published, but newsletter email is not configured.");
      } else if (newsletter?.reason === "sent") {
        toast.success(`Post published. Newsletter sent to ${newsletter.sent} subscriber(s).`);
      } else if (newsletter?.reason === "no-active-subscribers") {
        toast.success("Post published. There were no active subscribers to notify.");
      } else {
        toast.success(selectedId ? "Post updated." : "Post created.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save the post.");
    } finally {
      setSaving(false);
    }
  }

  async function deletePost() {
    if (!selectedId) return;

    const confirmed = window.confirm("Delete this post permanently?");
    if (!confirmed) return;

    setDeleting(true);

    try {
      await api.delete(`/blog/posts/${selectedId}`);
      toast.success("Post deleted.");
      startNewPost();
      await refreshPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete the post.");
    } finally {
      setDeleting(false);
    }
  }

  const selectedPostLink = editor.slug ? `/blog/${editor.slug}` : "";

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#101828]">Posts</h2>
              <p className="text-sm text-[#667085]">
                Drafts, scheduled content, and published articles.
              </p>
            </div>

            <button
              type="button"
              onClick={startNewPost}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D0D5DD] text-[#344054] transition-colors hover:border-[#4F7B44] hover:text-[#4F7B44]"
              aria-label="Create post"
            >
              <FilePlus2 size={18} />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
              />
              <input
                className="form-input pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search posts"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                className="form-input"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="draft">Drafts</option>
                <option value="published">Published</option>
              </select>

              <button
                type="button"
                onClick={refreshPosts}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#D0D5DD] text-[#344054] transition-colors hover:border-[#4F7B44] hover:text-[#4F7B44]"
                aria-label="Refresh posts"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[720px] overflow-y-auto">
          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-[#667085]">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[#667085]">
              No posts match this view.
            </div>
          ) : (
            posts.map((post) => {
              const active = post._id === selectedId;

              return (
                <button
                  key={post._id}
                  type="button"
                  onClick={() => selectPost(post._id)}
                  className={cn(
                    "block w-full border-b border-[#F2F4F7] px-5 py-4 text-left transition-colors",
                    active ? "bg-[#F8FBF8]" : "hover:bg-[#F9FAFB]",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-[#101828]">
                        {post.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#667085]">
                        {post.excerpt}
                      </p>
                    </div>
                    <StatusPill status={post.status} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#667085]">
                    <span>{formatPostDate(post) || "Unpublished"}</span>
                    <span>•</span>
                    <span>{post.views || 0} views</span>
                    {post.newsletterSentAt && (
                      <>
                        <span>•</span>
                        <span>Newsletter sent</span>
                      </>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#101828]">
                {selectedId ? "Edit post" : "New post"}
              </h2>
              <p className="text-sm text-[#667085]">
                Publishing a post will notify active newsletter subscribers once.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {selectedPostLink && (
                <a
                  href={selectedPostLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#D0D5DD] px-3 py-2 text-sm font-medium text-[#344054] transition-colors hover:border-[#4F7B44] hover:text-[#4F7B44]"
                >
                  <Eye size={16} />
                  View
                </a>
              )}

              <Button
                type="button"
                variant="outline-green"
                disabled={saving || editorLoading}
                onClick={() => submitEditor("draft")}
              >
                <Save size={16} />
                Save draft
              </Button>

              <Button
                type="button"
                variant="green"
                disabled={saving || editorLoading}
                onClick={() => submitEditor("published")}
              >
                <Send size={16} />
                Publish
              </Button>

              {user?.role === "admin" && selectedId && (
                <button
                  type="button"
                  disabled={deleting}
                  onClick={deletePost}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#FECACA] px-3 py-2 text-sm font-medium text-[#B42318] transition-colors hover:bg-[#FEF3F2]"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {editorLoading ? (
          <div className="px-5 py-12 text-center text-sm text-[#667085]">
            Loading post...
          </div>
        ) : (
          <form
            className="grid gap-6 px-5 py-5"
            onSubmit={(event) => {
              event.preventDefault();
              submitEditor();
            }}
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div>
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  value={editor.title}
                  onChange={(event) => updateEditor("title", event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={editor.status}
                  onChange={(event) => updateEditor("status", event.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Excerpt</label>
              <textarea
                rows={3}
                className="form-input resize-none"
                value={editor.excerpt}
                onChange={(event) => updateEditor("excerpt", event.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div>
                <label className="form-label">Cover image URL</label>
                <input
                  className="form-input"
                  value={editor.coverImage}
                  onChange={(event) => updateEditor("coverImage", event.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="form-label">Tags</label>
                <input
                  className="form-input"
                  value={editor.tags}
                  onChange={(event) => updateEditor("tags", event.target.value)}
                  placeholder="education, health, impact"
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Slug
                </p>
                <p className="mt-2 break-all text-sm font-medium text-[#101828]">
                  {editor.slug || "Generated on first save"}
                </p>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Publish state
                </p>
                <p className="mt-2 text-sm font-medium text-[#101828]">
                  {editor.publishedAt ? formatPostDate(editor.publishedAt) : "Not published yet"}
                </p>
                <p className="mt-1 text-xs text-[#667085]">
                  {editor.newsletterSentAt
                    ? `Newsletter sent on ${formatPostDate(editor.newsletterSentAt)}`
                    : "Newsletter has not been sent for this article."}
                </p>
              </div>
            </div>

            <div>
              <label className="form-label">Content</label>
              <textarea
                rows={18}
                className="form-input min-h-[420px] resize-y"
                value={editor.content}
                onChange={(event) => updateEditor("content", event.target.value)}
                required
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-[#E5E7EB] pt-5">
              <Button
                type="button"
                variant="outline-green"
                disabled={saving}
                onClick={startNewPost}
              >
                New post
              </Button>
              <Button type="submit" variant="green" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
