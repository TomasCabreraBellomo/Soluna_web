import { NextResponse } from "next/server";
import { registerStockEntry } from "@/lib/admin-db";

export async function POST(request: Request) {
  try {
    return NextResponse.json(await registerStockEntry(await request.json()));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "No se pudo registrar la entrada." }, { status: 400 });
  }
}
