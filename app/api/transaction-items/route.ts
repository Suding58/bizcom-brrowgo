import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const itemTransactions = await prisma.itemTransaction.findMany({
      include: {
        borrower: true,
        approvedBorrow: true,
        approvedReturn: true,
      },
    });

    // แปลงผลลัพธ์ให้เป็นโครงสร้างที่ต้องการ
    const formattedTransactions = itemTransactions.map((item) => ({
      id: item.id,
      borrowerName: item.borrower.name,
      borrowDate: item.borrowDate,
      returnDate: item.returnDate || null,
      statusBorrow: item.statusBorrow,
      statusReturn: item.statusReturn,
      approvedBorrow: item.approvedBorrow?.name || null,
      approvedReturn: item.approvedReturn?.name || null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    const success = formattedTransactions.length > 0;
    return NextResponse.json(
      {
        success: true,
        message: success ? "พบข้อมูล" : "ไม่พบข้อมูล",
        data: formattedTransactions,
      },
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
