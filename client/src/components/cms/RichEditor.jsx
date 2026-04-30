/**
 * RichEditor — full-featured block-based article editor
 *
 * Block types supported:
 *   paragraph  — body text
 *   heading    — H2 section heading
 *   subheading — H3 sub-section heading
 *   image      — inline image with optional caption
 *   quote      — pull-quote / blockquote
 *   bullets    — unordered bullet list
 *   numbered   — ordered numbered list
 *   divider    — horizontal rule / section break
 *   callout    — highlighted info/tip box
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  Bold,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Heading2,
  Heading3,
  Image,
  Info,
  Italic,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Trash2,
  Upload,
} from "lucide-react";
import api from "@/lib/api";

/* ─── Helpers ────────────────────────────────────────────── */
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function makeBlock(type) {
  const base = { id: uid(), type };
  switch (type) {
    case "image":
      return { ...base, url: "", caption: "", alt: "" };
    case "bullets":
    case "numbered":
      return { ...base, items: [""] };
    case "callout":
      return { ...base, text: "", variant: "info" };
    default:
      return { ...base, text: "" };
  }
}

const BLOCK_META = [
  { type: "paragraph",  label: "Paragraph",   icon: AlignLeft },
  { type: "heading",    label: "Heading",      icon: Heading2 },
  { type: "subheading", label: "Subheading",   icon: Heading3 },
  { type: "image",      label: "Image",        icon: Image },
  { type: "quote",      label: "Quote",        icon: Quote },
  { type: "bullets",    label: "Bullet list",  icon: List },
  { type: "numbered",   label: "Numbered list",icon: ListOrdered },
  { type: "callout",    label: "Callout",      icon: Info },
  { type: "divider",    label: "Divider",      icon: Minus },
];

/* ─── Styles ─────────────────────────────────────────────── */
const TEXTAREA = {
  width: "100%",
  border: "none",
  outline: "none",
  resize: "none",
  fontFamily: "inherit",
  background: "transparent",
  padding: 0,
  lineHeight: 1.75,
};

const INPUT_LINE = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #E5E7EB",
  outline: "none",
  fontFamily: "inherit",
  background: "transparent",
  padding: "4px 0",
  fontSize: "0.875rem",
};

/* ─── Image upload helper ────────────────────────────────── */
async function uploadImageFile(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data.url;
}

