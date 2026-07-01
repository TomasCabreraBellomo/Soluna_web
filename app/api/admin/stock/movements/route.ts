import { NextResponse } from "next/server";
import { getStockMovements } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getStockMovements());
}
