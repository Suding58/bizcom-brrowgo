import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  const itemCategory = await prisma.itemCategory.findMany({
    select: {
      id: true,
      name: true,
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      AND: [
        { type: { some: {} } }, // มี type อย่างน้อยหนึ่งรายการ
        { brand: { some: {} } }, // มี brand อย่างน้อยหนึ่งรายการ
      ],
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "data found",
      data: itemCategory,
    },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (!name) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const newItemCategory = await prisma.itemCategory.create({
      data: { name },
    });

    return NextResponse.json(
      { success: true, message: "สร้างรายการสำเร็จ", data: newItemCategory },
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
