import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // ดึงข้อมูลการยืมคืนจาก Prisma
    const transactions = await prisma.itemTransaction.findMany({
      select: {
        borrowDate: true,
        returnDate: true,
        statusBorrow: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "พบข้อมูล", data: transactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
