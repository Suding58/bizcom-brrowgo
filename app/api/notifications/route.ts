import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const countBorrowWait = await prisma.itemTransaction.count({
      where: {
        OR: [
          {
            statusBorrow: "PENDING",
          },
          {
            statusBorrow: "WAITAPPROVAL",
          },
          {
            approvedBorrow: null,
          },
        ],
      },
    });

    const countReturnWait = await prisma.itemTransaction.count({
      where: {
        OR: [
          {
            statusReturn: "PENDING",
          },
          {
            statusBorrow: "WAITAPPROVAL",
          },
          {
            approvedReturn: null,
          },
        ],
        AND: [
          {
            NOT: {
              returnDate: null,
            },
          },
        ],
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "data found",
        data: {
          borrowCount: countBorrowWait,
          returnCount: countReturnWait,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
