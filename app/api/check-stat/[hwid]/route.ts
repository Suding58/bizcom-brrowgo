import { NextRequest, NextResponse } from "next/server";
import saveImage from "@/utility/save-image";
import prisma from "@/lib/prisma";
import { ItemStatus } from "@prisma/client";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { hwid: string } }
) {
  const { hwid } = params;

  const item = await prisma.item.findUnique({
    where: { hwid: hwid }
  });

  if (!item) {
    return NextResponse.json(
      { success: false, message: "ไม่พบข้อมูล" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: true, message: "พบข้อมูล", data: item },
    { status: 200 }
  );
}