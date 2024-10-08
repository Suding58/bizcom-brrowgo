import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const categoryId = Number(formData.get("categoryId"));
    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const newItemType = await prisma.itemType.create({
      data: { name, itemCategoryId: categoryId },
    });

    return NextResponse.json(
      { success: true, message: "สร้างรายการสำเร็จ", data: newItemType },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
