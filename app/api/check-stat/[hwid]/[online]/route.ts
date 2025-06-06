import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { hwid: string; online: string } }
) {
  try {
    const { hwid, online } = params;
    const isOnline = online.toLowerCase() === "true";


    const itemExits = await prisma.item.findFirst({
      where : {
        hwid : hwid
      }
    })

    if(!itemExits)
    {
      return NextResponse.json(
      {
        success: false,
        message: `Not fond hwid ${hwid}`,
      },
      { status: 200 }
    );
    }

    const updatedItems = await prisma.item.update({
      where: {
        hwid: hwid,
      },
      data: { isOnline },
    });

    return NextResponse.json(
      {
        success: updatedItems != null,
        message: updatedItems ? "อัพเดทสำเร็จ" : "อัพเดทไม่สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
