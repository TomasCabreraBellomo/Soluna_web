"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/data/store";
import { createSale, getProducts, getSales } from "@/lib/admin-data";
import type { AdminProduct, PaymentMethod, Sale } from "@/lib/admin-types";
import { getCurrentUser } from "@/lib/auth";

type DraftItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export default function AdminSalesPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [items, setItems] = useState<DraftItem[]>([{ productId: "", quantity: 1, unitPrice: 0 }]);
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("TRANSFER");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function reload() {
    setProducts(getProducts());
    setSales(getSales());
  }

  useEffect(() => {
    reload();
  }, []);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), [items]);

  function updateItem(index: number, data: Partial<DraftItem>) {
    setItems((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const next = { ...item, ...data };
        if (data.productId) {
          const product = products.find((candidate) => candidate.id === data.productId);
          if (product) next.unitPrice = product.salePrice;
        }
        return next;
      })
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const user = getCurrentUser();
      if (!user) throw new Error("Sesion expirada.");
      createSale({
        customerName,
        customerWhatsapp,
        paymentMethod,
        notes,
        user,
        items: items.filter((item) => item.productId)
      });
      setMessage("Venta registrada correctamente y stock actualizado.");
      setError("");
      setItems([{ productId: "", quantity: 1, unitPrice: 0 }]);
      setCustomerName("");
      setCustomerWhatsapp("");
      setNotes("");
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la venta.");
      setMessage("");
    }
  }

  return (
    <AdminLayout title="Ventas">
      {message ? <div className="mb-4 rounded-lg border border-[#d7ead7] bg-[#f0f8ef] px-4 py-3 text-sm text-[#3f7a44]">{message}</div> : null}
      {error ? <div className="mb-4 rounded-lg border border-[#f0caca] bg-[#f8eeee] px-4 py-3 text-sm text-[#9a3f3f]">{error}</div> : null}
      <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-soluna-nude bg-white p-6 shadow-soft">
        <h2 className="font-display text-3xl">Registrar venta manual</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-semibold">Nombre del cliente<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal" /></label>
          <label className="grid gap-2 text-sm font-semibold">WhatsApp<input value={customerWhatsapp} onChange={(event) => setCustomerWhatsapp(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal" /></label>
          <label className="grid gap-2 text-sm font-semibold">Metodo de pago<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal"><option value="CASH">Efectivo</option><option value="TRANSFER">Transferencia</option><option value="MERCADO_PAGO">Mercado Pago</option></select></label>
        </div>
        <div className="mt-6 grid gap-3">
          {items.map((item, index) => {
            const product = products.find((candidate) => candidate.id === item.productId);
            return (
              <div key={index} className="grid gap-3 rounded-lg bg-soluna-ivory p-4 md:grid-cols-[1fr_110px_150px_150px_auto]">
                <label className="grid gap-2 text-sm font-semibold">Producto<select value={item.productId} onChange={(event) => updateItem(index, { productId: event.target.value })} className="focus-ring h-11 rounded-lg border border-soluna-nude bg-white px-3 font-normal"><option value="">Seleccionar</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.stock})</option>)}</select></label>
                <label className="grid gap-2 text-sm font-semibold">Cantidad<input type="number" min={1} value={item.quantity} onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })} className="focus-ring h-11 rounded-lg border border-soluna-nude bg-white px-3 font-normal" /></label>
                <label className="grid gap-2 text-sm font-semibold">Precio unitario<input type="number" min={0} value={item.unitPrice} onChange={(event) => updateItem(index, { unitPrice: Number(event.target.value) })} className="focus-ring h-11 rounded-lg border border-soluna-nude bg-white px-3 font-normal" /></label>
                <div className="grid gap-2 text-sm font-semibold">Subtotal<span className="flex h-11 items-center rounded-lg border border-soluna-nude bg-white px-3">{formatPrice(item.quantity * item.unitPrice)}</span></div>
                <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="self-end rounded-full px-3 py-2 text-sm text-[#9a3f3f]" disabled={items.length === 1}>Quitar</button>
                {product && item.quantity > product.stock ? <p className="text-sm text-[#9a3f3f] md:col-span-5">No hay stock suficiente para {product.name}. Disponible: {product.stock}.</p> : null}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="secondary" onClick={() => setItems((current) => [...current, { productId: "", quantity: 1, unitPrice: 0 }])}>Agregar producto</Button>
          <p className="font-semibold">Total: {formatPrice(total)}</p>
        </div>
        <label className="mt-4 grid gap-2 text-sm font-semibold">Observaciones<input value={notes} onChange={(event) => setNotes(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal" /></label>
        <Button type="submit" className="mt-5">Registrar venta</Button>
      </form>
      <section>
        <h2 className="mb-4 font-display text-3xl">Ventas registradas</h2>
        <AdminTable
          headers={["Fecha", "Cliente", "Productos", "Pago", "Total", "Usuario"]}
          rows={sales.map((sale) => [
            new Date(sale.createdAt).toLocaleString("es-AR"),
            sale.customerName || "-",
            sale.items.map((item) => `${item.productName} x${item.quantity}`).join(", "),
            sale.paymentMethod,
            formatPrice(sale.total),
            sale.userName
          ])}
        />
      </section>
    </AdminLayout>
  );
}
