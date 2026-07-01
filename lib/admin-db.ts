import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AdminProduct, AdminUser, PaymentMethod, Sale, StockMovement, StockMovementType, StockStatus } from "@/lib/admin-types";

type ProductInput = Omit<AdminProduct, "id" | "slug" | "margin" | "createdAt" | "updatedAt">;

const productInclude = {
  category: true,
  subcategory: true,
  collection: true,
  images: { orderBy: { position: "asc" as const }, take: 1 }
};

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

function mapProduct(product: Prisma.ProductGetPayload<{ include: typeof productInclude }>): AdminProduct {
  return {
    id: product.id,
    sku: product.sku,
    internalCode: product.internalCode,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category.name,
    subcategory: product.subcategory?.name,
    collection: product.collection?.name,
    costPrice: Number(product.costPrice),
    salePrice: Number(product.salePrice),
    margin: Number(product.margin),
    stock: product.stock,
    minStock: product.minStock,
    material: product.material ?? undefined,
    weight: product.weight ?? undefined,
    image: product.images[0]?.url,
    status: product.status,
    notes: product.notes ?? undefined,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

async function ensureUser(user: AdminUser) {
  return prisma.user.upsert({
    where: { id: user.id },
    update: { name: user.name, email: user.email, role: user.role },
    create: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}

async function ensureTaxonomy(input: Pick<ProductInput, "category" | "subcategory" | "collection">) {
  const category = await prisma.category.upsert({
    where: { slug: slugify(input.category) },
    update: { name: input.category },
    create: { name: input.category, slug: slugify(input.category) }
  });
  const subcategory = input.subcategory
    ? await prisma.subcategory.upsert({
        where: { slug: slugify(input.subcategory) },
        update: { name: input.subcategory, categoryId: category.id },
        create: { name: input.subcategory, slug: slugify(input.subcategory), categoryId: category.id }
      })
    : null;
  const collection = input.collection
    ? await prisma.collection.upsert({
        where: { slug: slugify(input.collection) },
        update: { name: input.collection },
        create: { name: input.collection, slug: slugify(input.collection), active: true }
      })
    : null;
  return { category, subcategory, collection };
}

export async function getProducts() {
  const products = await prisma.product.findMany({ include: productInclude, orderBy: { updatedAt: "desc" } });
  return products.map(mapProduct);
}

export async function getProduct(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId }, include: productInclude });
  return product ? mapProduct(product) : null;
}

export async function createProduct(input: ProductInput, user: AdminUser) {
  const { category, subcategory, collection } = await ensureTaxonomy(input);
  const margin = calculateMargin(input.costPrice, input.salePrice);
  const product = await prisma.product.create({
    data: {
      sku: input.sku,
      internalCode: input.internalCode,
      name: input.name,
      slug: slugify(input.name),
      description: input.description,
      material: input.material,
      weight: input.weight,
      notes: input.notes,
      categoryId: category.id,
      subcategoryId: subcategory?.id,
      collectionId: collection?.id,
      costPrice: input.costPrice,
      salePrice: input.salePrice,
      margin,
      stock: input.stock,
      minStock: input.minStock,
      status: input.stock <= 0 ? "OUT_OF_STOCK" : input.status,
      images: input.image ? { create: { url: input.image, alt: input.name, position: 0 } } : undefined
    },
    include: productInclude
  });
  if (product.stock > 0) {
    await addMovement({ product: mapProduct(product), type: "INITIAL_ENTRY", quantity: product.stock, previousStock: 0, newStock: product.stock, reason: "Entrada inicial", user, notes: "Producto creado" });
  }
  return mapProduct(product);
}

export async function updateProduct(productId: string, data: Partial<Omit<AdminProduct, "id" | "stock" | "createdAt">>) {
  const current = await prisma.product.findUnique({ where: { id: productId }, include: productInclude });
  if (!current) return null;
  const taxonomy = data.category ? await ensureTaxonomy({ category: data.category, subcategory: data.subcategory, collection: data.collection }) : null;
  await prisma.productImage.deleteMany({ where: { productId } });
  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      sku: data.sku,
      internalCode: data.internalCode,
      name: data.name,
      slug: data.name ? slugify(data.name) : undefined,
      description: data.description,
      material: data.material,
      weight: data.weight,
      notes: data.notes,
      categoryId: taxonomy?.category.id,
      subcategoryId: taxonomy?.subcategory?.id,
      collectionId: taxonomy?.collection?.id,
      costPrice: data.costPrice,
      salePrice: data.salePrice,
      margin: data.costPrice || data.salePrice ? calculateMargin(data.costPrice ?? Number(current.costPrice), data.salePrice ?? Number(current.salePrice)) : undefined,
      minStock: data.minStock,
      status: data.status,
      images: data.image ? { create: { url: data.image, alt: data.name ?? current.name, position: 0 } } : undefined
    },
    include: productInclude
  });
  return mapProduct(product);
}

