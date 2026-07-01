import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/catalog/ProductActions";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/data/store";
import { getStoreProductBySlug, getStoreProducts } from "@/lib/db-store";

type ProductPageProps = { params: { slug: string } };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getStoreProductBySlug(params.slug);
  return {
    title: product ? `${product.name} | Soluna` : "Producto | Soluna",
    description: product?.description
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, products] = await Promise.all([getStoreProductBySlug(params.slug), getStoreProducts()]);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);

  return (
    <PublicLayout>
      <section className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 sm:grid-cols-[96px_1fr]">
            <div className="order-2 grid grid-cols-3 gap-3 sm:order-1 sm:grid-cols-1">
              {product.images.map((image) => (
                <div key={image} className="relative aspect-square overflow-hidden rounded-lg border border-soluna-nude bg-white">
                  <Image src={image} alt={product.name} fill sizes="96px" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-lg bg-white shadow-soft sm:order-2">
              <Image src={product.images[0]} alt={product.name} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" priority />
            </div>
          </div>
          <div className="lg:pt-6">
            <Badge>{product.collection}</Badge>
            <h1 className="mt-5 font-display text-4xl leading-tight md:text-6xl">{product.name}</h1>
            <p className="mt-5 text-3xl font-semibold">{formatPrice(product.price)}</p>
            <p className="mt-2 text-sm text-soluna-charcoal/60">3 cuotas sin interes de {formatPrice(product.price / 3)}</p>
            <p className="mt-1 text-sm font-medium text-soluna-champagne">Precio especial por transferencia</p>
            <p className="mt-6 leading-8 text-soluna-charcoal/72">{product.description}</p>
            <dl className="mt-8 grid gap-3 rounded-lg border border-soluna-nude bg-white p-5 text-sm">
              <Info label="Material" value={product.material} />
              <Info label="Tipo" value={product.tipo} />
              <Info label="Coleccion" value={product.collection} />
              <Info label="Categoria" value={product.subcategory} />
              <Info label="Stock disponible" value={`${product.stock} unidades`} />
              <Info label="Packaging" value="Incluye bolsa y tarjeta Soluna para regalo" />
              <Info label="Garantia y cambios" value="Cambio dentro de 15 dias con empaque original" />
            </dl>
            <ProductActions product={product} />
            <div className="mt-6 rounded-lg bg-soluna-nude/35 p-5 text-sm leading-7 text-soluna-charcoal/70">
              Envios a todo Argentina. Preparacion cuidada, seguimiento de pedido y opcion de gift box.
            </div>
          </div>
        </div>
        <section className="mt-20">
          <h2 className="font-display text-4xl">Productos relacionados</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(related.length ? related : products.slice(0, 3)).map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      </section>
    </PublicLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-soluna-nude/70 pb-3 last:border-0 last:pb-0">
      <dt className="font-semibold">{label}</dt>
      <dd className="text-right text-soluna-charcoal/65">{value}</dd>
    </div>
  );
}
