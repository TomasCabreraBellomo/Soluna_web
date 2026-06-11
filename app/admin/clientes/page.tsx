import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTable";
import { customers } from "@/data/store";

export default function AdminCustomersPage() {
  return (
    <AdminLayout title="Clientes">
      <div className="mb-6 flex flex-wrap gap-3">
        <input placeholder="Buscar clientas" className="focus-ring h-11 rounded-full border border-soluna-nude bg-white px-4 text-sm" />
        <select className="focus-ring h-11 rounded-full border border-soluna-nude bg-white px-4 text-sm"><option>Todas</option><option>Frecuentes</option><option>Con favoritos</option></select>
      </div>
      <AdminTable
        headers={["Nombre", "Email", "WhatsApp", "Cumpleaños", "Compras", "Favoritos", "Registro"]}
        rows={customers.map((customer) => [customer.name, customer.email, customer.whatsapp, customer.birthday, customer.orders, customer.favoriteProducts, customer.registeredAt])}
      />
    </AdminLayout>
  );
}
