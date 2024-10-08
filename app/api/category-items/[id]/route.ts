import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const itemCategory = await prisma.itemCategory.findUnique({
    where: { id: parseInt(id) },
  });
  return NextResponse.json(itemCategory);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { name } = await request.json();
  const updatedItemCategory = await prisma.itemCategory.update({
    where: { id: parseInt(id) },
    data: { name },
  });
  return NextResponse.json(updatedItemCategory);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.itemCategory.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(
      { success: true, message: "ลบข้อมูลสำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
