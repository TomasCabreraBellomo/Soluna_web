import { NextResponse } from "next/server";
import { adjustStock } from "@/lib/admin-db";

export async function POST(request: Request) {
  try {
    return NextResponse.json(await adjustStock(await request.json()));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "No se pudo ajustar el stock." }, { status: 400 });
  }
}
