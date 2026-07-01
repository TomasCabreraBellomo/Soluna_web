import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { getStoreCategories, getStoreCollections, getStoreProducts } from "@/lib/db-store";

export const metadata: Metadata = {
  title: "Catalogo Soluna | Charms, pulseras y joyas de plata 925",
  description: "Explora el catalogo de Soluna con filtros por categoria, coleccion, precio y disponibilidad."
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const [products, categories, collections] = await Promise.all([getStoreProducts(), getStoreCategories(), getStoreCollections()]);

  return (
    <PublicLayout>
      <section className="bg-[linear-gradient(135deg,#FAF8F5_0%,#E8D9D7_58%,#FFFFFF_100%)]">
        <div className="container-page py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-soluna-champagne">Catalogo</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight md:text-6xl">Joyas que guardan recuerdos</h1>
          <p className="mt-4 max-w-2xl leading-8 text-soluna-charcoal/70">
            Charms plata 925, pulseras tipo Pandora, collares delicados y regalos pensados para coleccionar momentos especiales.
          </p>
        </div>
      </section>
      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-lg border border-soluna-nude bg-white p-5 shadow-soft">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal size={17} />
              Filtros
            </div>
            <label className="mb-5 flex h-11 items-center gap-2 rounded-full border border-soluna-nude px-4 text-sm">
              <Search size={16} />
              <input className="w-full outline-none" placeholder="Buscar" aria-label="Buscar en catalogo" />
            </label>
            <Filter title="Categoria" options={categories.map((category) => category.name)} />
            <Filter title="Coleccion" options={collections.map((collection) => collection.name)} />
            <Filter title="Precio" options={["Hasta $20.000", "$20.000 a $35.000", "Mas de $35.000", "Joyeros $60.000"]} />
            <Filter title="Disponibilidad" options={["En stock", "Stock bajo", "Nuevos ingresos", "Mas vendidos"]} />
          </aside>
          <div>
            <div className="mb-5 flex flex-col gap-3 rounded-lg border border-soluna-nude bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-soluna-charcoal/65">{products.length} productos disponibles</p>
              <select aria-label="Ordenar catalogo" className="focus-ring rounded-full border border-soluna-nude bg-white px-4 py-2 text-sm">
                <option>Ordenar por destacados</option>
                <option>Menor precio</option>
                <option>Mayor precio</option>
                <option>Nuevos ingresos</option>
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Filter({ title, options }: { title: string; options: string[] }) {
  return (
    <fieldset className="border-t border-soluna-nude py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-sm font-semibold">{title}</legend>
      <div className="grid gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm text-soluna-charcoal/68">
            <input type="checkbox" className="accent-soluna-champagne" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
