import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  const itemCategory = await prisma.itemCategory.findMany();
  return NextResponse.json(
    {
      success: true,
      message: "data found",
      data: itemCategory,
    },
    { status: 200 }
  );
}
