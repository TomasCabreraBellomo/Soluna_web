import { NextResponse } from "next/server";
import { registerStockExit } from "@/lib/admin-db";

export async function POST(request: Request) {
  try {
    return NextResponse.json(await registerStockExit(await request.json()));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "No se pudo registrar la salida." }, { status: 400 });
  }
}
