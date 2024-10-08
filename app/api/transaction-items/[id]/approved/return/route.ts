import { NextRequest, NextResponse } from "next/server";
import { TransactionStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const formData = await request.formData();
    const statusReturnString = formData.get("statusReturn") as string;
    const approvedReturnId = Number(formData.get("approvedReturnId"));

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (!id || !statusReturnString) {
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
          message: "ไม่พบข้อมูล",
        },
        { status: 200 }
      );
    }

    let statusReturn: TransactionStatus;

    if (statusReturnString === TransactionStatus.APPROVED) {
      statusReturn = TransactionStatus.APPROVED;
    } else if (statusReturnString === TransactionStatus.PENDING) {
      statusReturn = TransactionStatus.PENDING;
    } else if (statusReturnString === TransactionStatus.WAITAPPROVAL) {
      statusReturn = TransactionStatus.WAITAPPROVAL;
    } else {
      statusReturn = TransactionStatus.REJECTED;
    }

    const updatedItem = await prisma.itemTransaction.update({
      where: { id: Number(id) },
      data: {
        statusReturn: statusReturn,
        approvedReturnId: approvedReturnId,
      },
    });

    if (updatedItem) {
      // อัปเดตสถานะของ item เป็น AVAILABLE
      await prisma.item.update({
        where: { id: updatedItem.itemId },
        data: {
          status: "AVAILABLE",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "แก้ไขข้อมูลสำเร็จ",
        data: updatedItem,
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
