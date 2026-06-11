"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { AdminProduct, ProductStatus } from "@/lib/admin-types";

export type ProductFormValues = {
  name: string;
  sku: string;
  internalCode: string;
  category: string;
  subcategory: string;
  collection: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  description: string;
  material: string;
  weight: string;
  image: string;
  notes: string;
  status: ProductStatus;
};

const categories = ["Charms Disney", "Charms plata 925", "Pulseras", "Collares", "Aritos", "Joyeros", "Sets para regalar"];
const collections = ["Disney", "Stitch", "Princesas", "Mickey & Minnie", "San Valentin", "Dia de la Madre", "Navidad"];
const statuses: Array<{ value: ProductStatus; label: string }> = [
  { value: "ACTIVE", label: "Activo" },
  { value: "INACTIVE", label: "Inactivo" },
  { value: "OUT_OF_STOCK", label: "Sin stock" },
  { value: "DRAFT", label: "Borrador" }
];

export function productToFormValues(product?: AdminProduct): ProductFormValues {
  return {
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    internalCode: product?.internalCode ?? "",
    category: product?.category ?? "Charms plata 925",
    subcategory: product?.subcategory ?? "",
    collection: product?.collection ?? "Disney",
    costPrice: product?.costPrice ?? 0,
    salePrice: product?.salePrice ?? 0,
    stock: product?.stock ?? 0,
    minStock: product?.minStock ?? 0,
    description: product?.description ?? "",
    material: product?.material ?? "",
    weight: product?.weight ?? "",
    image: product?.image ?? "",
    notes: product?.notes ?? "",
    status: product?.status ?? "ACTIVE"
  };
}

export function ProductForm({
  initialValues,
  mode,
  onSubmit
}: {
  initialValues: ProductFormValues;
  mode: "create" | "edit";
  onSubmit: (values: ProductFormValues) => void;
}) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");

  function setValue<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim()) return setError("El nombre es obligatorio.");
    if (!values.sku.trim()) return setError("El SKU es obligatorio.");
    if (values.salePrice <= 0) return setError("El precio de venta debe ser mayor a 0.");
    if (values.stock < 0) return setError("El stock inicial no puede ser negativo.");
    if (values.minStock < 0) return setError("El stock minimo no puede ser negativo.");
    setError("");
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-soluna-nude bg-white p-6 shadow-soft">
      {error ? <p className="mb-4 rounded-lg bg-[#f5dddd] px-4 py-3 text-sm text-[#9a3f3f]">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Nombre del producto" value={values.name} onChange={(value) => setValue("name", value)} />
        <Field label="SKU" value={values.sku} onChange={(value) => setValue("sku", value)} />
        <Field label="Codigo interno" value={values.internalCode} onChange={(value) => setValue("internalCode", value)} />
        <Select label="Categoria" value={values.category} options={categories} onChange={(value) => setValue("category", value)} />
        <Field label="Subcategoria" value={values.subcategory} onChange={(value) => setValue("subcategory", value)} />
        <Select label="Coleccion" value={values.collection} options={collections} onChange={(value) => setValue("collection", value)} />
        <NumberField label="Precio de costo" value={values.costPrice} onChange={(value) => setValue("costPrice", value)} />
        <NumberField label="Precio de venta" value={values.salePrice} onChange={(value) => setValue("salePrice", value)} />
        {mode === "create" ? <NumberField label="Stock inicial" value={values.stock} onChange={(value) => setValue("stock", value)} /> : null}
        <NumberField label="Stock minimo" value={values.minStock} onChange={(value) => setValue("minStock", value)} />
        <Field label="Material" value={values.material} onChange={(value) => setValue("material", value)} />
        <Field label="Peso" value={values.weight} onChange={(value) => setValue("weight", value)} />
        <Field label="Imagen" value={values.image} onChange={(value) => setValue("image", value)} />
        <label className="grid gap-2 text-sm font-semibold">
          Estado
          <select value={values.status} onChange={(event) => setValue("status", event.target.value as ProductStatus)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal">
            {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-sm font-semibold">
        Descripcion
        <textarea value={values.description} onChange={(event) => setValue("description", event.target.value)} className="focus-ring min-h-28 rounded-lg border border-soluna-nude px-3 py-2 font-normal" />
      </label>
      <label className="mt-4 grid gap-2 text-sm font-semibold">
        Notas internas
        <textarea value={values.notes} onChange={(event) => setValue("notes", event.target.value)} className="focus-ring min-h-20 rounded-lg border border-soluna-nude px-3 py-2 font-normal" />
      </label>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit">{mode === "create" ? "Crear producto" : "Guardar cambios"}</Button>
        <Button href="/admin/productos" variant="secondary">Cancelar</Button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal" />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input type="number" value={value} min={0} onChange={(event) => onChange(Number(event.target.value))} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal" />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring h-11 rounded-lg border border-soluna-nude px-3 font-normal">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
