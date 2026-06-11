"use client";

import { AlertTriangle, Banknote, Boxes, PackageCheck, Plus, ShoppingBag, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/data/store";
import { getProducts, getSales, getStockMovements, getStockStatus } from "@/lib/admin-data";
import type { AdminProduct, Sale, StockMovement } from "@/lib/admin-types";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  useEffect(() => {
    setProducts(getProducts());
    setSales(getSales());
    setMovements(getStockMovements());
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todaySales = sales.filter((sale) => sale.createdAt.slice(0, 10) === today);
  const lowStock = products.filter((product) => getStockStatus(product) === "Stock bajo");
  const outOfStock = products.filter((product) => getStockStatus(product) === "Sin stock");
  const stockTotal = products.reduce((total, product) => total + product.stock, 0);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total de productos" value={String(products.length)} detail="Catalogo interno" icon={ShoppingBag} />
        <StatCard title="Stock disponible" value={String(stockTotal)} detail="Unidades totales" icon={Boxes} />
        <StatCard title="Stock bajo" value={String(lowStock.length)} detail="Revisar reposicion" icon={AlertTriangle} />
        <StatCard title="Sin stock" value={String(outOfStock.length)} detail="Pausar ventas" icon={PackageCheck} />
        <StatCard title="Ventas del dia" value={String(todaySales.length)} detail={formatPrice(todaySales.reduce((total, sale) => total + sale.total, 0))} icon={Banknote} />
        <StatCard title="Ultimos movimientos" value={String(movements.length)} detail="Historial de stock" icon={TrendingUp} />
      </div>
      <section className="mt-8 rounded-lg border border-soluna-nude bg-white p-5 shadow-soft">
        <h2 className="font-display text-3xl">Accesos rapidos</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href="/admin/productos/nuevo"><Plus size={17} />Nuevo producto</Button>
          <Button href="/admin/stock?accion=entrada" variant="secondary">Registrar entrada de stock</Button>
          <Button href="/admin/ventas" variant="secondary">Registrar venta</Button>
          <Button href="/admin/stock" variant="ghost">Ver stock general</Button>
        </div>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 font-display text-3xl">Ultimos movimientos de stock</h2>
        <AdminTable
          headers={["Fecha", "Producto", "SKU", "Tipo", "Cantidad", "Stock anterior", "Stock nuevo", "Usuario"]}
          rows={movements.slice(0, 6).map((movement) => [
            new Date(movement.createdAt).toLocaleDateString("es-AR"),
            movement.productName,
            movement.sku,
            movement.type,
            movement.quantity,
            movement.previousStock,
            movement.newStock,
            movement.userName
          ])}
        />
      </section>
    </AdminLayout>
  );
}
