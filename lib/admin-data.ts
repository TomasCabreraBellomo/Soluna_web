import { products as publicProducts } from "@/data/store";
import type { AdminProduct, AdminUser, PaymentMethod, Sale, SaleItem, StockMovement, StockMovementType, StockStatus } from "@/lib/admin-types";

const PRODUCTS_KEY = "soluna-admin-products";
const MOVEMENTS_KEY = "soluna-admin-stock-movements";
const SALES_KEY = "soluna-admin-sales";

type ProductInput = Omit<AdminProduct, "id" | "slug" | "margin" | "createdAt" | "updatedAt">;

type StockActionInput = {
  productId: string;
  quantity: number;
  reason: string;
  notes?: string;
  user: AdminUser;
};

type AdjustStockInput = {
  productId: string;
  newStock: number;
  reason: string;
  notes?: string;
  user: AdminUser;
};

type SaleInput = {
  customerName?: string;
  customerWhatsapp?: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  paymentMethod: PaymentMethod;
  notes?: string;
  user: AdminUser;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(value));
}

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function calculateMargin(costPrice: number, salePrice: number) {
  if (!salePrice) return 0;
  return Math.round(((salePrice - costPrice) / salePrice) * 100);
}

function statusForStock(product: Pick<AdminProduct, "stock" | "minStock" | "status">) {
  if (product.stock <= 0) return "OUT_OF_STOCK";
  if (product.status === "OUT_OF_STOCK") return "ACTIVE";
  return product.status;
}

export function mapPublicProducts(): AdminProduct[] {
  return publicProducts.map((product) => ({
    id: product.id,
    sku: product.sku,
    internalCode: product.internalCode,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    collection: product.collection,
    costPrice: product.costPrice,
    salePrice: product.price,
    margin: product.margin,
    stock: product.stock,
    minStock: product.minStock,
    material: product.material,
    weight: product.weight,
    image: product.images[0],
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  }));
}

export function ensureAdminData() {
  if (!canUseStorage()) return;
  const existingProducts = readJson<AdminProduct[]>(PRODUCTS_KEY, []);
  if (existingProducts.length) return;
  const initialProducts = mapPublicProducts();
  const now = new Date().toISOString();
  const movements: StockMovement[] = initialProducts.map((product) => ({
    id: id("mov"),
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    type: "INITIAL_ENTRY",
    quantity: product.stock,
    previousStock: 0,
    newStock: product.stock,
    reason: "Entrada inicial",
    userId: "1",
    userName: "Administradora Soluna",
    notes: "Carga inicial mock",
    createdAt: now
  }));
  writeJson(PRODUCTS_KEY, initialProducts);
  writeJson(MOVEMENTS_KEY, movements);
  writeJson(SALES_KEY, []);
}

export function getProducts() {
  ensureAdminData();
  return readJson<AdminProduct[]>(PRODUCTS_KEY, []);
}

export function saveProducts(products: AdminProduct[]) {
  writeJson(PRODUCTS_KEY, products);
}

export function getProduct(productId: string) {
  return getProducts().find((product) => product.id === productId) ?? null;
}

export function createProduct(input: ProductInput, user: AdminUser) {
  const now = new Date().toISOString();
  const product: AdminProduct = {
    ...input,
    id: id("prod"),
    slug: slugify(input.name),
    margin: calculateMargin(input.costPrice, input.salePrice),
    status: input.stock <= 0 ? "OUT_OF_STOCK" : input.status,
    createdAt: now,
    updatedAt: now
  };
  saveProducts([product, ...getProducts()]);
  if (product.stock > 0) {
    addMovement({
      product,
      type: "INITIAL_ENTRY",
      quantity: product.stock,
      previousStock: 0,
      newStock: product.stock,
      reason: "Entrada inicial",
      user,
      notes: "Producto creado"
    });
  }
  return product;
}

export function updateProduct(productId: string, data: Partial<Omit<AdminProduct, "id" | "stock" | "createdAt">>) {
  let updated: AdminProduct | null = null;
  const products = getProducts().map((product) => {
    if (product.id !== productId) return product;
    updated = {
      ...product,
      ...data,
      slug: data.name ? slugify(data.name) : product.slug,
      margin: calculateMargin(data.costPrice ?? product.costPrice, data.salePrice ?? product.salePrice),
      updatedAt: new Date().toISOString()
    };
    return updated;
  });
  saveProducts(products);
  return updated;
}

export function deleteProduct(productId: string) {
  saveProducts(getProducts().filter((product) => product.id !== productId));
}

