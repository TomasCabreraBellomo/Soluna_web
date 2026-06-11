"use client";

import { Heart, MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/data/store";
import { getProductWhatsAppUrl } from "@/lib/cart";

export function ProductActions({ product }: { product: Product }) {
  const { addToCart, isFavorite, toggleFavorite } = useCommerce();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const favorite = isFavorite(product.id) || product.isFavorite;

  function handleAdd() {
    addToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="mt-7 grid gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-12 w-36 items-center justify-between rounded-full border border-soluna-nude bg-white px-3">
          <button aria-label="Restar cantidad" className="focus-ring rounded-full p-1" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            <Minus size={16} />
          </button>
          <span className="font-semibold">{quantity}</span>
          <button aria-label="Sumar cantidad" className="focus-ring rounded-full p-1" onClick={() => setQuantity((value) => value + 1)}>
            <Plus size={16} />
          </button>
        </div>
        <Button className="flex-1" onClick={handleAdd}>
          <ShoppingBag size={18} />
          {added ? "Agregado al carrito" : "Agregar al carrito"}
        </Button>
        <Button variant="secondary" className="sm:w-14" aria-label="Agregar a favoritos" onClick={() => toggleFavorite(product.id)}>
          <Heart size={18} fill={favorite ? "#D6B5B0" : "none"} />
        </Button>
      </div>
      <a
        href={getProductWhatsAppUrl(product)}
        target="_blank"
        rel="noreferrer"
        className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-soluna-champagne/50 bg-white/70 px-5 py-2.5 text-sm font-semibold transition hover:border-soluna-champagne hover:bg-white"
      >
        <MessageCircle size={18} />
        Consultar por WhatsApp
      </a>
    </div>
  );
}
