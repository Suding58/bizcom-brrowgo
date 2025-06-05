import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;

  // Fetch the item using the provided UUID
  const item = await prisma.item.findFirst({
    where: { uuid: uuid },
    include: {
      detail: {
        select: {
          category: {
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
          type: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      ItemTransaction: {
        where: {
          statusBorrow: "APPROVED", // Only include transactions with statusBorrow == "APPROVED"
          returnDate: null,
        },
        orderBy: {
          borrowDate: "desc", // or 'createdAt' if you prefer
        },
        take: 1, // Get the latest transaction
        include: {
          borrower: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  // Check if the item was found
  if (!item) {
    return NextResponse.json(
      { success: false, message: "ไม่พบข้อมูล" }, // "Data not found"
      { status: 404 } // Use 404 for not found
    );
  }

  // Transform the result into the desired structure
  const formattedItem = {
    id: item.id,
    uuid: item.uuid,
    name: item.name,
    description: item.description,
    parcelNumber: item.parcelNumber,
    imageUrl: item.imageUrl,
    category: item.detail.category.name,
    brand: item.detail.brand.name,
    type: item.detail.type.name,
    hwid: item.hwid,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    borrowerName:
      item.ItemTransaction.length > 0
        ? item.ItemTransaction[0].borrower.name
        : null,
    borrowerPhone:
      item.ItemTransaction.length > 0
        ? item.ItemTransaction[0].borrower.phone
        : null,
    borrowDate:
      item.ItemTransaction.length > 0
        ? item.ItemTransaction[0].borrowDate
        : null,
  };

  return NextResponse.json(
    { success: true, message: "พบข้อมูล", data: formattedItem }, // "Data found"
    { status: 200 }
  );
}
