"use client";

import Link from "next/link";
import { Eye, PackagePlus, Pencil, SlidersHorizontal, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/data/store";
import { deleteProduct, getProducts, getStockStatus } from "@/lib/admin-data";
import type { AdminProduct } from "@/lib/admin-types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProducts(getProducts());
    const flash = window.localStorage.getItem("soluna-admin-flash");
    if (flash) {
      setMessage(flash);
      window.localStorage.removeItem("soluna-admin-flash");
    }
  }, []);

  const categories = Array.from(new Set(products.map((product) => product.category)));
  const collections = Array.from(new Set(products.map((product) => product.collection).filter(Boolean)));
  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = [product.name, product.sku, product.internalCode].some((value) => value.toLowerCase().includes(query.toLowerCase()));
        const matchesCategory = !category || product.category === category;
        const matchesCollection = !collection || product.collection === collection;
        return matchesQuery && matchesCategory && matchesCollection;
      }),
    [category, collection, products, query]
  );

  function handleDelete(product: AdminProduct) {
    if (!window.confirm(`Eliminar ${product.name}? Esta accion no modifica movimientos historicos.`)) return;
    deleteProduct(product.id);
    setProducts(getProducts());
    setMessage("Producto eliminado correctamente.");
  }

  return (
    <AdminLayout title="Productos">
      {message ? <div className="mb-4 rounded-lg border border-soluna-nude bg-white px-4 py-3 text-sm text-soluna-charcoal shadow-soft">{message}</div> : null}
      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar productos" placeholder="Buscar por SKU, codigo o nombre" className="focus-ring h-11 rounded-full border border-soluna-nude bg-white px-4 text-sm" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="focus-ring h-11 rounded-full border border-soluna-nude bg-white px-4 text-sm" aria-label="Filtrar categoria">
          <option value="">Todas las categorias</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={collection} onChange={(event) => setCollection(event.target.value)} className="focus-ring h-11 rounded-full border border-soluna-nude bg-white px-4 text-sm" aria-label="Filtrar coleccion">
          <option value="">Todas las colecciones</option>
          {collections.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <Button href="/admin/productos/nuevo">
          <PackagePlus size={17} />
          Nuevo producto
        </Button>
      </div>
      <AdminTable
        headers={["SKU", "Codigo", "Nombre", "Categoria", "Coleccion", "Costo", "Venta", "Margen", "Stock", "Minimo", "Estado", "Acciones"]}
        rows={filtered.map((product) => [
          product.sku,
          product.internalCode,
          <div key={product.id}><strong>{product.name}</strong><p className="text-xs text-soluna-charcoal/55">{product.material}</p></div>,
          product.subcategory ?? product.category,
          product.collection ?? "-",
          formatPrice(product.costPrice),
          formatPrice(product.salePrice),
          `${product.margin}%`,
          <span key={product.id} className={getStockStatus(product) !== "Disponible" ? "font-semibold text-[#a64f48]" : ""}>{product.stock}</span>,
          product.minStock,
          <StockBadge key={product.id} status={getStockStatus(product)} />,
          <div key={product.id} className="flex gap-2 text-soluna-charcoal/60">
            <Link href={`/producto/${product.slug}`} title="Ver"><Eye size={17} /></Link>
            <Link href={`/admin/productos/${product.id}/editar`} title="Editar"><Pencil size={17} /></Link>
            <button type="button" onClick={() => handleDelete(product)} title="Eliminar"><Trash2 size={17} /></button>
            <Link href={`/admin/stock?producto=${product.id}`} title="Ajustar stock"><SlidersHorizontal size={17} /></Link>
          </div>
        ])}
      />
    </AdminLayout>
  );
}

function StockBadge({ status }: { status: string }) {
  const classes = status === "Disponible" ? "bg-[#e8f3e8] text-[#3f7a44]" : status === "Stock bajo" ? "bg-soluna-nude text-[#8b5f55]" : "bg-[#f5dddd] text-[#9a3f3f]";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{status}</span>;
}
