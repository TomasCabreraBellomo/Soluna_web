import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTable";
import { formatPrice } from "@/data/store";
import { getOrders } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <AdminLayout title="Pedidos">
      <AdminTable
        headers={["Número", "Cliente", "Total", "Estado", "Método de pago", "Fecha", "Cambio de estado"]}
        rows={orders.map((order) => [
          order.id,
          order.customer,
          formatPrice(order.total),
          order.status,
          order.payment,
          order.date,
          <select key={order.id} className="focus-ring rounded-full border border-soluna-nude bg-white px-3 py-2 text-sm"><option>{order.status}</option><option>Pendiente</option><option>Pagado</option><option>Preparando</option><option>Enviado</option><option>Entregado</option><option>Cancelado</option></select>
        ])}
      />
      <section className="mt-8 rounded-lg border border-soluna-nude bg-white p-6 shadow-soft">
        <h2 className="font-display text-3xl">Detalle de pedido</h2>
        <p className="mt-3 text-sm leading-7 text-soluna-charcoal/65">Espacio preparado para datos del cliente, productos comprados, cantidades, precios, dirección de envío e historial de cambios.</p>
      </section>
    </AdminLayout>
  );
}
