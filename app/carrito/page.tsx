"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/data/store";
import { getCheckoutUrl } from "@/lib/cart";

export default function CartPage() {
  const { items, clearCart, decreaseQuantity, getCartTotal, increaseQuantity, removeFromCart } = useCommerce();
  const total = getCartTotal();

  return (
    <PublicLayout>
      <section className="bg-[linear-gradient(135deg,#FAF8F5_0%,#E8D9D7_55%,#FFFFFF_100%)]">
        <div className="container-page py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-soluna-champagne">Carrito</p>
          <h1 className="mt-3 font-display text-5xl">Tu pedido Soluna</h1>
          <p className="mt-3 max-w-2xl text-soluna-charcoal/68">Revisa tus joyas elegidas y finaliza por WhatsApp con el detalle completo del pedido.</p>
        </div>
      </section>
      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-4">
          {items.length ? (
            items.map((item) => (
              <article key={item.id} className="grid gap-4 rounded-lg border border-soluna-nude bg-white p-4 shadow-soft sm:grid-cols-[110px_1fr_auto]">
                <Link href={`/producto/${item.slug}`} className="relative aspect-square overflow-hidden rounded-lg bg-soluna-nude">
                  <Image src={item.image} alt={item.name} fill sizes="110px" className="object-cover" />
                </Link>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-soluna-champagne">{item.sku}</p>
                  <Link href={`/producto/${item.slug}`} className="mt-1 block font-semibold hover:text-soluna-champagne">
                    {item.name}
                  </Link>
                  <p className="mt-2 text-sm text-soluna-charcoal/60">Precio unitario: {formatPrice(item.price)}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <QuantityButton label="Disminuir cantidad" onClick={() => decreaseQuantity(item.id)}>
                      <Minus size={15} />
                    </QuantityButton>
                    <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                    <QuantityButton label="Aumentar cantidad" onClick={() => increaseQuantity(item.id)}>
                      <Plus size={15} />
                    </QuantityButton>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="focus-ring ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-soluna-charcoal/55 hover:bg-soluna-nude/45"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-soluna-nude bg-white p-8 text-center shadow-soft">
              <ShoppingBag className="mx-auto text-soluna-rose" size={34} />
              <h2 className="mt-4 font-display text-3xl">Tu carrito esta vacio</h2>
              <p className="mt-2 text-sm text-soluna-charcoal/60">Agrega charms, pulseras o regalos para armar tu pedido.</p>
              <Button href="/catalogo" className="mt-5">Continuar comprando</Button>
            </div>
          )}
        </div>
        <aside className="h-fit rounded-lg border border-soluna-nude bg-white p-6 shadow-soft">
          <h2 className="font-display text-3xl">Resumen</h2>
          <div className="my-6 grid gap-3 border-b border-soluna-nude pb-5 text-sm">
            <div className="flex justify-between">
              <span>Productos</span>
              <span>{items.reduce((count, item) => count + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>
          <a
            href={items.length ? getCheckoutUrl(items) : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!items.length}
            className={`focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              items.length ? "bg-soluna-champagne text-white shadow-glow hover:bg-[#b79558]" : "pointer-events-none bg-soluna-nude text-soluna-charcoal/45"
            }`}
          >
            Finalizar compra por WhatsApp
          </a>
          <div className="mt-3 grid gap-2">
            <Button href="/catalogo" variant="secondary" className="w-full">Continuar comprando</Button>
            <Button variant="ghost" className="w-full" onClick={clearCart} disabled={!items.length}>Vaciar carrito</Button>
          </div>
          {!items.length ? <p className="mt-4 text-xs text-soluna-charcoal/55">Agrega al menos un producto para generar el mensaje de WhatsApp.</p> : null}
        </aside>
      </section>
    </PublicLayout>
  );
}

function QuantityButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-soluna-nude bg-white hover:border-soluna-champagne">
      {children}
    </button>
  );
}
