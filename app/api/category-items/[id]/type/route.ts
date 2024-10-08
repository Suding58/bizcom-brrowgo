import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const itemTypes = await prisma.itemType.findMany({
    where: { itemCategoryId: parseInt(id) },
  });

  return NextResponse.json(
    {
      success: true,
      message: "data found",
      data: itemTypes,
    },
    { status: 200 }
  );
}
