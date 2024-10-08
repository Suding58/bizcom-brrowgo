import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import based on your project structure
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Query to find the top 5 users who borrowed the most
    const topBorrowers = await prisma.itemTransaction.groupBy({
      by: ["borrowerId"],
      _count: {
        borrowerId: true,
      },
      orderBy: {
        _count: {
          borrowerId: "desc",
        },
      },
      take: 5,
    });

    // Fetch user details for the top borrowers
    const topBorrowerDetails = await Promise.all(
      topBorrowers.map(async (borrower) => {
        const user = await prisma.user.findUnique({
          where: { id: borrower.borrowerId },
          select: { id: true, name: true, profileUrl: true },
        });
        return {
          ...user,
          borrowCount: borrower._count.borrowerId,
        };
      })
    );

    // Query to find the top 5 most borrowed items
    const topItems = await prisma.itemTransaction.groupBy({
      by: ["itemId"],
      _count: {
        itemId: true,
      },
      orderBy: {
        _count: {
          itemId: "desc",
        },
      },
      take: 5,
    });

    // Fetch item details for the top items
    const topItemDetails = await Promise.all(
      topItems.map(async (item) => {
        const itemDetails = await prisma.item.findUnique({
          where: { id: item.itemId },
          select: {
            id: true,
            name: true,
            imageUrl: true,
            detail: { select: { type: true, brand: true } },
          },
        });
        return {
          ...itemDetails,
          borrowCount: item._count.itemId,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        message: "data found",
        data: {
          topBorrowers: topBorrowerDetails,
          topItems: topItemDetails,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
