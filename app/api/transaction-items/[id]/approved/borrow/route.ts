import { NextRequest, NextResponse } from "next/server";
import { TransactionStatus } from "@prisma/client";

import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const formData = await request.formData();
    const statusBorrowString = formData.get("statusBorrow") as string;
    const approvedBorrowId = Number(formData.get("approvedBorrowId"));

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (!id || !statusBorrowString) {
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

    let statusBorrow: TransactionStatus;

    if (statusBorrowString === TransactionStatus.APPROVED) {
      statusBorrow = TransactionStatus.APPROVED;
    } else if (statusBorrowString === TransactionStatus.PENDING) {
      statusBorrow = TransactionStatus.PENDING;
    } else if (statusBorrowString === TransactionStatus.WAITAPPROVAL) {
      statusBorrow = TransactionStatus.WAITAPPROVAL;
    } else {
      statusBorrow = TransactionStatus.REJECTED;
    }

    const updatedItem = await prisma.itemTransaction.update({
      where: { id: Number(id) },
      data: {
        statusBorrow: statusBorrow,
        approvedBorrowId: approvedBorrowId,
      },
    });

    if (updatedItem) {
      // อัปเดตสถานะของ item เป็น AVAILABLE
      await prisma.item.update({
        where: { id: updatedItem.itemId },
        data: {
          status: "BORROWED",
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
