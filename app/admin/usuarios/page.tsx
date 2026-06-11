import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTable";

export default function AdminUsersPage() {
  return (
    <AdminLayout title="Usuarios">
      <AdminTable
        headers={["Nombre", "Rol", "Acceso"]}
        rows={[
          ["Admin Soluna", "Administrador", "Control total"],
          ["Vendedora", "Vendedor", "Ventas, pedidos, clientes y caja"],
          ["Depósito", "Depósito", "Productos, stock y movimientos"]
        ]}
      />
    </AdminLayout>
  );
}
