import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  FilePlus2,
  ImageIcon,
  RefreshCw,
  Save,
  Search,
  Send,
  Tag,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import ArticlePreview from "@/components/cms/ArticlePreview";
import RichEditor, { parseContentToBlocks } from "@/components/cms/RichEditor";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import api, { resolveApiAssetUrl } from "@/lib/api";
import { formatPostDate } from "@/lib/blog";
import { cn } from "@/lib/cn";

const EMPTY_FORM = { title: "", excerpt: "", coverImage: "", tags: "", status: "draft" };

function normalizeEditorBlocks(blocks) {
  if (!Array.isArray(blocks)) return [];

  return blocks.map((block) =>
    block?.type === "image" ? { ...block, url: resolveApiAssetUrl(block.url) } : block,
  );
}

function StatusPill({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "published" ? "bg-[#ECFDF3] text-[#027A48]" : "bg-[#F2F4F7] text-[#475467]",
      )}
    >
      {status === "published" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
      {status}
    </span>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {hint && <p style={{ fontSize: "0.775rem", color: "#9CA3AF", margin: "-4px 0 6px" }}>{hint}</p>}
      {children}
    </div>
  );
}

function CoverImageField({ value, onChange }) {
  const [expanded, setExpanded] = useState(Boolean(value));
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = resolveApiAssetUrl(response.data?.url || response.data?.data?.url);
      onChange(url);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: "0.75rem", overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0.75rem 1rem",
          background: "#F9FAFB",
          border: "none",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#374151",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ImageIcon size={15} style={{ color: "#4F7B44" }} />
          <span>
            Cover Image{" "}
            {value && <span style={{ color: "#4F7B44", fontSize: "0.75rem" }}>set</span>}
          </span>
        </span>
        <ChevronDown
          size={15}
          style={{
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 200ms",
          }}
        />
      </button>

      {expanded && (
        <div style={{ padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <input
              className="form-input"
              style={{ flex: "1 1 220px", minWidth: 0 }}
              value={value || ""}
              placeholder="Paste image URL (https://...)"
              onChange={(event) => onChange(event.target.value)}
            />
            <span style={{ fontSize: "0.75rem", color: "#9CA3AF", flexShrink: 0 }}>or</span>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              style={{
                padding: "10px 12px",
                border: "1px solid #D0D5DD",
                borderRadius: "0.5rem",
                background: "white",
                cursor: uploading ? "not-allowed" : "pointer",
                fontSize: "0.8rem",
                color: "#344054",
                flex: "1 1 140px",
                whiteSpace: "nowrap",
              }}
            >
              {uploading ? "Uploading..." : "Upload image"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={handleFile}
            />
          </div>

          {value && (
            <div
              style={{
                borderRadius: "0.5rem",
                overflow: "hidden",
                maxHeight: 200,
                border: "1px solid #E5E7EB",
              }}
            >
              <img
                loading="lazy"
                src={resolveApiAssetUrl(value)}
                alt="cover preview"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }}
                onError={(event) => {
                  event.target.style.display = "none";
                }}
                onLoad={(event) => {
                  event.target.style.display = "block";
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TagsField({ value, onChange }) {
  const tags = value ? value.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
  const [input, setInput] = useState("");

  function addTag() {
    const tag = input.trim().toLowerCase();
    if (tag && !tags.includes(tag)) onChange([...tags, tag].join(", "));
    setInput("");
  }

  function removeTag(tag) {
    onChange(tags.filter((current) => current !== tag).join(", "));
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.375rem",
          marginBottom: "0.5rem",
          minHeight: 28,
        }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "2px 10px",
              borderRadius: "9999px",
              background: "#E8F2E6",
              color: "#3d6235",
              fontSize: "0.8rem",
              fontWeight: 500,
            }}
          >
            <Tag size={10} /> {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6B7280",
                padding: "0 0 0 2px",
                lineHeight: 1,
              }}
            >
              x
            </button>
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <input
          className="form-input"
          style={{ flex: "1 1 220px", minWidth: 0 }}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          placeholder="Type a tag and press Enter"
        />
        <button
          type="button"
          onClick={addTag}
          style={{
            minWidth: 96,
            padding: "0 0.875rem",
            border: "1px solid #E5E7EB",
            borderRadius: "0.5rem",
            background: "#F9FAFB",
            fontSize: "0.875rem",
            cursor: "pointer",
            minHeight: 44,
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function SecondaryActionButton({ children, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-medium text-[#344054]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default function AdminPostsPage() {
  const { user } = useAuth();
  const isStackedLayout = useMediaQuery("(max-width: 1023px)");
  const isCompactMobile = useMediaQuery("(max-width: 639px)");
  const editorCardRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Manual debounce for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [blocks, setBlocks] = useState([]);
  const [editorLoading, setEditorLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);

  const formRef = useRef(EMPTY_FORM);
  const blocksRef = useRef([]);
  const selectedIdRef = useRef("");
  const autoSaveTimer = useRef(null);
  const isDirty = useRef(false);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    if (!isStackedLayout) {
      setMobileListOpen(true);
    } else {
      setMobileListOpen(false);
    }
  }, [isStackedLayout]);

  const scrollEditorIntoView = useCallback(() => {
    window.requestAnimationFrame(() => {
      editorCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const loadPosts = useCallback(async () => {
    setListLoading(true);
    try {
      const response = await api.get("/blog/admin/posts", {
        params: { status: statusFilter, search: debouncedSearch, limit: 50 },
      });
      setPosts(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load posts.");
    } finally {
      setListLoading(false);
    }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function selectPost(id) {
    clearTimeout(autoSaveTimer.current);
    setSelectedId(id);
    setEditorLoading(true);
    isDirty.current = false;

    if (isStackedLayout) {
      setMobileListOpen(false);
      scrollEditorIntoView();
    }

    try {
      const response = await api.get(`/blog/admin/posts/${id}`);
      const post = response.data.data;
      const nextForm = {
        title: post.title || "",
        excerpt: post.excerpt || "",
        coverImage: resolveApiAssetUrl(post.coverImage),
        tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
        status: post.status || "draft",
      };
      const nextBlocks = normalizeEditorBlocks(parseContentToBlocks(post.content));
      setForm(nextForm);
      setBlocks(nextBlocks);
      formRef.current = nextForm;
      blocksRef.current = nextBlocks;
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load post.");
    } finally {
      setEditorLoading(false);
    }
  }

  function startNew() {
    clearTimeout(autoSaveTimer.current);
    setSelectedId("");
    selectedIdRef.current = "";
    setForm(EMPTY_FORM);
    setBlocks([]);
    formRef.current = EMPTY_FORM;
    blocksRef.current = [];
    isDirty.current = false;

    if (isStackedLayout) {
      setMobileListOpen(false);
      scrollEditorIntoView();
    }
  }

  function setField(key, value) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      formRef.current = next;
      return next;
    });
    isDirty.current = true;
  }

  function handleBlocksChange(nextBlocks) {
    setBlocks(nextBlocks);
    blocksRef.current = nextBlocks;
    isDirty.current = true;
  }

  async function corePerformSave(forcedStatus, silent = false) {
    const currentForm = formRef.current;
    const currentBlocks = blocksRef.current;
    const status = forcedStatus || currentForm.status;

    if (!currentForm.title.trim()) {
      if (!silent) toast.error("Title is required.");
      throw new Error("validation");
    }

    if (!currentForm.excerpt.trim()) {
      if (!silent) toast.error("Excerpt is required.");
      throw new Error("validation");
    }

    const payload = {
      title: currentForm.title.trim(),
      excerpt: currentForm.excerpt.trim(),
      coverImage: resolveApiAssetUrl((currentForm.coverImage || "").trim()),
      tags: currentForm.tags,
      content: normalizeEditorBlocks(currentBlocks),
      status,
    };

    const id = selectedIdRef.current;
    const response = id
      ? await api.put(`/blog/posts/${id}`, payload)
      : await api.post("/blog/posts", payload);

    const saved = response.data.data;
    const newsletter = response.data.meta?.newsletter;

    const savedForm = {
      title: saved.title || "",
      excerpt: saved.excerpt || "",
      coverImage: saved.coverImage || "",
      tags: Array.isArray(saved.tags) ? saved.tags.join(", ") : "",
      status: saved.status || "draft",
    };
    const savedBlocks = normalizeEditorBlocks(parseContentToBlocks(saved.content));

    setSelectedId(saved._id);
    setForm(savedForm);
    setBlocks(savedBlocks);
    selectedIdRef.current = saved._id;
    formRef.current = savedForm;
    blocksRef.current = savedBlocks;
    isDirty.current = false;

    loadPosts();

    return { saved, newsletter };
  }

  async function handleSaveDraft() {
    clearTimeout(autoSaveTimer.current);
    setSaving(true);
    try {
      await corePerformSave("draft", false);
      toast.success("Draft saved.");
    } catch (error) {
      if (error.message !== "validation") {
        toast.error(error.response?.data?.message || "Could not save draft.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    clearTimeout(autoSaveTimer.current);
    setSaving(true);
    try {
      const { newsletter } = await corePerformSave("published", false);

      if (newsletter?.reason === "sent") {
        toast.success(`Published. Newsletter sent to ${newsletter.sent} subscriber(s).`);
      } else if (newsletter?.reason === "no-active-subscribers") {
        toast.success("Published. No active subscribers to notify.");
      } else if (newsletter?.reason === "email-not-configured") {
        toast.success("Published. Email not configured.");
      } else {
        toast.success("Post published.");
      }
    } catch (error) {
      if (error.message !== "validation") {
        toast.error(error.response?.data?.message || "Could not publish.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!selectedId) return;
    setShowDeleteConfirm(true);
  }

  async function confirmDelete() {
    if (!selectedId) return;

    setDeleting(true);
    try {
      await api.delete(`/blog/posts/${selectedId}`);
      toast.success("Post deleted.");
      setShowDeleteConfirm(false);
      startNew();
      await loadPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete.");
    } finally {
      setDeleting(false);
    }
  }

  const currentPost = posts.find((post) => post._id === selectedId);
  const viewLink = currentPost?.slug ? `/blog/${currentPost.slug}` : "";

  // Client-side filtering for instant feedback
  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    const term = search.toLowerCase();
    const wordBoundary = new RegExp(`\\b${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
    
    return posts.filter(post => {
      const tagsStr = Array.isArray(post.tags) ? post.tags.join(" ") : (post.tags || "");
      return post.title?.toLowerCase().includes(term) ||
             post.excerpt?.toLowerCase().includes(term) ||
             tagsStr.toLowerCase().includes(term);
    }).sort((a, b) => {
      // Prioritize titles where match is at a word boundary
      const aWordMatch = wordBoundary.test(a.title || "") ? 0 : 1;
      const bWordMatch = wordBoundary.test(b.title || "") ? 0 : 1;
      return aWordMatch - bWordMatch;
    });
  }, [posts, search]);
  const postListExpanded = !isStackedLayout || mobileListOpen;
  const mobileToolbarGridClass = isCompactMobile ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2 sm:flex-row sm:flex-wrap";
  const mobileStatusSelectStyle = isCompactMobile
    ? { width: "100%", padding: "6px 10px", fontSize: "0.8rem" }
    : { width: "100%", maxWidth: 140, padding: "6px 10px", fontSize: "0.8rem" };

  return (
    <>
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete this post?"
        description="This permanently removes the article, its content, and its current slug."
        confirmLabel="Delete post"
        cancelLabel="Keep post"
        busy={deleting}
        onCancel={() => {
          if (!deleting) setShowDeleteConfirm(false);
        }}
        onConfirm={confirmDelete}
      />

      {showPreview && <ArticlePreview form={form} blocks={blocks} onClose={() => setShowPreview(false)} />}

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <aside
          className={cn(
            "overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white",
            !isStackedLayout && "lg:sticky lg:top-6",
          )}
        >
          <div className="border-b border-[#E5E7EB] px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-base font-bold text-[#101828]">Posts</h2>
                <p className="m-0 text-xs text-[#667085]">{posts.length} total</p>
              </div>

              <div className={isCompactMobile ? "grid grid-cols-[minmax(0,1fr)_40px] gap-2" : "flex items-center gap-2"}>
                {isStackedLayout && (
                  <SecondaryActionButton
                    onClick={() => setMobileListOpen((current) => !current)}
                    className={cn("min-h-10 text-xs", isCompactMobile ? "w-full px-3" : "px-3")}
                  >
                    {postListExpanded ? "Hide posts" : "Posts"}
                    <ChevronDown
                      size={14}
                      style={{
                        transform: postListExpanded ? "rotate(180deg)" : "none",
                        transition: "transform 150ms ease",
                      }}
                    />
                  </SecondaryActionButton>
                )}

                <SecondaryActionButton
                  onClick={startNew}
                  title="New post"
                  aria-label="Create new post"
                  className="min-h-10 w-10 px-0"
                >
                  <FilePlus2 size={15} />
                </SecondaryActionButton>
              </div>
            </div>

            <div
              className={cn(
                "mt-4 space-y-3 transition-all duration-200",
                postListExpanded ? "opacity-100" : "pointer-events-none h-0 overflow-hidden opacity-0",
              )}
            >
              <div className="relative">
                <Search
                  size={13}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
                />
                <input
                  className="form-input"
                  style={{ paddingLeft: 30, fontSize: "0.875rem" }}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search posts..."
                />
              </div>

              <div className={isCompactMobile ? "grid grid-cols-[minmax(0,1fr)_44px] gap-2" : "flex flex-col gap-3 sm:flex-row sm:items-center"}>
                <select
                  className="form-input flex-1"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  style={{ fontSize: "0.875rem" }}
                >
                  <option value="all">All</option>
                  <option value="draft">Drafts</option>
                  <option value="published">Published</option>
                </select>

                <SecondaryActionButton
                  onClick={loadPosts}
                  aria-label="Refresh posts"
                  title="Refresh posts"
                  className={isCompactMobile ? "min-h-11 w-11 shrink-0 px-0" : "min-h-11 shrink-0"}
                >
                  <RefreshCw size={14} />
                </SecondaryActionButton>
              </div>
            </div>
          </div>

          {postListExpanded && (
            <div style={{ maxHeight: isStackedLayout ? "50vh" : "calc(100vh - 220px)", overflowY: "auto" }}>
              {listLoading && posts.length === 0 ? (
                <p style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>
                  Loading...
                </p>
              ) : filteredPosts.length === 0 ? (
                <p style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>
                  No posts found.
                </p>
              ) : (
                filteredPosts.map((post) => {
                  const active = post._id === selectedId;

                  return (
                    <button
                      key={post._id}
                      type="button"
                      onClick={() => selectPost(post._id)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "0.875rem 1rem",
                        background: active ? "#F8FBF8" : "transparent",
                        border: "none",
                        borderLeft: `3px solid ${active ? "#4F7B44" : "transparent"}`,
                        borderBottom: "1px solid #F2F4F7",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.625rem" }}>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "#101828",
                            margin: 0,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            flex: "1 1 220px",
                          }}
                        >
                          {post.title}
                        </p>
                        <StatusPill status={post.status} />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                          marginTop: "0.35rem",
                          fontSize: "0.75rem",
                          color: "#9CA3AF",
                        }}
                      >
                        <span>{formatPostDate(post) || "Unpublished"}</span>
                        <span style={{ color: "#D0D5DD" }}>|</span>
                        <span>{post.views || 0} views</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </aside>

        <div ref={editorCardRef} className="overflow-visible rounded-2xl border border-[#E5E7EB] bg-white">
          <div className="border-b border-[#E5E7EB] px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="m-0 text-base font-bold text-[#101828]">
                  {selectedId ? "Edit post" : "New post"}
                </h2>
                <p className="m-0 text-xs text-[#667085]">
                  Publishing notifies all active newsletter subscribers.
                </p>
              </div>

              <div className={cn(mobileToolbarGridClass, "lg:justify-end")}>
                {isStackedLayout && (
                  <SecondaryActionButton
                    onClick={() => setMobileListOpen((current) => !current)}
                    className={cn(isCompactMobile ? "w-full" : "w-full sm:w-auto")}
                  >
                    {postListExpanded ? "Hide posts" : "Posts"}
                  </SecondaryActionButton>
                )}

                <SecondaryActionButton
                  onClick={() => setShowPreview(true)}
                  aria-label="Preview article"
                  className={cn(isCompactMobile ? "w-full" : "w-full sm:w-auto")}
                >
                  <Eye size={14} /> Preview
                </SecondaryActionButton>

                {viewLink && currentPost?.status === "published" && (
                  <a
                    href={viewLink}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-medium text-[#344054]",
                      isCompactMobile ? "w-full" : "w-full sm:w-auto",
                    )}
                  >
                    <Eye size={14} /> Live
                  </a>
                )}

                <Button
                  type="button"
                  variant="outline-green"
                  disabled={saving || editorLoading}
                  onClick={handleSaveDraft}
                  className={cn(isCompactMobile ? "w-full" : "w-full sm:w-auto")}
                >
                  <Save size={14} /> {isCompactMobile ? "Draft" : "Save draft"}
                </Button>

                <Button
                  type="button"
                  variant="green"
                  disabled={saving || editorLoading}
                  onClick={handlePublish}
                  className={cn(isCompactMobile ? "w-full" : "w-full sm:w-auto")}
                >
                  <Send size={14} /> {currentPost?.status === "published" ? "Update" : "Publish"}
                </Button>

                {user?.role === "admin" && selectedId && (
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDelete}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[#FECACA] bg-white px-3 py-2 text-sm font-medium text-[#B42318]",
                      isCompactMobile ? "col-span-2 w-full" : "w-full sm:w-auto",
                    )}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>

          {editorLoading ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#9CA3AF" }}>Loading post...</div>
          ) : (
            <div className="flex flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6">
              {selectedId && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl bg-[#F9FAFB] px-4 py-3">
                  <select
                    className="form-input"
                    style={mobileStatusSelectStyle}
                    value={form.status}
                    onChange={(event) => setField("status", event.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>

                  {currentPost?.publishedAt && (
                    <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>{formatPostDate(currentPost)}</span>
                  )}

                  {currentPost?.newsletterSentAt && (
                    <span style={{ fontSize: "0.8rem", color: "#4F7B44" }}>Newsletter sent</span>
                  )}

                  {currentPost?.slug && (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#9CA3AF",
                        marginLeft: isStackedLayout ? 0 : "auto",
                        width: isStackedLayout ? "100%" : "auto",
                        overflowWrap: "anywhere",
                      }}
                    >
                      /blog/{currentPost.slug}
                    </span>
                  )}
                </div>
              )}

              <Field label="Title *">
                <input
                  className="form-input"
                  style={{ fontSize: "1.05rem", fontWeight: 600 }}
                  value={form.title}
                  placeholder="Article title"
                  onChange={(event) => setField("title", event.target.value)}
                />
              </Field>

              <Field label="Excerpt *" hint="Brief summary shown on the blog listing page (max 300 chars).">
                <textarea
                  className="form-input"
                  rows={3}
                  style={{ resize: "none" }}
                  value={form.excerpt}
                  placeholder="A compelling one or two sentence summary..."
                  maxLength={300}
                  onChange={(event) => setField("excerpt", event.target.value)}
                />
                <p style={{ textAlign: "right", fontSize: "0.75rem", color: "#9CA3AF", margin: "3px 0 0" }}>
                  {form.excerpt.length}/300
                </p>
              </Field>

              <Field label="Cover Image">
                <CoverImageField value={form.coverImage} onChange={(value) => setField("coverImage", value)} />
              </Field>

              <Field label="Tags" hint="Press Enter or click Add after each tag.">
                <TagsField value={form.tags} onChange={(value) => setField("tags", value)} />
              </Field>

              <Field
                label="Content *"
                hint="Use the block controls to change block types, move sections, delete sections, and insert new blocks."
              >
                <div className="min-h-[360px] rounded-xl border border-[#E5E7EB] px-3 py-4 sm:px-5 sm:py-5">
                  <RichEditor blocks={blocks} onChange={handleBlocksChange} />
                </div>
              </Field>

              <div className="border-t border-[#E5E7EB] pt-4">
                {isCompactMobile ? (
                  <div className="grid grid-cols-2 gap-2">
                    <SecondaryActionButton onClick={startNew} className="w-full">
                      <FilePlus2 size={14} /> New
                    </SecondaryActionButton>
                    <Button
                      type="button"
                      variant="outline-green"
                      disabled={saving}
                      onClick={handleSaveDraft}
                      className="w-full"
                    >
                      <Save size={14} /> Draft
                    </Button>
                    <Button
                      type="button"
                      variant="green"
                      disabled={saving}
                      onClick={handlePublish}
                      className="col-span-2 w-full"
                    >
                      <Send size={14} /> {currentPost?.status === "published" ? "Update" : "Publish"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <SecondaryActionButton onClick={startNew} className="w-full sm:w-auto">
                      <FilePlus2 size={14} /> New post
                    </SecondaryActionButton>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline-green"
                        disabled={saving}
                        onClick={handleSaveDraft}
                        className="w-full sm:w-auto"
                      >
                        <Save size={14} /> Save draft
                      </Button>
                      <Button
                        type="button"
                        variant="green"
                        disabled={saving}
                        onClick={handlePublish}
                        className="w-full sm:w-auto"
                      >
                        <Send size={14} /> {currentPost?.status === "published" ? "Update" : "Publish"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
