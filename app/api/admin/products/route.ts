import { NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/admin-db";

export async function GET() {
  return NextResponse.json(await getProducts());
}

export async function POST(request: Request) {
  try {
    const { user, product } = await request.json();
    return NextResponse.json(await createProduct(product, user), { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "No se pudo crear el producto." }, { status: 400 });
  }
}
