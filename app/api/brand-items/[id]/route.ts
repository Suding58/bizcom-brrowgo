import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const brand = await prisma.itemBrand.count({
      where: {
        ItemDetail: {
          some: {},
        },
      },
    });

    if (brand > 0)
      return NextResponse.json(
        {
          success: false,
          message: "ลบข้อมูลไม่สำเร็จ เนื่องจากมีข้อมูลพัสดุใช้งานอยู่",
        },
        { status: 200 }
      );

    await prisma.itemBrand.delete({
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
