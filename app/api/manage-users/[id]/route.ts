import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import saveImage from "@/utility/save-image";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "ไม่พบข้อมูล" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      success: user != null,
      message: user ? "พบข้อมูล" : "ไม่พบข้อมูล",
      data: user,
    },
    { status: 200 }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const roleString = formData.get("role") as string;
    const image = formData.get("image") as File;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (!username || !name || !phone || !email || !address || !roleString) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }
    const userExits = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!userExits) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข้อมูล",
        },
        { status: 200 }
      );
    }

    let profileUrl = null;
    if (image) {
      profileUrl = await saveImage("user", image);
      if (!profileUrl) {
        return NextResponse.json(
          { message: "ไม่สามารถบันทึกรูปภาพได้" },
          { status: 500 }
        );
      }
    }

    let role: Role;

    if (roleString === Role.ADMIN) {
      role = Role.ADMIN;
    } else {
      role = Role.USER; // Default to USER if not ADMIN
    }

    const updatedItem = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username,
        name,
        phone,
        email,
        profileUrl: profileUrl ? `user/${profileUrl}` : userExits.profileUrl,
        address,
        role,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "แก้ไขข้อมูลสำเร็จ",
        data: updatedItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { message: "Error updating item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(
      { success: true, message: "ลบข้อมูลสำเร็จ" },
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
