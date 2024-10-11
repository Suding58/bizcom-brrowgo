import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { itemId: string } }
): Promise<NextResponse> {
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
      include: {
        detail: {
          include: {
            category: true,
            type: true,
          },
        },
      },
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

    // Check if the user is already borrowing an item from the same category and type
    const existingBorrow = await prisma.itemTransaction.findFirst({
      where: {
        borrowerId: userExits.id,
        statusBorrow: {
          in: ["APPROVED", "WAITAPPROVAL"],
        },
        item: {
          detail: {
            categoryId: itemExits.detail.categoryId,
            typeId: itemExits.detail.typeId,
          },
        },
      },
    });

    if (existingBorrow) {
      return NextResponse.json(
        {
          success: false,
          message: "ยืมไม่ได้ท่านเคยยืมของในหมวดหมู่และประเภทเดียวกัน",
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
        data: {
          uuid: newTransaction.item.uuid,
          itemName: newTransaction.item.name,
          itemDetail: `${newTransaction.item.detail.category.name}/${newTransaction.item.detail.type.name}/${newTransaction.item.detail.brand.name}`,
          borrowerName: userExits.name,
          borrowerPhone: userExits.phone,
        },
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
