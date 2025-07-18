import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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