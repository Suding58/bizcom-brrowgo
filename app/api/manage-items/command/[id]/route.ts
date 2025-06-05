import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const commands = await prisma.itemActionCommand.findMany({
    where: { itemId: parseInt(id) },
  });

  if (!commands) {
    return NextResponse.json(
      { success: false, message: "ไม่พบข้อมูล" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: true, message: "พบข้อมูล", data: commands },
    { status: 200 }
  );
}
