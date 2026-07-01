"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/data/store";

export default function FavoritesPage() {
  const { favoriteIds } = useCommerce();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void fetch("/api/products").then((response) => response.json()).then(setProducts);
  }, []);

  const favorites = products.filter((product) => favoriteIds.includes(product.id) || product.isFavorite);

  return (
    <PublicLayout>
      <section className="container-page py-14">
        <SectionHeading eyebrow="Favoritos" title="Joyas guardadas para volver" text="Tus charms, collares y regalos elegidos quedan guardados en este navegador." />
        {favorites.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-soluna-nude bg-white p-8 text-center shadow-soft">
            <h2 className="font-display text-3xl">Todavia no guardaste favoritos</h2>
            <p className="mt-2 text-sm text-soluna-charcoal/60">Marca tus piezas preferidas para volver a ellas cuando quieras.</p>
            <Button href="/catalogo" className="mt-5">Explorar catalogo</Button>
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
