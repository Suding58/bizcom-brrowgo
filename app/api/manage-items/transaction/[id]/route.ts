import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const itemTransactions = await prisma.itemTransaction.findMany({
    where: { itemId: parseInt(id) },
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

  return NextResponse.json(
    { success: true, message: "พบข้อมูล", data: formattedTransactions },
    { status: 200 }
  );
}
