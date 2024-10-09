import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ตรวจสอบให้แน่ใจว่าคุณนำเข้า Prisma Client
export const dynamic = "force-dynamic";

export async function PUT(
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

    // ตรวจสอบว่ามีรายการที่ต้องการคืนอยู่ในฐานข้อมูล
    const itemExists = await prisma.item.findUnique({
      where: { id: Number(itemId) },
    });

    if (!itemExists) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข้อมูลของรายการ",
        },
        { status: 404 }
      );
    }

    // ตรวจสอบสถานะของรายการ
    const lastTransaction = await prisma.itemTransaction.findFirst({
      where: {
        itemId: Number(itemId),
        returnDate: null, // ตรวจสอบว่ารายการนี้ยังไม่ได้คืน
      },
      orderBy: {
        createdAt: "desc", // ดึงรายการล่าสุด
      },
    });

    if (!lastTransaction) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่มีรายการที่ยืมอยู่",
        },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูล
    const userExits = await prisma.user.findFirst({
      where: { cid: cid },
    });

    if (!userExits) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข้อมูลของผู้คืน",
        },
        { status: 404 }
      );
    }

    // ตรวจสอบว่า cid ของผู้คืนตรงกับ cid ของผู้ยืม
    if (userExits.id !== lastTransaction.borrowerId) {
      return NextResponse.json(
        {
          success: false,
          message: "ผู้คืนกับผู้ยืมไม่ตรงกัน",
        },
        { status: 403 }
      );
    }

    // อัปเดตรายการการคืน
    const updatedTransaction = await prisma.itemTransaction.update({
      where: { id: lastTransaction.id },
      data: {
        returnDate: new Date(), // กำหนดวันที่คืน
        statusReturn: "WAITAPPROVAL",
      },
      include: {
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

    if (updatedTransaction) {
      // อัปเดตสถานะของ item เป็น WAITAPPROVAL
      await prisma.item.update({
        where: { id: updatedTransaction.itemId },
        data: {
          status: "WAITAPPROVAL",
        },
      });
    }

    return NextResponse.json(
      {
        success: updatedTransaction != null,
        message: updatedTransaction ? "คืนสำเร็จรออนุมัติ" : "คืนไม่สำเร็จ",
        data: {
          uuid: updatedTransaction.item.uuid,
          itemName: updatedTransaction.item.name,
          itemDetail: `${updatedTransaction.item.detail.category.name}/${updatedTransaction.item.detail.type.name}/${updatedTransaction.item.detail.brand.name}`,
          borrowerName: userExits.name,
          borrowerPhone: userExits.phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error returning item transaction:", error);
    return NextResponse.json(
      { message: "Error returning item transaction" },
      { status: 500 }
    );
  }
}
