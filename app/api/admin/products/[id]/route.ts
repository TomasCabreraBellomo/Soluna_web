import { NextResponse } from "next/server";
import { deleteProduct, getProduct, updateProduct } from "@/lib/admin-db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return product ? NextResponse.json(product) : NextResponse.json({ message: "Producto no encontrado." }, { status: 404 });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await updateProduct(params.id, await request.json());
    return product ? NextResponse.json(product) : NextResponse.json({ message: "Producto no encontrado." }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "No se pudo actualizar el producto." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "No se pudo eliminar el producto." }, { status: 400 });
  }
}
