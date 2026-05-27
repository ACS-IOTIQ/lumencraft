"use client";

import { useState } from "react";

export default function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="shrink-0 border border-black/15 px-3 py-1 text-xs font-semibold transition hover:bg-black/5"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
