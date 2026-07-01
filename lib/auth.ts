import type { AdminUser } from "@/lib/admin-types";
import type { UserRole } from "@/lib/permissions";
import { canAccessModule, type AdminModule } from "@/lib/permissions";

export type MockUser = AdminUser;

export const AUTH_STORAGE_KEY = "soluna-admin-session";

export const mockUsers: Array<AdminUser & { password: string }> = [
  { id: "1", name: "Administradora Soluna", email: "admin@soluna.com", password: "admin123", role: "ADMIN" },
  { id: "2", name: "Deposito Soluna", email: "stock@soluna.com", password: "stock123", role: "WAREHOUSE" },
  { id: "3", name: "Ventas Soluna", email: "ventas@soluna.com", password: "ventas123", role: "SELLER" }
];

export function authenticateMockUser(email: string, password: string): MockUser | null {
  const user = mockUsers.find((item) => item.email === email.trim().toLowerCase() && item.password === password);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function login(email: string, password: string) {
  const user = authenticateMockUser(email, password);
  if (!user || typeof window === "undefined") return null;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  if (typeof window !== "undefined") window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getCurrentUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as MockUser;
    if (!isValidAdminSession(parsed)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function isValidAdminSession(value: unknown): value is MockUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<MockUser>;
  return Boolean(
    user.id &&
      user.name &&
      user.email &&
      (user.role === "ADMIN" || user.role === "SELLER" || user.role === "WAREHOUSE")
  );
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}

export function hasPermission(module: AdminModule, role?: UserRole) {
  const currentRole = role ?? getCurrentUser()?.role;
  return currentRole ? canAccessModule(currentRole, module) : false;
}
