"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { formatPrice, type Product } from "@/data/store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, isFavorite, toggleFavorite } = useCommerce();
  const [added, setAdded] = useState(false);
  const favorite = isFavorite(product.id) || product.isFavorite;

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="group overflow-hidden rounded-lg border border-soluna-nude/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-soluna-nude/30">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge ? (
          <div className="absolute left-3 top-3">
            <Badge tone={product.badge === "Stock bajo" ? "rose" : "champagne"}>{product.badge}</Badge>
          </div>
        ) : null}
        <button
          type="button"
          aria-label="Agregar a favoritos"
          onClick={(event) => {
            event.preventDefault();
            toggleFavorite(product.id);
          }}
          className="focus-ring absolute right-3 top-3 rounded-full bg-white/90 p-2 text-soluna-charcoal shadow-soft transition hover:text-[#b06f77]"
        >
          <Heart size={18} fill={favorite ? "#D6B5B0" : "none"} />
        </button>
      </Link>
      <div className="p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-soluna-champagne">{product.collection}</p>
        <Link href={`/producto/${product.slug}`} className="font-semibold leading-snug hover:text-soluna-champagne">
          {product.name}
        </Link>
        <p className="mt-3 text-lg font-semibold">{formatPrice(product.price)}</p>
        <p className="mt-1 text-xs text-soluna-charcoal/55">3 cuotas sin interes de {formatPrice(product.price / 3)}</p>
        <p className="mb-4 mt-1 text-xs font-medium text-soluna-champagne">Precio especial por transferencia</p>
        <Button className="w-full" variant={added ? "primary" : "secondary"} onClick={handleAdd}>
          <ShoppingBag size={17} />
          {added ? "Agregado" : "Agregar al carrito"}
        </Button>
      </div>
    </article>
  );
}
