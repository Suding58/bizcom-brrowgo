import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const type = await prisma.itemType.count({
      where: {
        ItemDetail: {
          some: {},
        },
      },
    });

    if (type > 0)
      return NextResponse.json(
        {
          success: false,
          message: "ลบข้อมูลไม่สำเร็จ เนื่องจากมีข้อมูลพัสดุใช้งานอยู่",
        },
        { status: 200 }
      );

    await prisma.itemType.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(
      {
        success: true,
        message: "ลบข้อมูลสำเร็จ",
      },
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
