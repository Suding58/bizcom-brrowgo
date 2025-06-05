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

    const approverExits = await prisma.user.findFirst({
      where: { id: Number(approvedReturnId) },
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
          status: "AVAILABLE",
        },
      });

      await prisma.transactionLog.create({
        data: {
          action: "APPROVED_RETURN",
          description: `${approverExits.name} อนุมัติรายการคืนครุภัณฑ์ ${updatedItem.item.name} ของผู้ยืม ${updatedItem.borrower.name}`,
          userId: approverExits.id,
          itemId: updatedItem.item.id,
          transactionId: updatedItem.id,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "อนุมัติสำเร็จ",
        data: {
          type: "คืน",
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
