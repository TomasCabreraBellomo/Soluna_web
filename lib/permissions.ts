export type UserRole = "ADMIN" | "SELLER" | "WAREHOUSE";

export type AdminModule =
  | "dashboard"
  | "productos"
  | "stock"
  | "ventas"
  | "pedidos"
  | "clientes"
  | "reportes"
  | "colecciones"
  | "usuarios"
  | "caja";

const rolePermissions: Record<UserRole, AdminModule[]> = {
  ADMIN: ["dashboard", "productos", "stock", "ventas", "pedidos", "clientes", "reportes", "colecciones", "usuarios", "caja"],
  SELLER: ["dashboard", "ventas", "pedidos", "clientes"],
  WAREHOUSE: ["dashboard", "productos", "stock"]
};

export function canAccessModule(role: UserRole, module: AdminModule) {
  return rolePermissions[role].includes(module);
}

export function getModulesForRole(role: UserRole) {
  return rolePermissions[role];
}
