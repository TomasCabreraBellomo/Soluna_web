import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTable";
import { formatPrice, cashMovements } from "@/data/store";

export default function AdminCashPage() {
  return (
    <AdminLayout title="Caja">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Summary title="Total vendido del día" value={formatPrice(84700)} />
        <Summary title="Mercado Pago" value={formatPrice(60800)} />
        <Summary title="Transferencia" value={formatPrice(23900)} />
      </div>
      <AdminTable
        headers={["Tipo", "Monto", "Método", "Usuario", "Fecha", "Observaciones"]}
        rows={cashMovements.map((movement) => [movement.type, formatPrice(movement.amount), movement.method, movement.user, movement.date, movement.notes])}
      />
    </AdminLayout>
  );
}

function Summary({ title, value }: { title: string; value: string }) {
  return <div className="rounded-lg border border-soluna-nude bg-white p-5 shadow-soft"><p className="text-sm text-soluna-charcoal/60">{title}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>;
}