/* ─── Formatting Toolbar (bold/italic) ───────────────────── */
function FormattingToolbar({ textareaRef, value, onChange }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    function handleSelect() {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (start !== end) {
        const rect = el.getBoundingClientRect();
        setPos({ top: rect.top - 40, left: rect.left + (rect.width / 2) - 50 });
        setShow(true);
      } else {
        setShow(false);
      }
    }
    el.addEventListener("mouseup", handleSelect);
    el.addEventListener("keyup", handleSelect);
    return () => {
      el.removeEventListener("mouseup", handleSelect);
      el.removeEventListener("keyup", handleSelect);
    };
  }, [textareaRef]);

  function wrapSelection(marker) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === end) return;
    const selected = value.slice(start, end);
    // Toggle: if already wrapped, unwrap
    const alreadyWrapped = selected.startsWith(marker) && selected.endsWith(marker);
    let newText;
    if (alreadyWrapped) {
      newText = value.slice(0, start) + selected.slice(marker.length, -marker.length) + value.slice(end);
    } else {
      newText = value.slice(0, start) + marker + selected + marker + value.slice(end);
    }
    onChange(newText);
    setShow(false);
  }

  if (!show) return null;
  return (
    <div ref={toolbarRef} style={{
      position: "fixed", top: pos.top, left: pos.left, zIndex: 100,
      display: "flex", gap: "2px", background: "#1F2937", borderRadius: "0.5rem",
      padding: "4px 6px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    }}>
      <button type="button" onClick={() => wrapSelection("**")} title="Bold"
        style={{ background: "none", border: "none", cursor: "pointer", color: "white", padding: "4px 6px", borderRadius: 4, display: "flex", alignItems: "center" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#374151"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
        <Bold size={14} />
      </button>
      <button type="button" onClick={() => wrapSelection("*")} title="Italic"
        style={{ background: "none", border: "none", cursor: "pointer", color: "white", padding: "4px 6px", borderRadius: 4, display: "flex", alignItems: "center" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#374151"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
        <Italic size={14} />
      </button>
    </div>
  );
}

/* ─── Text block with formatting support ─────────────────── */
function FormattableTextarea({ style, value, placeholder, rows, onChange }) {
  const ref = useRef(null);
  function handleChange(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    onChange(e.target.value);
  }
  return (
    <div style={{ position: "relative" }}>
      <FormattingToolbar textareaRef={ref} value={value || ""} onChange={onChange} />
      <textarea
        ref={ref}
        style={style}
        value={value || ""}
        placeholder={placeholder}
        rows={rows || 1}
        onChange={handleChange}
        onFocus={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
      />
    </div>
  );
}

/* ─── Individual Block Renderers ─────────────────────────── */

function ParagraphBlock({ block, onChange }) {
  return (
    <FormattableTextarea
      style={{ ...TEXTAREA, fontSize: "0.9375rem", color: "#374151", minHeight: 28 }}
      value={block.text || ""}
      placeholder="Write something..."
      onChange={(text) => onChange({ text })}
    />
  );
}

function HeadingBlock({ block, onChange, level = 2 }) {
  const style = level === 2
    ? { ...TEXTAREA, fontSize: "1.25rem", fontWeight: 700, color: "#111827", minHeight: 32 }
    : { ...TEXTAREA, fontSize: "1.05rem", fontWeight: 600, color: "#1F2937", minHeight: 28 };
  return (
    <FormattableTextarea
      style={style}
      value={block.text || ""}
      placeholder={level === 2 ? "Section heading..." : "Sub-section heading..."}
      onChange={(text) => onChange({ text })}
    />
  );
}

function QuoteBlock({ block, onChange }) {
  return (
    <div style={{ borderLeft: "4px solid #4F7B44", paddingLeft: "1rem" }}>
      <FormattableTextarea
        style={{ ...TEXTAREA, fontSize: "1.05rem", fontStyle: "italic", color: "#374151", minHeight: 28 }}
        value={block.text || ""}
        placeholder="Enter a quote or pull-out text..."
        onChange={(text) => onChange({ text })}
      />
    </div>
  );
}

function ImageBlock({ block, onChange }) {
  const [preview, setPreview] = useState(block.url || "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  function handleUrl(e) {
    setPreview(e.target.value);
    onChange({ url: e.target.value });
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      setPreview(url);
      onChange({ url });
    } catch {
      /* toast handled by interceptor */
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* URL input + upload */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Image size={15} style={{ color: "#9CA3AF", flexShrink: 0 }} />
        <input
          style={{ ...INPUT_LINE, flex: 1 }}
          value={block.url || ""}
          placeholder="Paste image URL (https://...)"
          onChange={handleUrl}
          onBlur={(e) => setPreview(e.target.value)}
        />
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "4px 10px", border: "1px solid #D1D5DB", borderRadius: "0.375rem", background: "#F9FAFB", fontSize: "0.75rem", color: "#4F7B44", cursor: uploading ? "not-allowed" : "pointer", whiteSpace: "nowrap", fontWeight: 500 }}>
          <Upload size={12} /> {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>

      {/* Preview */}
      {preview && (
        <div style={{ borderRadius: "0.625rem", overflow: "hidden", border: "1px solid #E5E7EB", background: "#F9FAFB", maxHeight: 400 }}>
          <img
            src={preview}
            alt={block.alt || "preview"}
            style={{ width: "100%", maxHeight: 400, objectFit: "cover", display: "block" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      )}

      {/* Alt text */}
      <input
        style={INPUT_LINE}
        value={block.alt || ""}
        placeholder="Alt text (for accessibility)"
        onChange={(e) => onChange({ alt: e.target.value })}
      />

      {/* Caption */}
      <input
        style={{ ...INPUT_LINE, fontSize: "0.8125rem", color: "#6B7280", fontStyle: "italic" }}
        value={block.caption || ""}
        placeholder="Caption (optional)"
        onChange={(e) => onChange({ caption: e.target.value })}
      />
    </div>
  );
}

function ListBlock({ block, onChange, numbered = false }) {
  const items = block.items || [""];

  function updateItem(idx, val) {
    const next = [...items];
    next[idx] = val;
    onChange({ items: next });
  }

  function addItem(idx) {
    const next = [...items];
    next.splice(idx + 1, 0, "");
    onChange({ items: next });
  }

  function removeItem(idx) {
    if (items.length === 1) return;
    const next = items.filter((_, i) => i !== idx);
    onChange({ items: next });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#4F7B44", fontWeight: 700, fontSize: "0.875rem", width: 20, flexShrink: 0, textAlign: "right" }}>
            {numbered ? `${idx + 1}.` : "•"}
          </span>
          <input
            style={{ ...INPUT_LINE, flex: 1, borderBottom: "none" }}
            value={item}
            placeholder={`Item ${idx + 1}`}
            onChange={(e) => updateItem(idx, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addItem(idx); }
              if (e.key === "Backspace" && !item) { e.preventDefault(); removeItem(idx); }
            }}
          />
          <button
            type="button"
            onClick={() => removeItem(idx)}
            style={{ color: "#D1D5DB", background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0 }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addItem(items.length - 1)}
        style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem", color: "#4F7B44", background: "none", border: "none", cursor: "pointer", marginTop: "0.25rem", fontWeight: 500 }}
      >
        <Plus size={13} /> Add item
      </button>
    </div>
  );
}

function CalloutBlock({ block, onChange }) {
  const variants = { info: { bg: "#EFF6FF", border: "#BFDBFE", icon: "💡" }, tip: { bg: "#F0FDF4", border: "#BBF7D0", icon: "✅" }, warning: { bg: "#FFFBEB", border: "#FDE68A", icon: "⚠️" } };
  const v = variants[block.variant || "info"];
  return (
    <div style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: "0.625rem", padding: "0.875rem 1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span>{v.icon}</span>
        <select
          value={block.variant || "info"}
          onChange={(e) => onChange({ variant: e.target.value })}
          style={{ fontSize: "0.75rem", border: "none", background: "transparent", color: "#6B7280", cursor: "pointer" }}
        >
          <option value="info">Info</option>
          <option value="tip">Tip</option>
          <option value="warning">Warning</option>
        </select>
      </div>
      <textarea
        style={{ ...TEXTAREA, fontSize: "0.9rem", color: "#374151", minHeight: 24 }}
        value={block.text || ""}
        placeholder="Callout text..."
        rows={1}
        onChange={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
          onChange({ text: e.target.value });
        }}
        onFocus={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
      />
    </div>
  );
}

function DividerBlock() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0" }}>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      <Minus size={14} style={{ color: "#D1D5DB" }} />
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
    </div>
  );
}

/* ─── Block Wrapper ──────────────────────────────────────── */
function Block({ block, index, total, onChange, onDelete, onMove, onAdd }) {
  const [hovered, setHovered] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const meta = BLOCK_META.find((m) => m.type === block.type) || BLOCK_META[0];

  function renderContent() {
    switch (block.type) {
      case "paragraph":  return <ParagraphBlock  block={block} onChange={onChange} />;
      case "heading":    return <HeadingBlock    block={block} onChange={onChange} level={2} />;
      case "subheading": return <HeadingBlock    block={block} onChange={onChange} level={3} />;
      case "image":      return <ImageBlock      block={block} onChange={onChange} />;
      case "quote":      return <QuoteBlock      block={block} onChange={onChange} />;
      case "bullets":    return <ListBlock       block={block} onChange={onChange} numbered={false} />;
      case "numbered":   return <ListBlock       block={block} onChange={onChange} numbered={true} />;
      case "callout":    return <CalloutBlock    block={block} onChange={onChange} />;
      case "divider":    return <DividerBlock />;
      default:           return <ParagraphBlock  block={block} onChange={onChange} />;
    }
  }

  return (
    <div
      style={{ position: "relative", marginBottom: "0.25rem" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTypeOpen(false); }}
    >
      {/* Left gutter — visible on hover */}
      <div style={{
        position: "absolute",
        left: -64,
        top: 0,
        width: 56,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        opacity: hovered ? 1 : 0,
        transition: "opacity 150ms ease",
        paddingTop: 2,
      }}>
        {/* Block type picker */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            title="Change block type"
            onClick={() => setTypeOpen((v) => !v)}
            style={{ padding: "3px 5px", borderRadius: 5, border: "1px solid #E5E7EB", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px", fontSize: "0.7rem", color: "#6B7280" }}
          >
            <meta.icon size={11} />
          </button>
          {typeOpen && (
            <div style={{
              position: "absolute",
              left: 0,
              top: "calc(100% + 4px)",
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "0.5rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 50,
              minWidth: 160,
              padding: "0.25rem",
            }}>
              {BLOCK_META.map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => { onChange({ type: m.type }); setTypeOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    width: "100%", padding: "0.4rem 0.625rem",
                    background: block.type === m.type ? "#F0FDF4" : "transparent",
                    border: "none", borderRadius: "0.375rem", cursor: "pointer",
                    fontSize: "0.8125rem", color: block.type === m.type ? "#4F7B44" : "#374151",
                    fontWeight: block.type === m.type ? 600 : 400,
                    textAlign: "left",
                  }}
                >
                  <m.icon size={13} /> {m.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Move up */}
        <button type="button" onClick={() => onMove("up")} disabled={index === 0}
          style={{ padding: 3, border: "1px solid #E5E7EB", borderRadius: 4, background: "white", cursor: index === 0 ? "not-allowed" : "pointer", color: "#9CA3AF", opacity: index === 0 ? 0.4 : 1 }}>
          <ChevronUp size={11} />
        </button>
        {/* Move down */}
        <button type="button" onClick={() => onMove("down")} disabled={index === total - 1}
          style={{ padding: 3, border: "1px solid #E5E7EB", borderRadius: 4, background: "white", cursor: index === total - 1 ? "not-allowed" : "pointer", color: "#9CA3AF", opacity: index === total - 1 ? 0.4 : 1 }}>
          <ChevronDown size={11} />
        </button>
        {/* Delete */}
        <button type="button" onClick={onDelete}
          style={{ padding: 3, border: "1px solid #FECACA", borderRadius: 4, background: "white", cursor: "pointer", color: "#EF4444" }}>
          <Trash2 size={11} />
        </button>
      </div>

      {/* Block body */}
      <div style={{
        padding: "0.625rem 0.75rem",
        borderRadius: "0.5rem",
        border: "1px solid",
        borderColor: hovered ? "#D1FAE5" : "transparent",
        background: hovered ? "#FAFFFE" : "transparent",
        transition: "border-color 150ms ease, background 150ms ease",
      }}>
        {renderContent()}
      </div>

    </div>
  );
}

/* ─── Add Block Menu ─────────────────────────────────────── */
function AddBlockMenu({ onAdd }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function toggleMenu() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left + rect.width / 2 - 120 });
    }
    setOpen((v) => !v);
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={btnRef}
        type="button"
        onClick={toggleMenu}
        style={{
          display: "flex", alignItems: "center", gap: "0.25rem",
          padding: "2px 10px", borderRadius: "9999px",
          border: "1px dashed #D1D5DB", background: "white",
          color: "#9CA3AF", fontSize: "0.75rem", cursor: "pointer",
          transition: "border-color 150ms, color 150ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4F7B44"; e.currentTarget.style.color = "#4F7B44"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#9CA3AF"; }}
      >
        <Plus size={12} /> Add block
      </button>
      {open && (
        <div ref={menuRef} style={{
          position: "fixed",
          top: menuPos.top,
          left: menuPos.left,
          background: "white",
          border: "1px solid #E5E7EB",
          borderRadius: "0.75rem",
          boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
          zIndex: 9999,
          padding: "0.375rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2px",
          minWidth: 240,
          maxHeight: "min(320px, 60vh)",
          overflowY: "auto",
        }}>
          {BLOCK_META.map((m) => (
            <button
              key={m.type}
              type="button"
              onClick={() => { onAdd(m.type); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.425rem 0.75rem",
                border: "none", borderRadius: "0.5rem",
                background: "transparent", cursor: "pointer",
                fontSize: "0.8125rem", color: "#374151",
                textAlign: "left",
                transition: "background 120ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#4F7B44"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
            >
              <m.icon size={14} /> {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main RichEditor ────────────────────────────────────── */
export default function RichEditor({ blocks, onChange }) {
  const safeBlocks = Array.isArray(blocks) && blocks.length > 0
    ? blocks
    : [makeBlock("paragraph")];

  const update = useCallback((id, patch) => {
    onChange(safeBlocks.map((b) => b.id === id ? { ...b, ...patch } : b));
  }, [safeBlocks, onChange]);

  const remove = useCallback((id) => {
    const next = safeBlocks.filter((b) => b.id !== id);
    onChange(next.length > 0 ? next : [makeBlock("paragraph")]);
  }, [safeBlocks, onChange]);

  const move = useCallback((id, dir) => {
    const idx = safeBlocks.findIndex((b) => b.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === safeBlocks.length - 1) return;
    const arr = [...safeBlocks];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    onChange(arr);
  }, [safeBlocks, onChange]);

  const addAfter = useCallback((id, type = "paragraph") => {
    const idx = safeBlocks.findIndex((b) => b.id === id);
    const arr = [...safeBlocks];
    arr.splice(idx + 1, 0, makeBlock(type));
    onChange(arr);
  }, [safeBlocks, onChange]);

  return (
    <div style={{ paddingLeft: 64, position: "relative" }}>
      {safeBlocks.map((block, idx) => (
        <Block
          key={block.id}
          block={block}
          index={idx}
          total={safeBlocks.length}
          onChange={(patch) => update(block.id, patch)}
          onDelete={() => remove(block.id)}
          onMove={(dir) => move(block.id, dir)}
          onAdd={(type) => addAfter(block.id, type)}
        />
      ))}

      {/* Bottom add button */}
      <div style={{ paddingLeft: 0, marginTop: "0.75rem", display: "flex" }}>
        <AddBlockMenu onAdd={(type) => {
          onChange([...safeBlocks, makeBlock(type)]);
        }} />
      </div>
    </div>
  );
}

/* ─── Serialise blocks → HTML (for newsletter emails) ───── */
export function blocksToHtml(blocks) {
  if (!Array.isArray(blocks)) return typeof blocks === "string" ? blocks : "";
  return blocks.map((b) => {
    switch (b.type) {
      case "paragraph":  return `<p style="font-size:1rem;color:#374151;line-height:1.8;margin:0 0 1rem">${b.text || ""}</p>`;
      case "heading":    return `<h2 style="font-size:1.375rem;font-weight:700;color:#111827;margin:2rem 0 0.75rem;padding-left:0.75rem;border-left:3px solid #4F7B44">${b.text || ""}</h2>`;
      case "subheading": return `<h3 style="font-size:1.1rem;font-weight:600;color:#1F2937;margin:1.5rem 0 0.5rem">${b.text || ""}</h3>`;
      case "image":      return b.url ? `<figure style="margin:1.5rem 0"><img src="${b.url}" alt="${b.alt || ""}" style="width:100%;border-radius:8px;display:block">${b.caption ? `<figcaption style="text-align:center;font-size:0.8125rem;color:#6B7280;margin-top:0.5rem">${b.caption}</figcaption>` : ""}</figure>` : "";
      case "quote":      return `<blockquote style="border-left:4px solid #4F7B44;margin:1.5rem 0;padding:0.75rem 1.25rem;font-style:italic;color:#374151;background:#F9FAFB;border-radius:0 8px 8px 0">${b.text || ""}</blockquote>`;
      case "bullets":    return `<ul style="margin:0.5rem 0 1rem;padding-left:1.25rem">${(b.items || []).map((i) => `<li style="margin-bottom:0.375rem;color:#374151">${i}</li>`).join("")}</ul>`;
      case "numbered":   return `<ol style="margin:0.5rem 0 1rem;padding-left:1.25rem">${(b.items || []).map((i) => `<li style="margin-bottom:0.375rem;color:#374151">${i}</li>`).join("")}</ol>`;
      case "callout":    return `<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:1rem 1.25rem;margin:1rem 0"><p style="margin:0;color:#374151">${b.text || ""}</p></div>`;
      case "divider":    return `<hr style="border:none;border-top:1px solid #E5E7EB;margin:2rem 0">`;
      default:           return "";
    }
  }).join("\n");
}

/* ─── Parse legacy string/JSON content → blocks ─────────── */
export function parseContentToBlocks(raw) {
  if (Array.isArray(raw) && raw.length > 0) {
    // Already block array — ensure each has an id
    return raw.map((b) => ({ id: uid(), ...b }));
  }
  if (typeof raw === "string" && raw.trim()) {
    // Try parsing JSON
    try {
      const parsed = JSON.parse(raw.trim());
      if (Array.isArray(parsed)) return parsed.map((b) => ({ id: uid(), ...b }));
    } catch {}
    // Plain text — split on double-newlines into paragraphs
    return raw
      .split(/\n{2,}/)
      .filter(Boolean)
      .map((t) => ({ id: uid(), type: "paragraph", text: t.trim() }));
  }
  return [makeBlock("paragraph")];
}
