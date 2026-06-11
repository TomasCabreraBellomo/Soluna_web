import { AdminLayout } from "@/components/admin/AdminLayout";

const reports = ["Productos más vendidos", "Rotación de stock", "Ganancias", "Productos sin movimiento", "Stock bajo", "Ventas por colección", "Ventas por categoría", "Ventas por método de pago"];

export default function AdminReportsPage() {
  return (
    <AdminLayout title="Reportes">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {reports.map((report, index) => (
          <article key={report} className="rounded-lg border border-soluna-nude bg-white p-5 shadow-soft">
            <h2 className="font-semibold">{report}</h2>
            <div className="mt-5 flex h-24 items-end gap-2">
              {[45, 72, 58, 88, 64].map((height, barIndex) => (
                <span key={barIndex} className="w-full rounded-t bg-soluna-champagne/70" style={{ height: `${Math.max(18, height - index * 3)}%` }} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </AdminLayout>
  );
}
