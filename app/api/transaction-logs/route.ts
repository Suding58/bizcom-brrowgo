import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const transactionLogs = await prisma.transactionLog.findMany({
      include: {
        transaction: {
          include: {
            borrower: true,
            item: true,
            approvedBorrow: true,
            approvedReturn: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      take: 10,
    });

    // แปลงผลลัพธ์ให้เป็นโครงสร้างที่ต้องการ
    const formattedTransactions = transactionLogs.map((log) => ({
      id: log.id,
      action: log.action,
      description: log.description,
      item: log.transaction?.item.name,
      borrower: log.transaction?.borrower,
      borrowDate: log.transaction?.borrowDate || null,
      returnDate: log.transaction?.returnDate,
      statusBorrow: log.transaction?.statusBorrow,
      statusReturn: log.transaction?.statusReturn,
      createdAt: log.createdAt,
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
