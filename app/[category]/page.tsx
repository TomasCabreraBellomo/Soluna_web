import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getStoreCategories, getStoreCollections, getStoreProducts } from "@/lib/db-store";

const allowedPages = ["charms-disney", "charms-plata-925", "pulseras", "collares", "aritos", "joyeros", "sets", "colecciones", "arma-tu-pulsera"] as const;

type CategoryPageProps = { params: { category: string } };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = await getStoreCategories();
  const category = categories.find((item) => item.slug === params.category);
  return {
    title: `${category?.name ?? "Colecciones"} | Soluna`,
    description: category?.description ?? "Colecciones de joyas, charms y regalos especiales Soluna."
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  if (!allowedPages.includes(params.category as (typeof allowedPages)[number])) notFound();
  const [products, categories, collections] = await Promise.all([getStoreProducts(), getStoreCategories(), getStoreCollections()]);

  if (params.category === "colecciones") {
    return (
      <PublicLayout>
        <section className="container-page py-14">
          <SectionHeading eyebrow="Colecciones" title="Historias para seguir completando" text="Disney, Stitch, Princesas y fechas especiales para crear regalos con intencion." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <article key={collection.slug} className="rounded-lg border border-soluna-nude bg-white p-6 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soluna-champagne">{collection.active ? "Activa" : "Proximamente"}</p>
                <h2 className="mt-3 font-display text-3xl">{collection.name}</h2>
                <p className="mt-3 text-sm leading-6 text-soluna-charcoal/65">{collection.description}</p>
              </article>
            ))}
          </div>
        </section>
      </PublicLayout>
    );
  }

  if (params.category === "arma-tu-pulsera") {
    return (
      <PublicLayout>
        <section className="container-page py-20">
          <SectionHeading eyebrow="Disenador" title="Arma tu pulsera Soluna" text="Este espacio queda preparado para el futuro configurador interactivo: pulsera base, charms, vista previa y compra guiada." />
          <div className="mt-10 rounded-lg border border-dashed border-soluna-champagne bg-white p-10 text-center shadow-soft">
            <p className="font-display text-4xl">Configurador proximamente</p>
            <p className="mx-auto mt-4 max-w-2xl text-soluna-charcoal/65">Mientras tanto, podes explorar pulseras y charms desde el catalogo para crear tu primera combinacion.</p>
          </div>
        </section>
      </PublicLayout>
    );
  }

  const category = categories.find((item) => item.slug === params.category);
  const categoryProducts = products.filter((product) => product.category === params.category);

  return (
    <PublicLayout>
      <section className="container-page py-14">
        <SectionHeading eyebrow="Categoria" title={category?.name ?? "Soluna"} text={category?.description} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(categoryProducts.length ? categoryProducts : products).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
