"use client";

import dynamic from "next/dynamic";
import type { BlogEditorProps } from "./BlogEditor";

const BlogEditor = dynamic(() => import("./BlogEditor"), { ssr: false });

export default function BlogEditorClient(props: BlogEditorProps) {
  return <BlogEditor {...props} />;
}
