import { NextResponse } from "next/server";
import { createSale, getSales } from "@/lib/admin-db";

export async function GET() {
  return NextResponse.json(await getSales());
}

export async function POST(request: Request) {
  try {
    return NextResponse.json(await createSale(await request.json()), { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "No se pudo registrar la venta." }, { status: 400 });
  }
}
