import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const latestTransactions = await prisma.itemTransaction.findMany({
      include: {
        item: true,
        borrower: true,
      },
      orderBy: [
        {
          returnDate: "desc",
        },
        {
          borrowDate: "desc",
        },
      ],
      take: 10,
    });

    return NextResponse.json(
      {
        success: true,
        message: "พบข้อมูล",
        data: latestTransactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
