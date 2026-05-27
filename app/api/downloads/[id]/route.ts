import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDownloadUrl } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const download = await prisma.productDownload.findUnique({
    where: { id },
    include: { media: true },
  });

  if (!download) {
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
  }

  const url = await createDownloadUrl({
    key: download.media.key,
    filename: download.media.filename,
    contentType: download.media.contentType,
  });

  return NextResponse.redirect(url);
}
