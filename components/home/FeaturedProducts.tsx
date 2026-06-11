"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/data/store";

const tabs = ["Más vendidos", "Nuevos ingresos", "Favoritos"] as const;

export function FeaturedProducts() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Más vendidos");
  const visible = useMemo(() => {
    if (active === "Nuevos ingresos") return products.filter((product) => product.isNew);
    if (active === "Favoritos") return products.filter((product) => product.isFavorite);
    return products.filter((product) => product.isBestSeller || product.badge === "Más vendido");
  }, [active]);

  return (
    <section className="container-page py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Selección Soluna" title="Piezas que invitan a volver" text="Charms, pulseras y regalos listos para sumar a una colección personal." />
        <div className="flex rounded-full border border-soluna-nude bg-white p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${active === tab ? "bg-soluna-champagne text-white" : "text-soluna-charcoal/65 hover:bg-soluna-nude/45"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
