import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import moment from "moment";

export async function GET() {
  try {
    // Current month data
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const transactionsCount = await prisma.itemTransaction.count({
      where: {
        borrowDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const pendingApprovalCount = await prisma.itemTransaction.count({
      where: {
        statusBorrow: "WAITAPPROVAL",
        borrowDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const membersCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const itemsCount = await prisma.item.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Previous month data
    const startOfLastMonth = moment()
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const endOfLastMonth = moment()
      .subtract(1, "month")
      .endOf("month")
      .toDate();

    const lastMonthTransactionsCount = await prisma.itemTransaction.count({
      where: {
        borrowDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const lastMonthPendingApprovalCount = await prisma.itemTransaction.count({
      where: {
        statusBorrow: "WAITAPPROVAL",
        borrowDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const lastMonthMembersCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const lastMonthItemsCount = await prisma.item.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Calculate changes
    const transactionChange = lastMonthTransactionsCount
      ? ((transactionsCount - lastMonthTransactionsCount) /
          lastMonthTransactionsCount) *
        100
      : 100;

    const approvalChange = lastMonthPendingApprovalCount
      ? ((pendingApprovalCount - lastMonthPendingApprovalCount) /
          lastMonthPendingApprovalCount) *
        100
      : 100;

    const membersChange = lastMonthMembersCount
      ? ((membersCount - lastMonthMembersCount) / lastMonthMembersCount) * 100
      : 100;

    const itemsChange = lastMonthItemsCount
      ? ((itemsCount - lastMonthItemsCount) / lastMonthItemsCount) * 100
      : 100;

    const statistics = {
      transactionsCount,
      pendingApprovalCount,
      membersCount,
      itemsCount,
      transactionChange: transactionChange.toFixed(1) + "% from last month",
      approvalChange: approvalChange.toFixed(1) + "% from last month",
      membersChange: membersChange.toFixed(1) + "% from last month",
      itemsChange: itemsChange.toFixed(1) + "% from last month",
    };

    return NextResponse.json(
      { success: true, message: "พบข้อมูล", data: statistics },
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
