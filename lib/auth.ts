import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolvePermissions, type Permissions } from "@/lib/rbac";

const cookieName = "lumencraft_admin";
const maxAgeSeconds = 60 * 60 * 8;

function getAuthSecret() {
  return process.env.AUTH_SECRET || "dev-only-change-this-secret";
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function encodeSession(userId: string) {
  const payload = JSON.stringify({
    userId,
    nonce: randomBytes(12).toString("base64url"),
    exp: Date.now() + maxAgeSeconds * 1000,
  });
  const body = Buffer.from(payload).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodeSession(token: string | undefined) {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      userId: string;
      exp: number;
    };
    if (!payload.userId || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export type AdminSessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: Permissions;
  isActive: boolean;
};

export async function getAdminSession(): Promise<AdminSessionUser | null> {
  const token = (await cookies()).get(cookieName)?.value;
  const payload = decodeSession(token);
  if (!payload) return null;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, permissions: true, isActive: true },
    });
    if (!user || !user.isActive) return null;

    // Auto-upgrade bootstrap admin that still has default role after migration
    let role = user.role;
    if (user.email === process.env.ADMIN_EMAIL && role !== "super_admin") {
      await prisma.adminUser.update({ where: { id: user.id }, data: { role: "super_admin" } });
      role = "super_admin";
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      permissions: resolvePermissions(role, user.permissions),
      isActive: user.isActive,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSessionUser> {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requirePermission(permission: keyof Permissions): Promise<AdminSessionUser> {
  const admin = await requireAdmin();
  if (!admin.permissions[permission]) redirect("/admin?error=forbidden");
  return admin;
}

export async function ensureBootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== "super_admin") {
      await prisma.adminUser.update({
        where: { id: existing.id },
        data: { role: "super_admin" },
      });
    }
    return;
  }

  await prisma.adminUser.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "super_admin",
    },
  });
}

export async function createAdminSession(userId: string) {
  await prisma.adminUser.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });

  (await cookies()).set(cookieName, encodeSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAgeSeconds,
    path: "/",
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(cookieName);
}
