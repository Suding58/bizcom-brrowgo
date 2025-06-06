import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { name: string; hwid: string } }
) {
  try {
    const { name, hwid } = params;
    const updatedItems = await prisma.item.updateMany({
      where: {
        name: name,
        OR: [
          { hwid: null },
          { hwid: '' },
        ],
      },
      data: { hwid: hwid },
    });
    

    return NextResponse.json(
      {
        success: updatedItems != null,
        message: updatedItems ? "อัพเดทสำเร็จ" : "อัพเดทไม่สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
