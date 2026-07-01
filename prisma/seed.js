const { PrismaClient } = require("@prisma/client");
const jiti = require("jiti")(__filename);

const { products, categories, collections, customers, orders, stockMovements, cashMovements } = jiti("../data/store.ts");

const prisma = new PrismaClient();

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const paymentMap = {
  "Mercado Pago": "MERCADO_PAGO",
  Transferencia: "TRANSFER",
  Efectivo: "CASH"
};

const statusMap = {
  Preparando: "PREPARING",
  Pagado: "PAID",
  Enviado: "SHIPPED",
  Entregado: "DELIVERED",
  Cancelado: "CANCELLED",
  Pendiente: "PENDING"
};

async function main() {
  await prisma.cashMovement.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: { id: "1", name: "Administradora Soluna", email: "admin@soluna.local", role: "ADMIN" }
  });
  const seller = await prisma.user.create({
    data: { id: "2", name: "Vendedora", email: "ventas@soluna.local", role: "SELLER" }
  });
  const warehouse = await prisma.user.create({
    data: { id: "3", name: "Deposito", email: "deposito@soluna.local", role: "WAREHOUSE" }
  });
  const usersByName = new Map([
    ["Admin Soluna", admin],
    ["Administradora Soluna", admin],
    ["Vendedora", seller],
    ["Deposito", warehouse]
  ]);

  for (const category of categories) {
    await prisma.category.create({
      data: { name: category.name, slug: category.slug, description: category.description }
    });
  }

  for (const collection of collections) {
    await prisma.collection.create({
      data: {
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        image: collection.image,
        active: collection.active
      }
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: product.category } });
    const subcategorySlug = slugify(product.subcategory || category.name);
    const subcategory = await prisma.subcategory.upsert({
      where: { slug: subcategorySlug },
      update: {},
      create: { name: product.subcategory || category.name, slug: subcategorySlug, categoryId: category.id }
    });
    const collection = product.collection
      ? await prisma.collection.upsert({
          where: { slug: slugify(product.collection) },
          update: {},
          create: { name: product.collection, slug: slugify(product.collection), active: true }
        })
      : null;

    await prisma.product.create({
      data: {
        id: product.id,
        sku: product.sku,
        internalCode: product.internalCode,
        name: product.name,
        slug: product.slug,
        description: product.description,
        material: product.material,
        tipo: product.tipo,
        cuotas: product.cuotas,
        badge: product.badge,
        isBestSeller: Boolean(product.isBestSeller),
        isNew: Boolean(product.isNew),
        isFavorite: Boolean(product.isFavorite),
        categoryId: category.id,
        subcategoryId: subcategory.id,
        collectionId: collection ? collection.id : null,
        costPrice: product.costPrice,
        salePrice: product.price,
        margin: product.margin,
        weight: product.weight,
        stock: product.stock,
        minStock: product.minStock,
        status: product.status,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
        images: {
          create: product.images.map((url, position) => ({ url, alt: product.name, position }))
        }
      }
    });
  }

  for (const customer of customers) {
    await prisma.customer.create({
      data: {
        name: customer.name,
        email: customer.email,
        whatsapp: customer.whatsapp,
        birthday: customer.birthday ? new Date(`2026/${customer.birthday.split("/").reverse().join("/")}`) : null,
        addresses: []
      }
    });
  }

  for (const order of orders) {
    const customer = await prisma.customer.upsert({
      where: { email: `${slugify(order.customer)}@example.com` },
      update: {},
      create: { name: order.customer, email: `${slugify(order.customer)}@example.com`, addresses: [] }
    });
    const firstProduct = products[0];
    await prisma.order.create({
      data: {
        number: order.id,
        customerId: customer.id,
        status: statusMap[order.status] || "PENDING",
        paymentMethod: paymentMap[order.payment] || "TRANSFER",
        shippingAddress: "A coordinar por WhatsApp",
        total: order.total,
        createdAt: new Date(order.date),
        updatedAt: new Date(order.date),
        items: {
          create: {
            productId: firstProduct.id,
            quantity: 1,
            price: order.total
          }
        }
      }
    });
  }

  for (const movement of stockMovements) {
    const product = await prisma.product.findUnique({ where: { sku: movement.sku } });
    if (!product) continue;
    const type = movement.type === "Entrada" ? "ENTRY" : movement.type === "Venta" ? "SALE" : movement.type === "Salida" ? "EXIT" : movement.type === "Devolucion" ? "RETURN" : "ADJUSTMENT_IN";
    const quantity = Number(movement.quantity);
    const previousStock = Math.max(0, product.stock - quantity);
    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        type,
        quantity,
        previousStock,
        newStock: product.stock,
        reason: movement.reason,
        userId: (usersByName.get(movement.user) || admin).id,
        notes: movement.notes,
        createdAt: new Date(movement.date)
      }
    });
  }

  for (const movement of cashMovements) {
    await prisma.cashMovement.create({
      data: {
        type: movement.type === "Ingreso" ? "INCOME" : "EXPENSE",
        amount: movement.amount,
        method: paymentMap[movement.method] || "TRANSFER",
        userId: (usersByName.get(movement.user) || admin).id,
        notes: movement.notes,
        createdAt: new Date(movement.date)
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
