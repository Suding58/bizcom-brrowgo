import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const itemBrands = await prisma.itemBrand.findMany({
    where: { itemCategoryId: parseInt(id) },
  });

  return NextResponse.json(
    {
      success: true,
      message: "data found",
      data: itemBrands,
    },
    { status: 200 }
  );
}
