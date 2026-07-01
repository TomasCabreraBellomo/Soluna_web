"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/Button";
import { getProducts, getStockMovements, getStockStatus, adjustStock, registerStockEntry, registerStockExit } from "@/lib/admin-data";
import type { AdminProduct, StockMovement } from "@/lib/admin-types";
import { getCurrentUser } from "@/lib/auth";

type ActionMode = "ENTRY" | "EXIT" | "ADJUST";

const entryReasons = ["Compra a proveedor", "Reposicion", "Ajuste de inventario", "Devolucion de cliente", "Otro"];
const exitReasons = ["Venta", "Producto dañado", "Cambio", "Ajuste de inventario", "Perdida", "Otro"];

export default function AdminStockPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [mode, setMode] = useState<ActionMode>("ENTRY");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ query: "", category: "", collection: "", status: "", movementType: "" });

  async function reload() {
    const [products, movements] = await Promise.all([getProducts(), getStockMovements()]);
    setProducts(products);
    setMovements(movements);
  }

  useEffect(() => {
    void reload();
    const search = new URLSearchParams(window.location.search);
    if (search.get("accion") === "salida") setMode("EXIT");
    if (search.get("accion") === "ajuste" || search.get("producto")) setMode("ADJUST");
  }, []);

  const categories = Array.from(new Set(products.map((product) => product.category)));
  const collections = Array.from(new Set(products.map((product) => product.collection).filter(Boolean)));
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const text = `${product.name} ${product.sku}`.toLowerCase();
        return (
          text.includes(filters.query.toLowerCase()) &&
          (!filters.category || product.category === filters.category) &&
          (!filters.collection || product.collection === filters.collection) &&
          (!filters.status || getStockStatus(product) === filters.status)
        );
      }),
    [filters, products]
  );
  const filteredMovements = movements.filter((movement) => (!filters.movementType || movement.type === filters.movementType) && `${movement.productName} ${movement.sku} ${movement.userName}`.toLowerCase().includes(filters.query.toLowerCase()));

  function handleSuccess(text: string) {
    setMessage(text);
    setError("");
    void reload();
  }

  function handleError(error: unknown) {
    setError(error instanceof Error ? error.message : "No se pudo completar la accion.");
    setMessage("");
  }

  return (
    <AdminLayout title="Stock">
      {message ? <div className="mb-4 rounded-lg border border-[#d7ead7] bg-[#f0f8ef] px-4 py-3 text-sm text-[#3f7a44]">{message}</div> : null}
      {error ? <div className="mb-4 rounded-lg border border-[#f0caca] bg-[#f8eeee] px-4 py-3 text-sm text-[#9a3f3f]">{error}</div> : null}
      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_200px_200px_200px]">
        <input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder="Buscar producto, SKU o usuario" className="focus-ring h-11 rounded-full border border-soluna-nude bg-white px-4 text-sm" />
        <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })} className="focus-ring h-11 rounded-full border border-soluna-nude bg-white px-4 text-sm">
          <option value="">Categorias</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={filters.collection} onChange={(event) => setFilters({ ...filters, collection: event.target.value })} className="focus-ring h-11 rounded-full border border-soluna-nude bg-white px-4 text-sm">
          <option value="">Colecciones</option>
          {collections.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="focus-ring h-11 rounded-full border border-soluna-nude bg-white px-4 text-sm">
          <option value="">Estado de stock</option>
          <option>Disponible</option>
          <option>Stock bajo</option>
          <option>Sin stock</option>
        </select>
      </div>
      <section className="mb-8">
        <h2 className="mb-4 font-display text-3xl">Stock general</h2>
        <AdminTable
          headers={["SKU", "Producto", "Categoria", "Coleccion", "Stock actual", "Stock minimo", "Estado", "Ultimo movimiento", "Acciones"]}
          rows={filteredProducts.map((product) => {
            const lastMovement = movements.find((movement) => movement.productId === product.id);
            return [
              product.sku,
              product.name,
              product.subcategory ?? product.category,
              product.collection ?? "-",
              product.stock,
              product.minStock,
              <StockBadge key={product.id} status={getStockStatus(product)} />,
              lastMovement ? new Date(lastMovement.createdAt).toLocaleDateString("es-AR") : "-",
              <div key={product.id} className="flex flex-wrap gap-2">
                <button className="text-soluna-champagne" onClick={() => setMode("ENTRY")}>Entrada</button>
                <button className="text-soluna-champagne" onClick={() => setMode("EXIT")}>Salida</button>
                <button className="text-soluna-champagne" onClick={() => setMode("ADJUST")}>Ajustar</button>
              </div>
            ];
          })}
        />
      </section>
      <section className="mb-8 rounded-lg border border-soluna-nude bg-white p-6 shadow-soft">
        <div className="mb-5 flex flex-wrap gap-3">
          <Button variant={mode === "ENTRY" ? "primary" : "secondary"} onClick={() => setMode("ENTRY")}>Registrar entrada</Button>
          <Button variant={mode === "EXIT" ? "primary" : "secondary"} onClick={() => setMode("EXIT")}>Registrar salida</Button>
          <Button variant={mode === "ADJUST" ? "primary" : "secondary"} onClick={() => setMode("ADJUST")}>Ajustar stock</Button>
        </div>
        {mode === "ENTRY" ? <StockMovementForm products={products} reasons={entryReasons} submitLabel="Registrar entrada" onSubmit={(data) => {
          try {
            const user = getCurrentUser();
            if (!user) throw new Error("Sesion expirada.");
            void registerStockEntry({ ...data, user }).then(() => handleSuccess("Entrada de stock registrada correctamente.")).catch(handleError);
          } catch (err) {
            handleError(err);
          }
        }} /> : null}
        {mode === "EXIT" ? <StockMovementForm products={products} reasons={exitReasons} submitLabel="Registrar salida" onSubmit={(data) => {
          try {
            const user = getCurrentUser();
            if (!user) throw new Error("Sesion expirada.");
            void registerStockExit({ ...data, user }).then(() => handleSuccess("Salida de stock registrada correctamente.")).catch(handleError);
          } catch (err) {
            handleError(err);
          }
        }} /> : null}
        {mode === "ADJUST" ? <AdjustForm products={products} onSubmit={(data) => {
          try {
            if (!window.confirm("Confirmar ajuste manual de stock?")) return;
            const user = getCurrentUser();
            if (!user) throw new Error("Sesion expirada.");
            void adjustStock({ ...data, user }).then(() => handleSuccess("Stock ajustado correctamente.")).catch(handleError);
          } catch (err) {
            handleError(err);
          }
        }} /> : null}
      </section>
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl">Historial de movimientos</h2>
          <select value={filters.movementType} onChange={(event) => setFilters({ ...filters, movementType: event.target.value })} className="focus-ring h-11 rounded-full border border-soluna-nude bg-white px-4 text-sm">
            <option value="">Todos los tipos</option>
            {["INITIAL_ENTRY", "ENTRY", "EXIT", "SALE", "ADJUSTMENT_IN", "ADJUSTMENT_OUT", "RETURN"].map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <AdminTable
          headers={["Fecha", "Producto", "SKU", "Tipo", "Cantidad", "Anterior", "Nuevo", "Motivo", "Usuario", "Observaciones"]}
          rows={filteredMovements.map((movement) => [
            new Date(movement.createdAt).toLocaleString("es-AR"),
            movement.productName,
            movement.sku,
            <MovementBadge key={movement.id} type={movement.type} />,
            movement.quantity,
            movement.previousStock,
            movement.newStock,
            movement.reason,
            movement.userName,
            movement.notes ?? "-"
          ])}
        />
      </section>
    </AdminLayout>
  );
}