export async function deleteProduct(productId: string) {
  await prisma.product.delete({ where: { id: productId } });
}

export async function getStockMovements() {
  const movements = await prisma.stockMovement.findMany({ include: { product: true, user: true }, orderBy: { createdAt: "desc" } });
  return movements.map((movement): StockMovement => ({
    id: movement.id,
    productId: movement.productId,
    productName: movement.product.name,
    sku: movement.product.sku,
    type: movement.type,
    quantity: movement.quantity,
    previousStock: movement.previousStock,
    newStock: movement.newStock,
    reason: movement.reason,
    userId: movement.userId,
    userName: movement.user.name,
    notes: movement.notes ?? undefined,
    createdAt: movement.createdAt.toISOString()
  }));
}

async function addMovement(input: { product: AdminProduct; type: StockMovementType; quantity: number; previousStock: number; newStock: number; reason: string; user: AdminUser; notes?: string }) {
  const user = await ensureUser(input.user);
  return prisma.stockMovement.create({
    data: {
      productId: input.product.id,
      type: input.type,
      quantity: input.quantity,
      previousStock: input.previousStock,
      newStock: input.newStock,
      reason: input.reason,
      userId: user.id,
      notes: input.notes
    }
  });
}

function statusForStock(stock: number, status: AdminProduct["status"]) {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (status === "OUT_OF_STOCK") return "ACTIVE";
  return status;
}

async function changeStock(productId: string, newStock: number) {
  const current = await prisma.product.findUnique({ where: { id: productId }, include: productInclude });
  if (!current) return null;
  const product = await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock, status: statusForStock(newStock, current.status) },
    include: productInclude
  });
  return { previous: mapProduct(current), updated: mapProduct(product) };
}

export async function registerStockEntry(input: { productId: string; quantity: number; reason: string; notes?: string; user: AdminUser }) {
  if (!input.productId) throw new Error("Debe seleccionarse un producto.");
  if (input.quantity <= 0) throw new Error("La cantidad debe ser mayor a 0.");
  const product = await getProduct(input.productId);
  if (!product) throw new Error("Producto no encontrado.");
  const newStock = product.stock + input.quantity;
  const changed = await changeStock(product.id, newStock);
  const updated = changed?.updated ?? product;
  await addMovement({ product: updated, type: "ENTRY", quantity: input.quantity, previousStock: product.stock, newStock, reason: input.reason, user: input.user, notes: input.notes });
  return updated;
}

export async function registerStockExit(input: { productId: string; quantity: number; reason: string; notes?: string; user: AdminUser }) {
  if (!input.productId) throw new Error("Debe seleccionarse un producto.");
  if (input.quantity <= 0) throw new Error("La cantidad debe ser mayor a 0.");
  const product = await getProduct(input.productId);
  if (!product) throw new Error("Producto no encontrado.");
  if (input.quantity > product.stock) throw new Error("No hay stock suficiente para completar esta salida.");
  const newStock = product.stock - input.quantity;
  const changed = await changeStock(product.id, newStock);
  const updated = changed?.updated ?? product;
  await addMovement({ product: updated, type: "EXIT", quantity: -input.quantity, previousStock: product.stock, newStock, reason: input.reason, user: input.user, notes: input.notes });
  return updated;
}

