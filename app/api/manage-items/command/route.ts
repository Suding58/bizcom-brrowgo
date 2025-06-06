import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ActionCommand } from "@prisma/client";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const itemId = formData.get("itemId") as string;
    const action = formData.get("action") as string;
    const message = formData.get("message") as string;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (!itemId || !action || (action == "MESSAGE_BOX" && !message)) {
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
    } else if (!itemExits.isOnline) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ไม่สามารถเพิ่มคำสั่งได้ เนื่องจากรายการไม่ถูกใช้งาน",
        },
        { status: 200 }
      );
    }

    const newAction = await prisma.itemActionCommand.create({
      data: {
        itemId: Number(itemId),
        command: action as ActionCommand,
        message,
      },
    });

    return NextResponse.json(
      {
        success: newAction != null,
        message: newAction ? "เพิ่มคำสั่งสำเร็จ" : "เพิ่มคำสั่งไม่สำเร็จ",
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
