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

    const approverExits = await prisma.user.findFirst({
      where: { id: Number(approvedBorrowId) },
    });

    if (!approverExits) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข้อมูลของผู้อนุมัติ",
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
      include: {
        borrower: true,
        item: {
          include: {
            detail: {
              include: {
                category: true,
                type: true,
                brand: true,
              },
            },
          },
        },
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
        message: "อนุมัติสำเร็จ",
        data: {
          type: "ยืม",
          uuid: updatedItem.item.uuid,
          approveName: approverExits.name,
          itemName: updatedItem.item.name,
          itemDetail: `${updatedItem.item.detail.category.name}/${updatedItem.item.detail.type.name}/${updatedItem.item.detail.brand.name}`,
          borrowerName: updatedItem.borrower.name,
          borrowerPhone: updatedItem.borrower.phone,
        },
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
