export const ROLES = ["super_admin", "admin", "content_manager", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  content_manager: "Content Manager",
  editor: "Editor",
  viewer: "Viewer",
};

export const ROLE_COLORS: Record<Role, string> = {
  super_admin: "bg-black text-white",
  admin: "bg-black/75 text-white",
  content_manager: "bg-blue-100 text-blue-800",
  editor: "bg-amber-100 text-amber-800",
  viewer: "bg-black/5 text-black/50",
};

export type Permissions = {
  products: boolean;
  blog: boolean;
  media: boolean;
  homepage: boolean;
  users: boolean;
  publish: boolean;
};

export const PERMISSION_LABELS: Record<keyof Permissions, string> = {
  products: "Products Management",
  blog: "Blog / Resources",
  media: "Media Management",
  homepage: "Homepage Management",
  users: "User Management",
  publish: "Publish Permissions",
};

export const ROLE_DEFAULT_PERMISSIONS: Record<Role, Permissions> = {
  super_admin: { products: true, blog: true, media: true, homepage: true, users: true, publish: true },
  admin: { products: true, blog: true, media: true, homepage: true, users: true, publish: true },
  content_manager: { products: true, blog: true, media: true, homepage: true, users: false, publish: false },
  editor: { products: false, blog: true, media: true, homepage: false, users: false, publish: false },
  viewer: { products: false, blog: false, media: false, homepage: false, users: false, publish: false },
};

export function resolvePermissions(role: string, stored: unknown): Permissions {
  const r: Role = ROLES.includes(role as Role) ? (role as Role) : "viewer";
  const defaults = ROLE_DEFAULT_PERMISSIONS[r];
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    const s = stored as Record<string, unknown>;
    if (Object.keys(s).length >= 6) {
      return {
        products: Boolean(s.products),
        blog: Boolean(s.blog),
        media: Boolean(s.media),
        homepage: Boolean(s.homepage),
        users: Boolean(s.users),
        publish: Boolean(s.publish),
      };
    }
  }
  return defaults;
}
