import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const itemTransactions = await prisma.itemTransaction.findMany({
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
      include: {
        borrower: true,
        approvedReturn: true,
        item: {
          include: {
            detail: {
              include: {
                category: true,
                type: true,
                brand: true,
              },
            },
          },
        },
      },
    });

    // แปลงผลลัพธ์ให้เป็นโครงสร้างที่ต้องการ
    const formattedTransactions = itemTransactions.map((item) => ({
      id: item.id,
      uuidItem: item.item.uuid,
      name: item.item.name,
      description: item.item.description,
      parcelNumber: item.item.parcelNumber,
      imageUrl: item.item.imageUrl,
      category: item.item.detail.category.name,
      brand: item.item.detail.brand.name,
      type: item.item.detail.type.name,
      status: item.item.status,
      borrowerName: item.borrower.name,
      borrowDate: item.borrowDate,
      returnDate: item.returnDate,
      statusReturn: item.statusReturn,
      approvedReturn: item.approvedReturn?.name,
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
