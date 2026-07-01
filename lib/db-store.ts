import { prisma } from "@/lib/prisma";
import type { Category, Collection, Product } from "@/data/store";

type ProductWithRelations = Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
  category: { name: string; slug: string };
  subcategory: { name: string; slug: string } | null;
  collection: { name: string; slug: string } | null;
  images: { url: string; alt: string | null; position: number }[];
};

export function mapDbProduct(product: ProductWithRelations): Product {
  return {
    id: product.id,
    sku: product.sku,
    internalCode: product.internalCode,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category.slug as Product["category"],
    subcategory: product.subcategory?.name ?? product.category.name,
    collection: product.collection?.name ?? "",
    cuotas: product.cuotas ?? "3 cuotas sin interes",
    costPrice: Number(product.costPrice),
    price: Number(product.salePrice),
    margin: Number(product.margin),
    images: product.images.sort((a, b) => a.position - b.position).map((image) => image.url),
    weight: product.weight ?? "",
    material: product.material ?? "",
    tipo: product.tipo ?? "",
    stock: product.stock,
    minStock: product.minStock,
    status: product.status,
    badge: product.badge ?? undefined,
    isBestSeller: product.isBestSeller,
    isNew: product.isNew,
    isFavorite: product.isFavorite,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

const productInclude = {
  category: true,
  subcategory: true,
  collection: true,
  images: { orderBy: { position: "asc" as const } }
};

export async function getStoreProducts() {
  const products = await prisma.product.findMany({
    include: productInclude,
    orderBy: [{ isBestSeller: "desc" }, { createdAt: "desc" }]
  });
  return products.map(mapDbProduct);
}

export async function getStoreProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug }, include: productInclude });
  return product ? mapDbProduct(product) : null;
}

export async function getStoreCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({ include: { products: { include: { images: true }, take: 1 } }, orderBy: { name: "asc" } });
  return categories.map((category) => ({
    name: category.name,
    slug: category.slug as Category["slug"],
    description: category.description ?? "",
    image: category.products[0]?.images[0]?.url ?? "/images/charms disponibles.jpeg"
  }));
}

export async function getStoreCollections(): Promise<Collection[]> {
  const collections = await prisma.collection.findMany({ orderBy: { name: "asc" } });
  return collections.map((collection) => ({
    name: collection.name,
    slug: collection.slug,
    description: collection.description ?? "",
    image: collection.image ?? "/images/charms disponibles.jpeg",
    active: collection.active
  }));
}