function StockMovementForm({ products, reasons, submitLabel, onSubmit }: { products: AdminProduct[]; reasons: string[]; submitLabel: string; onSubmit: (data: { productId: string; quantity: number; reason: string; notes?: string }) => void }) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState(reasons[0]);
  const [notes, setNotes] = useState("");
  const product = products.find((item) => item.id === productId);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ productId, quantity, reason, notes });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <label className="grid gap-2 text-sm font-semibold">Producto<select value={productId} onChange={(event) => setProductId(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal"><option value="">Seleccionar</option>{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label className="grid gap-2 text-sm font-semibold">SKU<input value={product?.sku ?? ""} readOnly className="h-11 rounded-lg border border-soluna-nude bg-soluna-ivory px-3 font-normal" /></label>
      <label className="grid gap-2 text-sm font-semibold">Cantidad<input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal" /></label>
      <label className="grid gap-2 text-sm font-semibold">Motivo<select value={reason} onChange={(event) => setReason(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal">{reasons.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="grid gap-2 text-sm font-semibold xl:col-span-3">Observaciones<input value={notes} onChange={(event) => setNotes(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal" /></label>
      <div className="flex items-end"><Button type="submit" className="w-full">{submitLabel}</Button></div>
    </form>
  );
}

function AdjustForm({ products, onSubmit }: { products: AdminProduct[]; onSubmit: (data: { productId: string; newStock: number; reason: string; notes?: string }) => void }) {
  const [productId, setProductId] = useState("");
  const [newStock, setNewStock] = useState(0);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const product = products.find((item) => item.id === productId);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ productId, newStock, reason, notes });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <label className="grid gap-2 text-sm font-semibold">Producto<select value={productId} onChange={(event) => setProductId(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal"><option value="">Seleccionar</option>{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label className="grid gap-2 text-sm font-semibold">Stock actual<input value={product?.stock ?? ""} readOnly className="h-11 rounded-lg border border-soluna-nude bg-soluna-ivory px-3 font-normal" /></label>
      <label className="grid gap-2 text-sm font-semibold">Nuevo stock<input type="number" min={0} value={newStock} onChange={(event) => setNewStock(Number(event.target.value))} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal" /></label>
      <label className="grid gap-2 text-sm font-semibold">Motivo<input value={reason} onChange={(event) => setReason(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal" /></label>
      <label className="grid gap-2 text-sm font-semibold xl:col-span-3">Observaciones<input value={notes} onChange={(event) => setNotes(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal" /></label>
      <div className="flex items-end"><Button type="submit" className="w-full">Guardar ajuste</Button></div>
    </form>
  );
}

function StockBadge({ status }: { status: string }) {
  const classes = status === "Disponible" ? "bg-[#e8f3e8] text-[#3f7a44]" : status === "Stock bajo" ? "bg-soluna-nude text-[#8b5f55]" : "bg-[#f5dddd] text-[#9a3f3f]";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{status}</span>;
}

function MovementBadge({ type }: { type: string }) {
  const classes = type.includes("ENTRY") || type === "RETURN" ? "bg-[#e8f3e8] text-[#3f7a44]" : type === "SALE" ? "bg-soluna-nude text-[#8b5f55]" : type.includes("EXIT") ? "bg-[#f5dddd] text-[#9a3f3f]" : "bg-soluna-ivory text-soluna-charcoal/70";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{type}</span>;
}
