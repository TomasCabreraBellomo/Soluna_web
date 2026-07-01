"use client";

import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm, productToFormValues, type ProductFormValues } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/admin-data";
import { getCurrentUser } from "@/lib/auth";

export default function NewProductPage() {
  const router = useRouter();

  async function handleSubmit(values: ProductFormValues) {
    const user = getCurrentUser();
    if (!user) return router.replace("/admin/login");
    await createProduct(
      {
        sku: values.sku,
        internalCode: values.internalCode,
        name: values.name,
        description: values.description,
        category: values.category,
        subcategory: values.subcategory,
        collection: values.collection,
        costPrice: values.costPrice,
        salePrice: values.salePrice,
        stock: values.stock,
        minStock: values.minStock,
        material: values.material,
        weight: values.weight,
        image: values.image,
        notes: values.notes,
        status: values.status
      },
      user
    );
    window.localStorage.setItem("soluna-admin-flash", "Producto creado correctamente.");
    router.replace("/admin/productos");
  }

  return (
    <AdminLayout title="Nuevo producto">
      <ProductForm mode="create" initialValues={productToFormValues()} onSubmit={handleSubmit} />
    </AdminLayout>
  );
}
