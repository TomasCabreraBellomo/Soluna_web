import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTable";
import { collections } from "@/data/store";

export default function AdminCollectionsPage() {
  return (
    <AdminLayout title="Colecciones">
      <AdminTable
        headers={["Nombre", "Slug", "Descripción", "Estado", "Productos asociados"]}
        rows={collections.map((collection) => [collection.name, collection.slug, collection.description, collection.active ? "Activa" : "Inactiva", "Preparado para relación con productos"])}
      />
    </AdminLayout>
  );
}
