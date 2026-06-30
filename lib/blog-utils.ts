export function generateBlogReadingTime(content: unknown): number {
  if (!content || typeof content !== "object") return 1;

  function extractText(node: unknown): string {
    if (!node || typeof node !== "object") return "";
    const n = node as Record<string, unknown>;
    if (n.type === "text" && typeof n.text === "string") return n.text;
    if (Array.isArray(n.content)) {
      return (n.content as unknown[]).map(extractText).join(" ");
    }
    return "";
  }

  const text = extractText(content);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
