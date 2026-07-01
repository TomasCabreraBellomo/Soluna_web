"use client";

import Link from "next/link";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { catalogNavItems } from "@/lib/catalog-nav";

const nav = [
  ["Charms Disney", "/charms-disney"],
  ["Colecciones", "/colecciones"],
  ["Catalogo", "/catalogo"],
  ["Mi cuenta", "/mi-cuenta"]
];

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { getCartCount, favoriteIds } = useCommerce();
  const cartCount = getCartCount();

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/catalogo?q=${encodeURIComponent(query)}` : "/catalogo");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-soluna-nude/70 bg-soluna-ivory/92 backdrop-blur-xl">
      <div className="container-page flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="font-display text-3xl text-soluna-charcoal">
          Soluna
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-soluna-charcoal/75 lg:flex">
          <Link href="/" className="transition hover:text-soluna-champagne">
            Inicio
          </Link>
          <div className="group relative">
            <button type="button" className="flex items-center gap-1 transition hover:text-soluna-champagne">
              Productos
              <ChevronDown size={15} className="transition group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-3 rounded-lg border border-soluna-nude bg-white p-2 opacity-0 shadow-soft transition duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
              <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-soluna-nude bg-white" />
              {catalogNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm text-soluna-charcoal transition hover:bg-soluna-nude/45 hover:text-soluna-champagne"
                >
                  {item.label}
                  <span className="h-1.5 w-1.5 rounded-full bg-soluna-champagne/70" />
                </Link>
              ))}
            </div>
          </div>
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-soluna-champagne">
              {label}
            </Link>
          ))}
          <Link href="/admin/login" className="text-xs uppercase tracking-[0.16em] text-soluna-charcoal/45 transition hover:text-soluna-champagne">
            Acceso interno
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <form onSubmit={submitSearch} className="hidden h-11 items-center gap-2 rounded-full border border-soluna-nude bg-white/75 px-4 text-sm text-soluna-charcoal/55 md:flex">
            <Search size={16} />
            <input
              aria-label="Buscar productos"
              placeholder="Buscar joyas"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-32 bg-transparent outline-none"
            />
          </form>
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
            <form onSubmit={submitSearch} className="mb-5 flex h-12 items-center gap-2 rounded-full border border-soluna-nude bg-white px-4 text-sm text-soluna-charcoal/55">
              <Search size={16} />
              <input
                aria-label="Buscar productos en mobile"
                placeholder="Buscar joyas"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </form>
            <nav className="grid gap-2">
              <Link href="/" onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 font-medium hover:bg-soluna-nude/45">
                Inicio
              </Link>
              <button
                type="button"
                onClick={() => setMobileProductsOpen((value) => !value)}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-left font-medium hover:bg-soluna-nude/45"
              >
                Productos
                <ChevronDown size={17} className={`transition ${mobileProductsOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileProductsOpen ? (
                <div className="grid gap-1 rounded-lg border border-soluna-nude bg-white p-2">
                  {catalogNavItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-soluna-nude/45">
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
              {[...nav.slice(1), ["Favoritos", "/favoritos"], ["Carrito", "/carrito"], ["Acceso interno", "/admin/login"]].map(([label, href]) => (
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