export async function adjustStock(input: { productId: string; newStock: number; reason: string; notes?: string; user: AdminUser }) {
  if (!input.productId) throw new Error("Debe seleccionarse un producto.");
  if (input.newStock < 0) throw new Error("El stock no puede ser negativo.");
  if (!input.reason.trim()) throw new Error("El motivo es obligatorio.");
  const product = await getProduct(input.productId);
  if (!product) throw new Error("Producto no encontrado.");
  const diff = input.newStock - product.stock;
  if (diff === 0) throw new Error("El nuevo stock debe ser distinto al stock actual.");
  const changed = await changeStock(product.id, input.newStock);
  const updated = changed?.updated ?? product;
  await addMovement({ product: updated, type: diff > 0 ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT", quantity: diff, previousStock: product.stock, newStock: input.newStock, reason: input.reason, user: input.user, notes: input.notes });
  return updated;
}

export function getStockStatus(product: Pick<AdminProduct, "stock" | "minStock">): StockStatus {
  if (product.stock <= 0) return "Sin stock";
  if (product.stock <= product.minStock) return "Stock bajo";
  return "Disponible";
}

export async function getSales() {
  const orders = await prisma.order.findMany({ include: { customer: true, items: { include: { product: true } } }, orderBy: { createdAt: "desc" } });
  return orders.map((order): Sale => ({
    id: order.number,
    customerName: order.customer.name,
    customerWhatsapp: order.customer.whatsapp ?? undefined,
    paymentMethod: order.paymentMethod,
    total: Number(order.total),
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      unitPrice: Number(item.price),
      subtotal: item.quantity * Number(item.price)
    })),
    userId: "1",
    userName: "Sistema",
    createdAt: order.createdAt.toISOString()
  }));
}

export async function getCustomers() {
  const customers = await prisma.customer.findMany({
    include: { orders: true, favorites: true },
    orderBy: { createdAt: "desc" }
  });
  return customers.map((customer) => ({
    name: customer.name,
    email: customer.email ?? "-",
    whatsapp: customer.whatsapp ?? "-",
    birthday: customer.birthday ? customer.birthday.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }) : "-",
    orders: customer.orders.length,
    favoriteProducts: customer.favorites.length,
    registeredAt: customer.createdAt.toISOString().slice(0, 10)
  }));
}

export async function getOrders() {
  const orders = await prisma.order.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" } });
  const statusLabels = {
    PENDING: "Pendiente",
    PAID: "Pagado",
    PREPARING: "Preparando",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado"
  } as const;
  const paymentLabels = {
    CASH: "Efectivo",
    TRANSFER: "Transferencia",
    MERCADO_PAGO: "Mercado Pago"
  } as const;
  return orders.map((order) => ({
    id: order.number,
    customer: order.customer.name,
    total: Number(order.total),
    status: statusLabels[order.status],
    payment: paymentLabels[order.paymentMethod],
    date: order.createdAt.toISOString().slice(0, 10)
  }));
}

export async function createSale(input: { customerName?: string; customerWhatsapp?: string; items: Array<{ productId: string; quantity: number; unitPrice: number }>; paymentMethod: PaymentMethod; notes?: string; user: AdminUser }) {
  if (!input.items.length) throw new Error("Debe haber al menos un producto.");
  await ensureUser(input.user);
  const customer = await prisma.customer.create({
    data: { name: input.customerName || "Cliente mostrador", whatsapp: input.customerWhatsapp || null, addresses: [] }
  });
  const products = await getProducts();
  const items = input.items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) throw new Error("Producto no encontrado.");
    if (item.quantity <= 0) throw new Error("Cada cantidad debe ser mayor a 0.");
    if (item.quantity > product.stock) throw new Error("No hay stock suficiente para completar esta venta.");
    return { product, quantity: item.quantity, unitPrice: item.unitPrice, subtotal: item.quantity * item.unitPrice };
  });
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const number = `SOL-${Date.now().toString().slice(-6)}`;
  const order = await prisma.order.create({
    data: {
      number,
      customerId: customer.id,
      status: "PAID",
      paymentMethod: input.paymentMethod,
      shippingAddress: "Venta manual",
      total,
      items: { create: items.map((item) => ({ productId: item.product.id, quantity: item.quantity, price: item.unitPrice })) }
    }
  });
  for (const item of items) {
    await registerStockExit({ productId: item.product.id, quantity: item.quantity, reason: `Venta ${number}`, notes: input.notes, user: input.user });
  }
  await prisma.cashMovement.create({ data: { type: "INCOME", amount: total, method: input.paymentMethod, userId: input.user.id, notes: `Venta ${number}` } });
  return { ...(await getSales()).find((sale) => sale.id === order.number)! };
}
