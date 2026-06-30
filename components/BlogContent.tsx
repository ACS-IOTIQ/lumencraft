"use client";

import { useEffect, useState } from "react";

interface BlogContentProps {
  content: Record<string, unknown>;
}

function renderNode(node: unknown, key: string | number): React.ReactNode {
  if (!node || typeof node !== "object") return null;
  const n = node as Record<string, unknown>;
  const children = Array.isArray(n.content)
    ? (n.content as unknown[]).map((child, i) => renderNode(child, `${key}-${i}`))
    : null;

  const marks = (n.marks as { type: string; attrs?: Record<string, unknown> }[] | undefined) ?? [];
  function wrapMarks(el: React.ReactNode): React.ReactNode {
    let result = el;
    for (const mark of marks) {
      if (mark.type === "bold") result = <strong key={`b-${key}`}>{result}</strong>;
      else if (mark.type === "italic") result = <em key={`i-${key}`}>{result}</em>;
      else if (mark.type === "underline") result = <u key={`u-${key}`}>{result}</u>;
      else if (mark.type === "strike") result = <s key={`s-${key}`}>{result}</s>;
      else if (mark.type === "code") result = <code key={`c-${key}`} className="rounded bg-[#f5f5f3] px-1.5 py-0.5 font-mono text-[0.85em]">{result}</code>;
      else if (mark.type === "link") result = <a key={`l-${key}`} href={String(mark.attrs?.href ?? "#")} target="_blank" rel="noopener noreferrer" className="text-[#3b6ff0] underline hover:text-[#2a5de0]">{result}</a>;
    }
    return result;
  }

  const textAlign = (n.attrs as Record<string, unknown> | undefined)?.textAlign as string | undefined;
  const alignClass = textAlign === "center" ? "text-center" : textAlign === "right" ? "text-right" : "";

  switch (n.type) {
    case "doc":
      return <>{children}</>;
    case "paragraph":
      return <p key={key} className={`mb-4 ${alignClass}`}>{children ?? <br />}</p>;
    case "text":
      return wrapMarks(<span key={key}>{n.text as string}</span>);
    case "hardBreak":
      return <br key={key} />;
    case "horizontalRule":
      return <hr key={key} className="my-8 border-[#e8e8e5]" />;
    case "heading": {
      const level = (n.attrs as Record<string, unknown> | undefined)?.level as number | undefined;
      const cls = `font-semibold tracking-[-0.02em] text-black ${alignClass} ${
        level === 1 ? "mb-6 mt-10 text-3xl" :
        level === 2 ? "mb-5 mt-9 text-2xl" :
        level === 3 ? "mb-4 mt-8 text-xl" :
        level === 4 ? "mb-3 mt-6 text-lg" :
        "mb-3 mt-5 text-base"
      }`;
      if (level === 1) return <h1 key={key} className={cls}>{children}</h1>;
      if (level === 2) return <h2 key={key} className={cls}>{children}</h2>;
      if (level === 3) return <h3 key={key} className={cls}>{children}</h3>;
      if (level === 4) return <h4 key={key} className={cls}>{children}</h4>;
      return <h5 key={key} className={cls}>{children}</h5>;
    }
    case "bulletList":
      return <ul key={key} className="mb-4 list-disc pl-6 space-y-1">{children}</ul>;
    case "orderedList":
      return <ol key={key} className="mb-4 list-decimal pl-6 space-y-1">{children}</ol>;
    case "listItem":
      return <li key={key} className="text-[15px] leading-[1.7] text-[#3a3a38]">{children}</li>;
    case "blockquote":
      return (
        <blockquote key={key} className="my-6 border-l-4 border-[#3b6ff0] pl-5 italic text-[#3a3a38]">
          {children}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre key={key} className="my-6 overflow-x-auto rounded-sm bg-[#f5f5f3] p-5 text-sm">
          <code className="font-mono">{children}</code>
        </pre>
      );
    case "image": {
      const attrs = n.attrs as { src?: string; alt?: string; title?: string } | undefined;
      return (
        <figure key={key} className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={attrs?.src ?? ""}
            alt={attrs?.alt ?? ""}
            className="max-w-full rounded-sm border border-[#e8e8e5]"
          />
          {attrs?.title && (
            <figcaption className="mt-2 text-center text-xs text-[#888884]">{attrs.title}</figcaption>
          )}
        </figure>
      );
    }
    case "table":
      return (
        <div key={key} className="my-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-[#e8e8e5]">{children}</table>
        </div>
      );
    case "tableRow":
      return <tr key={key}>{children}</tr>;
    case "tableHeader":
      return (
        <th key={key} className="border border-[#e8e8e5] bg-[#f5f5f3] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#888884]">
          {children}
        </th>
      );
    case "tableCell":
      return <td key={key} className="border border-[#e8e8e5] px-4 py-3 text-sm text-[#3a3a38]">{children}</td>;
    default:
      return <span key={key}>{children}</span>;
  }
}

export default function BlogContent({ content }: BlogContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[200px] animate-pulse space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`h-4 rounded bg-[#f5f5f3] ${i % 3 === 2 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>
    );
  }

  if (!content || typeof content !== "object" || !("type" in content)) {
    return <p className="text-[#888884]">No content.</p>;
  }

  return (
    <div className="blog-content text-[15px] leading-[1.8] text-[#3a3a38]">
      {renderNode(content, "root")}
    </div>
  );
}
