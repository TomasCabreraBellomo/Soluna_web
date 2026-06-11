"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm, productToFormValues, type ProductFormValues } from "@/components/admin/ProductForm";
import { getProduct, updateProduct } from "@/lib/admin-data";
import type { AdminProduct } from "@/lib/admin-types";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<AdminProduct | null>(null);

  useEffect(() => {
    setProduct(getProduct(params.id));
  }, [params.id]);

  function handleSubmit(values: ProductFormValues) {
    updateProduct(params.id, {
      sku: values.sku,
      internalCode: values.internalCode,
      name: values.name,
      description: values.description,
      category: values.category,
      subcategory: values.subcategory,
      collection: values.collection,
      costPrice: values.costPrice,
      salePrice: values.salePrice,
      minStock: values.minStock,
      material: values.material,
      weight: values.weight,
      image: values.image,
      notes: values.notes,
      status: values.status
    });
    window.localStorage.setItem("soluna-admin-flash", "Producto actualizado correctamente.");
    router.replace("/admin/productos");
  }

  return (
    <AdminLayout title="Editar producto">
      {product ? (
        <ProductForm mode="edit" initialValues={productToFormValues(product)} onSubmit={handleSubmit} />
      ) : (
        <div className="rounded-lg border border-soluna-nude bg-white p-6 shadow-soft">Producto no encontrado.</div>
      )}
    </AdminLayout>
  );
}
