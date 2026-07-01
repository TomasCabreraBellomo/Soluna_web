import { NextResponse } from "next/server";
import { getStoreProducts } from "@/lib/db-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getStoreProducts());
}
