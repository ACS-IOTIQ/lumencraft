"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import { useState, useCallback } from "react";
import type { MediaAsset, BlogCategory } from "@prisma/client";
import { saveBlogPostAction } from "@/app/admin/actions";

type BlogPostForEditor = {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: unknown;
  coverImageUrl: string | null;
  coverMediaId: string | null;
  author: string;
  tags: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  seoImage: string | null;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
} | null;

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function safeArr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

// ---------- Toolbar button ----------

function ToolBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded text-sm transition ${
        active
          ? "bg-black text-white"
          : "text-black/60 hover:bg-black/8 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-black/15" />;
}

// ---------- Toolbar ----------

function EditorToolbar({
  editor,
  onInsertImage,
}: {
  editor: ReturnType<typeof useEditor>;
  onInsertImage: () => void;
}) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-black/10 bg-[#f5f5f3] px-3 py-2">
      {/* Marks */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
        <strong>B</strong>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
        <em>I</em>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
        <span className="underline">U</span>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <s>S</s>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
        <span className="font-mono text-xs">`c`</span>
      </ToolBtn>

      <Divider />

      {/* Headings */}
      {([1, 2, 3] as const).map((level) => (
        <ToolBtn
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          active={editor.isActive("heading", { level })}
          title={`Heading ${level}`}
        >
          <span className="font-semibold text-xs">H{level}</span>
        </ToolBtn>
      ))}

      <Divider />

      {/* Lists */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
        ☰
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
        ≡
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
        "
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
        <span className="font-mono text-xs">{"</>"}</span>
      </ToolBtn>

      <Divider />

      {/* Align */}
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">⇤</ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">↔</ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">⇥</ToolBtn>

      <Divider />

      {/* Links */}
      <ToolBtn
        onClick={() => {
          const url = window.prompt("URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
          else editor.chain().focus().unsetLink().run();
        }}
        active={editor.isActive("link")}
        title="Link"
      >
        🔗
      </ToolBtn>

      {/* Image */}
      <ToolBtn onClick={onInsertImage} title="Insert image">
        🖼
      </ToolBtn>

      {/* Table */}
      <ToolBtn
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        title="Insert table"
      >
        ⊞
      </ToolBtn>

      <Divider />

      {/* History */}
      <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</ToolBtn>

      <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">─</ToolBtn>
    </div>
  );
}

// ---------- Image insert dialog ----------

function ImageDialog({
  onInsert,
  onClose,
  mediaAssets,
}: {
  onInsert: (url: string) => void;
  onClose: () => void;
  mediaAssets: MediaAsset[];
}) {
  const [url, setUrl] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-sm border border-black/10 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Insert Image</h3>
          <button type="button" onClick={onClose} className="text-xl leading-none text-black/40 hover:text-black">×</button>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Image URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/40"
          />
        </div>

        {mediaAssets.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-black/50">Or pick from Media Library</p>
            <div className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto rounded border border-black/10 p-2">
              {mediaAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => { setUrl(asset.url ?? ""); }}
                  className={`relative aspect-square overflow-hidden rounded border text-left transition hover:border-black ${url === asset.url ? "border-black" : "border-black/15"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url ?? ""} alt={asset.filename} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="border border-black/15 px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { if (url) { onInsert(url); onClose(); } }}
            disabled={!url}
            className="bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Tags editor ----------

function TagsField({ initialTags, name }: { initialTags: string[]; name: string }) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [draft, setDraft] = useState("");

  function add() {
    const t = draft.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setDraft(""); }
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
      <div className="mb-2 flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 rounded-sm bg-black px-2 py-0.5 text-xs text-white">
            {tag}
            <button type="button" onClick={() => setTags(tags.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Add tag (press Enter)"
          className="flex-1 border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/40"
        />
        <button type="button" onClick={add} className="border border-black px-3 py-2 text-sm font-medium hover:bg-black hover:text-white">+</button>
      </div>
    </div>
  );
}

// ---------- Main BlogEditor form ----------

export type BlogEditorProps = {
  post: BlogPostForEditor;
  categories: BlogCategory[];
  mediaAssets: MediaAsset[];
};

export default function BlogEditor({
  post,
  categories,
  mediaAssets,
}: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(post));
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState(() =>
    JSON.stringify(post?.content ?? { type: "doc", content: [{ type: "paragraph" }] }),
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing your article here..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: (post?.content ?? { type: "doc", content: [{ type: "paragraph" }] }) as object,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setJsonContent(JSON.stringify(editor.getJSON()));
    },
  });

  const insertImage = useCallback(
    (url: string) => {
      editor?.chain().focus().setImage({ src: url }).run();
    },
    [editor],
  );

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    if (!slugLocked) setSlug(slugify(val));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    let parsed: unknown;
    try { parsed = JSON.parse(jsonContent); } catch { parsed = null; }
    if (!parsed) {
      e.preventDefault();
      setGlobalError("Blog content is invalid. Please try again.");
    } else {
      setGlobalError(null);
    }
  }

  return (
    <form action={saveBlogPostAction} onSubmit={handleSubmit} className="grid gap-6">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="content" value={jsonContent} />

      {globalError && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{globalError}</p>
      )}

      {/* Overview */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Overview</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-black col-span-full">
            Title
            <input
              name="title"
              value={title}
              onChange={handleTitleChange}
              required
              className="border border-black/15 px-3 py-3 text-base outline-none focus:border-black/40"
              placeholder="Article title"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-black">
            Slug
            <div className="flex gap-2">
              <input
                name="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugLocked(true); }}
                required
                className="flex-1 border border-black/15 px-3 py-2 font-mono text-sm outline-none focus:border-black/40"
              />
              <button
                type="button"
                onClick={() => { setSlug(slugify(title)); setSlugLocked(false); }}
                className="border border-black/15 px-3 py-2 text-xs font-medium hover:border-black"
              >
                Auto
              </button>
            </div>
          </label>

          <label className="grid gap-2 text-sm font-medium text-black">
            Category
            <select name="categoryId" defaultValue={post?.categoryId ?? ""} className="border border-black/15 px-3 py-3">
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-black">
            Author
            <input name="author" defaultValue={post?.author ?? "Lumencraft Team"} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </label>

          <label className="grid gap-2 text-sm font-medium text-black">
            Sort order
            <input name="sortOrder" type="number" defaultValue={post?.sortOrder ?? 0} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </label>

          <div className="flex flex-col gap-3 pt-1">
            <label className="flex items-center gap-3 text-sm font-medium">
              <input name="isActive" type="checkbox" defaultChecked={post?.isActive ?? true} />
              Visible on public site after publish
            </label>
            <label className="flex items-center gap-3 text-sm font-medium">
              <input name="isFeatured" type="checkbox" defaultChecked={post?.isFeatured ?? false} />
              Featured article
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-black col-span-full">
            Excerpt
            <textarea
              name="excerpt"
              defaultValue={post?.excerpt ?? ""}
              rows={2}
              placeholder="Brief description shown in article listings…"
              className="border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40"
            />
          </label>
        </div>
      </section>

      {/* Cover Image */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Cover Image</h2>
        <label className="grid gap-2 text-sm font-medium text-black">
          Select from media library
          <select name="coverMediaId" defaultValue={post?.coverMediaId ?? ""} className="border border-black/15 px-3 py-3">
            <option value="">No cover image</option>
            {mediaAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>{asset.filename}</option>
            ))}
          </select>
        </label>
        {post?.coverImageUrl && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImageUrl} alt="Cover" className="h-40 w-auto rounded border border-black/10 object-cover" />
          </div>
        )}
      </section>

      {/* Tags */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Tags</h2>
        <TagsField name="tags" initialTags={safeArr<string>(post?.tags)} />
      </section>

      {/* Rich text content */}
      <section className="rounded-sm border border-black/10 bg-white">
        <div className="border-b border-black/10 px-6 py-4">
          <h2 className="text-xl font-semibold">Article Content</h2>
        </div>
        <EditorToolbar editor={editor!} onInsertImage={() => setShowImageDialog(true)} />
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none min-h-[400px] px-6 py-5 text-sm leading-relaxed outline-none [&_.ProseMirror]:min-h-[380px] [&_.ProseMirror]:outline-none [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-black/20 [&_.ProseMirror_td]:px-2 [&_.ProseMirror_td]:py-1 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-black/20 [&_.ProseMirror_th]:bg-[#f5f5f3] [&_.ProseMirror_th]:px-2 [&_.ProseMirror_th]:py-1 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-black/20 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-black/60 [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:bg-[#f5f5f3] [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-black/30 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
        />
      </section>

      {/* SEO */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">SEO</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-black">
            SEO title
            <input name="seoTitle" defaultValue={post?.seoTitle ?? ""} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-black">
            SEO description
            <input name="seoDescription" defaultValue={post?.seoDescription ?? ""} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-black col-span-full">
            OG image URL
            <input name="seoImage" defaultValue={post?.seoImage ?? ""} placeholder="https://…" className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </label>
        </div>
      </section>

      {showImageDialog && (
        <ImageDialog
          onInsert={insertImage}
          onClose={() => setShowImageDialog(false)}
          mediaAssets={mediaAssets}
        />
      )}

      <div className="sticky bottom-4 flex justify-end">
        <button className="rounded-sm bg-black px-8 py-4 text-sm font-semibold text-white shadow-xl transition hover:bg-black/80">
          Save Draft
        </button>
      </div>
    </form>
  );
}
