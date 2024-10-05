import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.itemTransaction.findMany({
      include: {
        item: true, // Include related Item data
        borrower: true, // Include related User data (borrower)
      },
      orderBy: {
        borrowDate: "desc", // Order by borrow date, most recent first
      },
      take: 5, // Limit to the 5 most recent transactions
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