export function getStockMovements() {
  ensureAdminData();
  return readJson<StockMovement[]>(MOVEMENTS_KEY, []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function saveMovements(movements: StockMovement[]) {
  writeJson(MOVEMENTS_KEY, movements);
}

function addMovement({
  product,
  type,
  quantity,
  previousStock,
  newStock,
  reason,
  user,
  notes
}: {
  product: AdminProduct;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  user: AdminUser;
  notes?: string;
}) {
  const movement: StockMovement = {
    id: id("mov"),
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    type,
    quantity,
    previousStock,
    newStock,
    reason,
    userId: user.id,
    userName: user.name,
    notes,
    createdAt: new Date().toISOString()
  };
  saveMovements([movement, ...getStockMovements()]);
  return movement;
}

function changeStock(productId: string, newStock: number) {
  let updated: AdminProduct | null = null;
  const products = getProducts().map((product) => {
    if (product.id !== productId) return product;
    updated = { ...product, stock: newStock, status: statusForStock({ ...product, stock: newStock }), updatedAt: new Date().toISOString() };
    return updated;
  });
  saveProducts(products);
  return updated;
}

export function registerStockEntry(input: StockActionInput) {
  if (!input.productId) throw new Error("Debe seleccionarse un producto.");
  if (input.quantity <= 0) throw new Error("La cantidad debe ser mayor a 0.");
  const product = getProduct(input.productId);
  if (!product) throw new Error("Producto no encontrado.");
  const previousStock = product.stock;
  const newStock = previousStock + input.quantity;
  const updated = changeStock(product.id, newStock) ?? product;
  addMovement({ product: updated, type: "ENTRY", quantity: input.quantity, previousStock, newStock, reason: input.reason, user: input.user, notes: input.notes });
  return updated;
}

export function registerStockExit(input: StockActionInput) {
  if (!input.productId) throw new Error("Debe seleccionarse un producto.");
  if (input.quantity <= 0) throw new Error("La cantidad debe ser mayor a 0.");
  const product = getProduct(input.productId);
  if (!product) throw new Error("Producto no encontrado.");
  if (input.quantity > product.stock) throw new Error("No hay stock suficiente para completar esta salida.");
  const previousStock = product.stock;
  const newStock = previousStock - input.quantity;
  const updated = changeStock(product.id, newStock) ?? product;
  addMovement({ product: updated, type: "EXIT", quantity: -input.quantity, previousStock, newStock, reason: input.reason, user: input.user, notes: input.notes });
  return updated;
}

export function adjustStock(input: AdjustStockInput) {
  if (!input.productId) throw new Error("Debe seleccionarse un producto.");
  if (input.newStock < 0) throw new Error("El stock no puede ser negativo.");
  if (!input.reason.trim()) throw new Error("El motivo es obligatorio.");
  const product = getProduct(input.productId);
  if (!product) throw new Error("Producto no encontrado.");
  const previousStock = product.stock;
  const diff = input.newStock - previousStock;
  if (diff === 0) throw new Error("El nuevo stock debe ser distinto al stock actual.");
  const updated = changeStock(product.id, input.newStock) ?? product;
  addMovement({
    product: updated,
    type: diff > 0 ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
    quantity: diff,
    previousStock,
    newStock: input.newStock,
    reason: input.reason,
    user: input.user,
    notes: input.notes
  });
  return updated;
}

export function getStockStatus(product: Pick<AdminProduct, "stock" | "minStock">): StockStatus {
  if (product.stock <= 0) return "Sin stock";
  if (product.stock <= product.minStock) return "Stock bajo";
  return "Disponible";
}

export function getSales() {
  ensureAdminData();
  return readJson<Sale[]>(SALES_KEY, []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function saveSales(sales: Sale[]) {
  writeJson(SALES_KEY, sales);
}

export function createSale(input: SaleInput) {
  if (!input.items.length) throw new Error("Debe haber al menos un producto.");
  if (!input.paymentMethod) throw new Error("El metodo de pago es obligatorio.");
  const products = getProducts();
  const saleItems: SaleItem[] = input.items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) throw new Error("Producto no encontrado.");
    if (item.quantity <= 0) throw new Error("Cada cantidad debe ser mayor a 0.");
    if (item.quantity > product.stock) throw new Error("No hay stock suficiente para completar esta venta.");
    return {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.quantity * item.unitPrice
    };
  });
  const sale: Sale = {
    id: id("sale"),
    customerName: input.customerName,
    customerWhatsapp: input.customerWhatsapp,
    items: saleItems,
    paymentMethod: input.paymentMethod,
    total: saleItems.reduce((total, item) => total + item.subtotal, 0),
    notes: input.notes,
    userId: input.user.id,
    userName: input.user.name,
    createdAt: new Date().toISOString()
  };
  for (const item of saleItems) {
    const product = getProduct(item.productId);
    if (!product) throw new Error("Producto no encontrado.");
    const previousStock = product.stock;
    const newStock = previousStock - item.quantity;
    const updated = changeStock(product.id, newStock) ?? product;
    addMovement({
      product: updated,
      type: "SALE",
      quantity: -item.quantity,
      previousStock,
      newStock,
      reason: `Venta ${sale.id}`,
      user: input.user,
      notes: input.notes
    });
  }
  saveSales([sale, ...getSales()]);
  return sale;
}
