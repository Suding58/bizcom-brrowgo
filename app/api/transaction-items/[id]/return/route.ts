import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const formData = await request.formData();
    const cid = formData.get("cid") as string;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (!id || !cid) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }
    const transactionExits = await prisma.itemTransaction.findUnique({
      where: { id: Number(id) },
    });

    if (!transactionExits) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข้อมูลการยืม",
        },
        { status: 200 }
      );
    }

    if (transactionExits.statusBorrow != "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่สามารถคืนได้เนื่องจากยังไม่อนุมัติการยืม",
        },
        { status: 200 }
      );
    }

    const returnItem = await prisma.itemTransaction.update({
      where: { id: Number(id) },
      data: {
        returnDate: new Date(),
        statusReturn: "APPROVED",
      },
    });

    if (returnItem) {
      await prisma.item.update({
        where: { id: returnItem.itemId },
        data: {
          status: "AVAILABLE",
        },
      });
    }

    return NextResponse.json(
      {
        success: returnItem != null,
        message: returnItem ? "คืนสำเร็จ" : "คืนไม่สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { message: "Error updating item" },
      { status: 500 }
    );
  }
}
