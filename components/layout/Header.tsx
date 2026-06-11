"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useCommerce } from "@/components/providers/CommerceProvider";

const nav = [
  ["Inicio", "/"],
  ["Charms Disney", "/charms-disney"],
  ["Pulseras", "/pulseras"],
  ["Collares", "/collares"],
  ["Aritos", "/aritos"],
  ["Joyeros", "/joyeros"],
  ["Catalogo", "/catalogo"],
  ["Mi cuenta", "/mi-cuenta"]
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { getCartCount, favoriteIds } = useCommerce();
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 border-b border-soluna-nude/70 bg-soluna-ivory/92 backdrop-blur-xl">
      <div className="container-page flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="font-display text-3xl text-soluna-charcoal">
          Soluna
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-soluna-charcoal/75 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-soluna-champagne">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <label className="hidden h-11 items-center gap-2 rounded-full border border-soluna-nude bg-white/75 px-4 text-sm text-soluna-charcoal/55 md:flex">
            <Search size={16} />
            <input aria-label="Buscar productos" placeholder="Buscar joyas" className="w-32 bg-transparent outline-none" />
          </label>
          <IconLink href="/favoritos" label="Favoritos" count={favoriteIds.length}>
            <Heart size={19} />
          </IconLink>
          <IconLink href="/carrito" label="Carrito" count={cartCount}>
            <ShoppingBag size={19} />
          </IconLink>
          <IconLink href="/mi-cuenta" label="Mi cuenta" className="hidden sm:inline-flex">
            <UserRound size={19} />
          </IconLink>
          <button
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-soluna-nude bg-white lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-soluna-charcoal/30 lg:hidden" onClick={() => setOpen(false)}>
          <div className="ml-auto flex h-full w-full max-w-sm flex-col bg-soluna-ivory p-6 shadow-soft" onClick={(event) => event.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-3xl">Soluna</span>
              <button aria-label="Cerrar menu" onClick={() => setOpen(false)} className="focus-ring rounded-full p-2">
                <X />
              </button>
            </div>
            <label className="mb-5 flex h-12 items-center gap-2 rounded-full border border-soluna-nude bg-white px-4 text-sm text-soluna-charcoal/55">
              <Search size={16} />
              <input aria-label="Buscar productos en mobile" placeholder="Buscar joyas" className="w-full bg-transparent outline-none" />
            </label>
            <nav className="grid gap-2">
              {[...nav, ["Acceso interno", "/admin"]].map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 font-medium hover:bg-soluna-nude/45">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function IconLink({
  href,
  label,
  className = "",
  count,
  children
}: {
  href: string;
  label: string;
  className?: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`focus-ring relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-soluna-nude bg-white/80 text-soluna-charcoal transition hover:border-soluna-champagne ${className}`}
    >
      {children}
      {count ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-soluna-rose px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
