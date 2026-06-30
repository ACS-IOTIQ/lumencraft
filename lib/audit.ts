import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getRequestIp(): Promise<string | null> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return h.get("x-real-ip");
  } catch {
    return null;
  }
}

export async function logAudit(params: {
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  actionType: string;
  module: string;
  entityType?: string | null;
  entityId?: string | null;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        userEmail: params.userEmail ?? null,
        userName: params.userName ?? null,
        actionType: params.actionType,
        module: params.module,
        entityType: params.entityType ?? null,
        entityId: params.entityId ?? null,
        description: params.description,
        metadata: params.metadata ?? {},
        ipAddress: params.ipAddress ?? null,
      },
    });
  } catch (e) {
    console.error("[audit] Failed to write log:", e);
  }
}
