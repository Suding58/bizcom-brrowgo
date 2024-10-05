import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const { itemId } = params;

  try {
    const formData = await request.formData();
    const cid = formData.get("cid") as string;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (!cid || !itemId) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const itemExits = await prisma.item.findUnique({
      where: { id: Number(itemId) },
    });

    if (!itemExits) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข้อมูลของรายการ",
        },
        { status: 200 }
      );
    }

    if (itemExits.status !== "AVAILABLE") {
      return NextResponse.json(
        {
          success: false,
          message: "รายการนี้ไม่สามารถดำเนินการได้",
        },
        { status: 200 }
      );
    }

    const userExits = await prisma.user.findFirst({
      where: { cid: cid },
    });

    if (!userExits) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข้อมูลของผู้ต้องการยืม",
        },
        { status: 200 }
      );
    }

    const newTransaction = await prisma.itemTransaction.create({
      data: {
        itemId: Number(itemId),
        borrowerId: userExits.id,
        statusBorrow: "WAITAPPROVAL",
      },
    });

    if (newTransaction) {
      await prisma.item.update({
        where: { id: Number(itemId) },
        data: {
          status: "WAITAPPROVAL",
        },
      });
    }

    return NextResponse.json(
      {
        success: newTransaction != null,
        message: newTransaction ? "ยืมสำเร็จรออนุมัติ" : "ยืมไม่สำเร็จ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error create item transaction:", error);
    return NextResponse.json(
      { message: "Error create item transaction" },
      { status: 500 }
    );
  }
}
