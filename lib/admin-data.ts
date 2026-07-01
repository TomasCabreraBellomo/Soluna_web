import type { AdminProduct, AdminUser, PaymentMethod, Sale, StockMovement, StockStatus } from "@/lib/admin-types";

type ProductInput = Omit<AdminProduct, "id" | "slug" | "margin" | "createdAt" | "updatedAt">;

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo completar la accion.");
  }
  return response.json() as Promise<T>;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getProducts() {
  return requestJson<AdminProduct[]>("/api/admin/products");
}

export async function getProduct(productId: string) {
  return requestJson<AdminProduct>(`/api/admin/products/${productId}`).catch(() => null);
}

export async function createProduct(input: ProductInput, user: AdminUser) {
  return requestJson<AdminProduct>("/api/admin/products", {
    method: "POST",
    body: JSON.stringify({ product: input, user })
  });
}

export async function updateProduct(productId: string, data: Partial<Omit<AdminProduct, "id" | "stock" | "createdAt">>) {
  return requestJson<AdminProduct>(`/api/admin/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export async function deleteProduct(productId: string) {
  return requestJson<{ ok: true }>(`/api/admin/products/${productId}`, { method: "DELETE" });
}

export async function getStockMovements() {
  return requestJson<StockMovement[]>("/api/admin/stock/movements");
}

export async function registerStockEntry(input: { productId: string; quantity: number; reason: string; notes?: string; user: AdminUser }) {
  return requestJson<AdminProduct>("/api/admin/stock/entry", { method: "POST", body: JSON.stringify(input) });
}

export async function registerStockExit(input: { productId: string; quantity: number; reason: string; notes?: string; user: AdminUser }) {
  return requestJson<AdminProduct>("/api/admin/stock/exit", { method: "POST", body: JSON.stringify(input) });
}

export async function adjustStock(input: { productId: string; newStock: number; reason: string; notes?: string; user: AdminUser }) {
  return requestJson<AdminProduct>("/api/admin/stock/adjust", { method: "POST", body: JSON.stringify(input) });
}

export function getStockStatus(product: Pick<AdminProduct, "stock" | "minStock">): StockStatus {
  if (product.stock <= 0) return "Sin stock";
  if (product.stock <= product.minStock) return "Stock bajo";
  return "Disponible";
}

export async function getSales() {
  return requestJson<Sale[]>("/api/admin/sales");
}

export async function createSale(input: {
  customerName?: string;
  customerWhatsapp?: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  paymentMethod: PaymentMethod;
  notes?: string;
  user: AdminUser;
}) {
  return requestJson<Sale>("/api/admin/sales", { method: "POST", body: JSON.stringify(input) });
}
