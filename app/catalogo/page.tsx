import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/Button";
import { catalogNavItems, getCatalogCategoryLabel, productMatchesCatalogCategory } from "@/lib/catalog-nav";
import { getStoreCollections, getStoreProducts } from "@/lib/db-store";

export const metadata: Metadata = {
  title: "Catalogo Soluna | Charms, pulseras y joyas de plata 925",
  description: "Explora el catalogo de Soluna con filtros por categoria, coleccion, precio y disponibilidad."
};

export const dynamic = "force-dynamic";

type CatalogPageProps = {
  searchParams?: {
    categoria?: string;
    q?: string;
  };
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const [products, collections] = await Promise.all([getStoreProducts(), getStoreCollections()]);
  const activeCategory = searchParams?.categoria?.trim().toLowerCase();
  const searchTerm = searchParams?.q?.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory = productMatchesCatalogCategory(product.category, activeCategory);
    const matchesSearch = searchTerm
      ? [product.name, product.description, product.subcategory, product.collection, product.material, product.tipo]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(searchTerm))
      : true;

    return matchesCategory && matchesSearch;
  });
  const activeCategoryLabel = getCatalogCategoryLabel(activeCategory);
  const activeFilterLabel = activeCategoryLabel ?? (searchTerm ? `Busqueda: ${searchParams?.q}` : null);

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
            <form action="/catalogo" className="mb-5 flex h-11 items-center gap-2 rounded-full border border-soluna-nude px-4 text-sm">
              <Search size={16} />
              <input name="q" defaultValue={searchParams?.q ?? ""} className="w-full outline-none" placeholder="Buscar" aria-label="Buscar en catalogo" />
            </form>
            <Filter title="Categoria" options={catalogNavItems.filter((item) => item.category).map((item) => ({ label: item.label, href: item.href }))} />
            <Filter title="Coleccion" options={collections.map((collection) => collection.name)} />
            <Filter title="Precio" options={["Hasta $20.000", "$20.000 a $35.000", "Mas de $35.000", "Joyeros $60.000"]} />
            <Filter title="Disponibilidad" options={["En stock", "Stock bajo", "Nuevos ingresos", "Mas vendidos"]} />
          </aside>
          <div>
            <div className="mb-5 flex flex-col gap-3 rounded-lg border border-soluna-nude bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-soluna-charcoal/65">{filteredProducts.length} productos disponibles</p>
                {activeFilterLabel ? <p className="mt-1 text-sm font-semibold text-soluna-charcoal">Mostrando: {activeFilterLabel}</p> : null}
              </div>
              {activeFilterLabel ? (
                <Button href="/catalogo" variant="ghost">
                  Ver todos
                </Button>
              ) : null}
              <select aria-label="Ordenar catalogo" className="focus-ring rounded-full border border-soluna-nude bg-white px-4 py-2 text-sm">
                <option>Ordenar por destacados</option>
                <option>Menor precio</option>
                <option>Mayor precio</option>
                <option>Nuevos ingresos</option>
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            {!filteredProducts.length ? (
              <div className="rounded-lg border border-soluna-nude bg-white p-8 text-center shadow-soft">
                <h2 className="font-display text-3xl">No encontramos productos para este filtro.</h2>
                <p className="mt-2 text-sm text-soluna-charcoal/60">Proba con otra categoria o mira el catalogo completo.</p>
                <Button href="/catalogo" className="mt-5">Ver todos</Button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Filter({ title, options }: { title: string; options: Array<string | { label: string; href: string }> }) {
  return (
    <fieldset className="border-t border-soluna-nude py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-sm font-semibold">{title}</legend>
      <div className="grid gap-2">
        {options.map((option) => {
          const item = typeof option === "string" ? { label: option, href: "#" } : option;
          return item.href === "#" ? (
            <label key={item.label} className="flex items-center gap-2 text-sm text-soluna-charcoal/68">
              <input type="checkbox" className="accent-soluna-champagne" />
              {item.label}
            </label>
          ) : (
            <a key={item.label} href={item.href} className="rounded-lg px-3 py-2 text-sm text-soluna-charcoal/68 transition hover:bg-soluna-nude/45 hover:text-soluna-charcoal">
              {item.label}
            </a>
          );
        })}
      </div>
    </fieldset>
  );
}
