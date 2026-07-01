import type { ProductCategory } from "@/data/store";

export type CatalogNavItem = {
  label: string;
  href: string;
  category?: ProductCategory | "charms";
};

export const catalogNavItems: CatalogNavItem[] = [
  { label: "Aritos", href: "/aritos", category: "aritos" },
  { label: "Collares", href: "/collares", category: "collares" },
  { label: "Charms", href: "/catalogo?categoria=charms", category: "charms" },
  { label: "Charms Disney", href: "/charms-disney", category: "charms-disney" },
  { label: "Pulseras", href: "/pulseras", category: "pulseras" },
  { label: "Joyeros", href: "/joyeros", category: "joyeros" },
  { label: "Sets para regalar", href: "/catalogo?categoria=sets", category: "sets" },
  { label: "Colecciones", href: "/colecciones" }
];

export function getCatalogCategoryLabel(category?: string) {
  if (!category) return null;
  return catalogNavItems.find((item) => item.category === category)?.label ?? null;
}

export function productMatchesCatalogCategory(productCategory: ProductCategory, category?: string) {
  if (!category) return true;
  if (category === "charms") return productCategory === "charms-disney" || productCategory === "charms-plata-925";
  return productCategory === category;
}
