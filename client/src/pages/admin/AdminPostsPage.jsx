import { useDeferredValue, useEffect, useRef, useState, useCallback } from "react";
import {
  Eye, FilePlus2, RefreshCw, Save, Search, Send, Trash2,
  Image, Tag, ChevronDown, Clock, CheckCircle2, Upload,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import RichEditor, { parseContentToBlocks } from "@/components/cms/RichEditor";
import ArticlePreviewModal from "@/components/cms/ArticlePreviewModal";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { formatPostDate } from "@/lib/blog";
import { cn } from "@/lib/cn";

const EMPTY_FORM = { title: "", excerpt: "", coverImage: "", tags: "", status: "draft" };

function StatusPill({ status }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
      status === "published" ? "bg-[#ECFDF3] text-[#027A48]" : "bg-[#F2F4F7] text-[#475467]",
    )}>
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
  const [preview, setPreview] = useState(value || "");
  const [expanded, setExpanded] = useState(Boolean(value));
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  function handleChange(e) { setPreview(e.target.value); onChange(e.target.value); }
  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data.data.url;
      setPreview(url);
      onChange(url);
    } catch { /* handled by interceptor */ }
    finally { setUploading(false); }
  }
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: "0.75rem", overflow: "hidden" }}>
      <button type="button" onClick={() => setExpanded(v => !v)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0.75rem 1rem", background: "#F9FAFB", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Image size={15} style={{ color: "#4F7B44" }} />
          Cover Image {preview && <span style={{ color: "#4F7B44", fontSize: "0.75rem" }}>✓ set</span>}
        </span>
        <ChevronDown size={15} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
      </button>
      {expanded && (
        <div style={{ padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input className="form-input" style={{ flex: 1 }} value={value || ""} placeholder="https://example.com/image.jpg" onChange={handleChange} />
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.5rem 0.75rem", border: "1px solid #D0D5DD", borderRadius: "0.5rem", background: "#F9FAFB", fontSize: "0.8rem", color: "#4F7B44", cursor: uploading ? "not-allowed" : "pointer", whiteSpace: "nowrap", fontWeight: 500 }}>
              <Upload size={13} /> {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
          {preview && (
            <div style={{ borderRadius: "0.5rem", overflow: "hidden", maxHeight: 200, border: "1px solid #E5E7EB" }}>
              <img src={preview} alt="cover preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }}
                onError={e => { e.target.style.display = "none"; }} onLoad={e => { e.target.style.display = "block"; }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TagsField({ value, onChange }) {
  const tags = value ? value.split(",").map(t => t.trim()).filter(Boolean) : [];
  const [input, setInput] = useState("");
  function addTag() {
    const t = input.trim().toLowerCase();
    if (t && !tags.includes(t)) onChange([...tags, t].join(", "));
    setInput("");
  }
  function removeTag(tag) { onChange(tags.filter(t => t !== tag).join(", ")); }
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "0.5rem", minHeight: 28 }}>
        {tags.map(tag => (
          <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "2px 10px", borderRadius: "9999px", background: "#E8F2E6", color: "#3d6235", fontSize: "0.8rem", fontWeight: 500 }}>
            <Tag size={10} /> {tag}
            <button type="button" onClick={() => removeTag(tag)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", padding: "0 0 0 2px", lineHeight: 1 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input className="form-input" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
          placeholder="Type a tag and press Enter" />
        <button type="button" onClick={addTag}
          style={{ padding: "0 0.875rem", border: "1px solid #E5E7EB", borderRadius: "0.5rem", background: "#F9FAFB", fontSize: "0.875rem", cursor: "pointer", whiteSpace: "nowrap" }}>
          Add
        </button>
      </div>
    </div>
  );
}

function SaveIndicator({ state }) {
  if (state === "saving") return <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Saving…</span>;
  if (state === "saved")  return <span style={{ fontSize: "0.8rem", color: "#4F7B44" }}>✓ Draft saved</span>;
  if (state === "error")  return <span style={{ fontSize: "0.8rem", color: "#EF4444" }}>Save failed</span>;
  return null;
}

export default function AdminPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts]                     = useState([]);
  const [listLoading, setListLoading]         = useState(true);
  const [search, setSearch]                   = useState("");
  const [statusFilter, setStatusFilter]       = useState("all");
  const deferredSearch                        = useDeferredValue(search);
  const [selectedId, setSelectedId]           = useState("");
  const [form, setForm]                       = useState(EMPTY_FORM);
  const [blocks, setBlocks]                   = useState([]);
  const [editorLoading, setEditorLoading]     = useState(false);
  const [saving, setSaving]                   = useState(false);
  const [autoSaveState, setAutoSave]          = useState(null);
  const [deleting, setDeleting]               = useState(false);
  const [showPreview, setShowPreview]         = useState(false);
  const autoSaveTimer                         = useRef(null);
  const isDirty                               = useRef(false);
  const selectedIdRef                         = useRef("");

  // Keep ref in sync for use inside closures
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  const loadPosts = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await api.get("/blog/admin/posts", {
        params: { status: statusFilter, search: deferredSearch, limit: 50 },
      });
      setPosts(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load posts.");
    } finally {
      setListLoading(false);
    }
  }, [statusFilter, deferredSearch]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  async function selectPost(id) {
    clearTimeout(autoSaveTimer.current);
    setSelectedId(id);
    setEditorLoading(true);
    isDirty.current = false;
    setAutoSave(null);
    try {
      const res = await api.get(`/blog/admin/posts/${id}`);
      const p = res.data.data;
      setForm({
        title:      p.title      || "",
        excerpt:    p.excerpt    || "",
        coverImage: p.coverImage || "",
        tags:       Array.isArray(p.tags) ? p.tags.join(", ") : "",
        status:     p.status     || "draft",
      });
      setBlocks(parseContentToBlocks(p.content));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load post.");
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
    isDirty.current = false;
    setAutoSave(null);
  }

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    markDirty();
  }

  function handleBlocksChange(next) {
    setBlocks(next);
    markDirty();
  }

  function markDirty() {
    isDirty.current = true;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      if (isDirty.current) triggerAutoSave();
    }, 3000);
  }

  async function triggerAutoSave() {
    // Skip auto-save if title is empty — prevents false "Save failed" errors on new posts
    setForm(currentForm => {
      if (!currentForm.title.trim()) {
        return currentForm;
      }
      isDirty.current = false;
      setAutoSave("saving");
      performSave("draft", { silent: true }).then(() => {
        setAutoSave("saved");
        setTimeout(() => setAutoSave(null), 2500);
      }).catch(() => {
        setAutoSave("error");
      });
      return currentForm;
    });
  }

  // Core save — reads form + blocks from React state passed explicitly
  async function performSave(forcedStatus, { silent = false, formData = null, blockData = null } = {}) {
    // We use the setForm/setBlocks updater pattern to read latest state
    return new Promise((resolve, reject) => {
      setForm(currentForm => {
        setBlocks(currentBlocks => {
          const f = formData || currentForm;
          const b = blockData || currentBlocks;
          const status = forcedStatus || f.status;

          if (!f.title.trim()) {
            if (!silent) toast.error("Title is required.");
            reject(new Error("Title required"));
            return currentBlocks;
          }
          if (!f.excerpt.trim()) {
            if (!silent) toast.error("Excerpt is required.");
            reject(new Error("Excerpt required"));
            return currentBlocks;
          }

          const payload = {
            title:      f.title.trim(),
            excerpt:    f.excerpt.trim(),
            coverImage: f.coverImage.trim(),
            tags:       f.tags,
            content:    b,
            status,
          };

          const currentId = selectedIdRef.current;
          const request = currentId
            ? api.put(`/blog/posts/${currentId}`, payload)
            : api.post("/blog/posts", payload);

          request.then(res => {
            const saved = res.data.data;
            const newsletter = res.data.meta?.newsletter;

            selectedIdRef.current = saved._id;
            setSelectedId(saved._id);
            setForm({
              title:      saved.title      || "",
              excerpt:    saved.excerpt    || "",
              coverImage: saved.coverImage || "",
              tags:       Array.isArray(saved.tags) ? saved.tags.join(", ") : "",
              status:     saved.status     || "draft",
            });
            setBlocks(parseContentToBlocks(saved.content));
            isDirty.current = false;
            loadPosts();
            resolve({ saved, newsletter });
          }).catch(err => {
            reject(err);
          });

          return currentBlocks;
        });
        return currentForm;
      });
    });
  }

  async function handleSaveDraft() {
    setSaving(true);
    clearTimeout(autoSaveTimer.current);
    try {
      await performSave("draft");
      toast.success("Draft saved.");
      setAutoSave("saved");
      setTimeout(() => setAutoSave(null), 2500);
    } catch (err) {
      if (!["Title required", "Excerpt required"].includes(err.message)) {
        toast.error(err.response?.data?.message || "Could not save draft.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setSaving(true);
    clearTimeout(autoSaveTimer.current);
    try {
      const { newsletter } = await performSave("published");
      if (newsletter?.reason === "sent") {
        toast.success(`Published! Newsletter sent to ${newsletter.sent} subscriber(s).`);
      } else if (newsletter?.reason === "no-active-subscribers") {
        toast.success("Published! No active subscribers to notify.");
      } else if (newsletter?.reason === "email-not-configured") {
        toast.success("Published! (Email not configured — no newsletter sent.)");
      } else {
        toast.success("Post published.");
      }
    } catch (err) {
      if (!["Title required", "Excerpt required"].includes(err.message)) {
        toast.error(err.response?.data?.message || "Could not publish.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedId) return;
    if (!window.confirm("Delete this post permanently? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/blog/posts/${selectedId}`);
      toast.success("Post deleted.");
      startNew();
      await loadPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete.");
    } finally {
      setDeleting(false);
    }
  }

  const currentPost = posts.find(p => p._id === selectedId);
  const viewLink = currentPost?.slug ? `/blog/${currentPost.slug}` : "";

  return (
    <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "320px 1fr", alignItems: "start" }}>

      {/* Post list */}
      <aside style={{ border: "1px solid #E5E7EB", borderRadius: "1rem", background: "white", overflow: "hidden", position: "sticky", top: 24 }}>
        <div style={{ borderBottom: "1px solid #E5E7EB", padding: "1rem 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#101828", margin: 0 }}>Posts</h2>
              <p style={{ fontSize: "0.775rem", color: "#667085", margin: 0 }}>{posts.length} total</p>
            </div>
            <button type="button" onClick={startNew} title="New post"
              style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #D0D5DD", borderRadius: "0.5rem", background: "white", cursor: "pointer", color: "#344054" }}>
              <FilePlus2 size={15} />
            </button>
          </div>
          <div style={{ position: "relative", marginBottom: "0.5rem" }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input className="form-input" style={{ paddingLeft: 30, fontSize: "0.875rem" }} value={search}
              onChange={e => setSearch(e.target.value)} placeholder="Search posts…" />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select className="form-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ flex: 1, fontSize: "0.875rem" }}>
              <option value="all">All</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
            </select>
            <button type="button" onClick={loadPosts}
              style={{ width: 38, height: 38, border: "1px solid #D0D5DD", borderRadius: "0.5rem", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#344054", flexShrink: 0 }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
          {listLoading ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>Loading…</p>
          ) : posts.length === 0 ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>No posts found.</p>
          ) : posts.map(post => {
            const active = post._id === selectedId;
            return (
              <button key={post._id} type="button" onClick={() => selectPost(post._id)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "0.875rem 1.25rem", background: active ? "#F8FBF8" : "transparent", border: "none", borderLeft: `3px solid ${active ? "#4F7B44" : "transparent"}`, borderBottom: "1px solid #F2F4F7", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#101828", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {post.title}
                  </p>
                  <StatusPill status={post.status} />
                </div>
                <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.25rem", fontSize: "0.75rem", color: "#9CA3AF" }}>
                  <span>{formatPostDate(post) || "Unpublished"}</span>
                  <span>·</span>
                  <span>{post.views || 0} views</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Editor */}
      <div style={{ border: "1px solid #E5E7EB", borderRadius: "1rem", background: "white", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ borderBottom: "1px solid #E5E7EB", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#101828", margin: 0 }}>
              {selectedId ? "Edit post" : "New post"}
            </h2>
            <p style={{ fontSize: "0.775rem", color: "#667085", margin: 0 }}>
              Publishing notifies all active newsletter subscribers.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
            <SaveIndicator state={autoSaveState} />
            <button type="button" onClick={() => setShowPreview(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.875rem", border: "1px solid #D0D5DD", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#344054", background: "white", cursor: "pointer", textDecoration: "none" }}>
              <Eye size={14} /> Preview
            </button>
            <Button type="button" variant="outline-green" disabled={saving || editorLoading} onClick={handleSaveDraft}>
              <Save size={14} /> Save draft
            </Button>
            <Button type="button" variant="green" disabled={saving || editorLoading} onClick={handlePublish}>
              <Send size={14} /> {currentPost?.status === "published" ? "Update" : "Publish"}
            </Button>
            {user?.role === "admin" && selectedId && (
              <button type="button" disabled={deleting} onClick={handleDelete}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.875rem", border: "1px solid #FECACA", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#B42318", background: "white", cursor: deleting ? "not-allowed" : "pointer" }}>
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
        </div>

        {editorLoading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#9CA3AF" }}>Loading post…</div>
        ) : (
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Status bar for existing posts */}
            {selectedId && (
              <div style={{ display: "flex", gap: "0.875rem", background: "#F9FAFB", borderRadius: "0.625rem", padding: "0.625rem 1rem", flexWrap: "wrap", alignItems: "center" }}>
                <StatusPill status={form.status} />
                <select className="form-input" style={{ width: "auto", padding: "3px 10px", fontSize: "0.8rem" }}
                  value={form.status} onChange={e => setField("status", e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                {currentPost?.publishedAt && <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Published {formatPostDate(currentPost)}</span>}
                {currentPost?.newsletterSentAt && <span style={{ fontSize: "0.8rem", color: "#4F7B44" }}>✓ Newsletter sent</span>}
                {currentPost?.slug && <span style={{ fontSize: "0.8rem", color: "#9CA3AF", marginLeft: "auto" }}>/blog/{currentPost.slug}</span>}
              </div>
            )}

            <Field label="Title *">
              <input className="form-input" style={{ fontSize: "1.05rem", fontWeight: 600 }}
                value={form.title} placeholder="Article title"
                onChange={e => setField("title", e.target.value)} />
            </Field>

            <Field label="Excerpt *" hint="Brief summary shown on the blog listing page (max 300 chars).">
              <textarea className="form-input" rows={3} style={{ resize: "none" }}
                value={form.excerpt} placeholder="A compelling one or two sentence summary…"
                maxLength={300} onChange={e => setField("excerpt", e.target.value)} />
              <p style={{ textAlign: "right", fontSize: "0.75rem", color: "#9CA3AF", margin: "3px 0 0" }}>
                {form.excerpt.length}/300
              </p>
            </Field>

            <Field label="Cover Image">
              <CoverImageField value={form.coverImage} onChange={v => setField("coverImage", v)} />
            </Field>

            <Field label="Tags" hint="Press Enter or click Add after each tag.">
              <TagsField value={form.tags} onChange={v => setField("tags", v)} />
            </Field>

            <Field label="Content *" hint="Hover a block to reveal controls. Use '+ Add block' to insert new content blocks.">
              <div style={{ border: "1px solid #E5E7EB", borderRadius: "0.75rem", padding: "1.25rem 1.25rem 0.75rem", minHeight: 360 }}>
                <RichEditor blocks={blocks} onChange={handleBlocksChange} />
              </div>
            </Field>

            {/* Bottom actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid #E5E7EB", flexWrap: "wrap", gap: "0.75rem" }}>
              <button type="button" onClick={startNew}
                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.875rem", border: "1px solid #D0D5DD", borderRadius: "0.5rem", fontSize: "0.875rem", color: "#344054", background: "white", cursor: "pointer" }}>
                <FilePlus2 size={14} /> New post
              </button>
              <div style={{ display: "flex", gap: "0.625rem" }}>
                <Button type="button" variant="outline-green" disabled={saving} onClick={handleSaveDraft}>
                  <Save size={14} /> Save draft
                </Button>
                <Button type="button" variant="green" disabled={saving} onClick={handlePublish}>
                  <Send size={14} /> {currentPost?.status === "published" ? "Update" : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <ArticlePreviewModal
          form={form}
          blocks={blocks}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
