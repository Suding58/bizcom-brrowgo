import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import saveImage from "@/utility/save-image";
import { hashPassword } from "@/utility/bcrypt";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const cid = formData.get("cid") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const roleString = formData.get("role") as string;
    const image = formData.get("image") as File;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (
      !cid ||
      !username ||
      !password ||
      !name ||
      !phone ||
      !email ||
      !address ||
      !roleString ||
      !image
    ) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
          {
            cid,
          },
        ],
      },
    });

    if (user) {
      return NextResponse.json(
        { success: false, message: "ชื่อบัญชีผู้ใช่หรืออีเมลถูกใช้งานแล้ว" },
        { status: 200 }
      );
    }

    const imageName = await saveImage("user", image);
    if (!imageName) {
      return NextResponse.json(
        { error: "ไม่สามารถบันทึกรูปภาพได้" },
        { status: 500 }
      );
    }

    let role: Role;

    if (roleString === Role.ADMIN) {
      role = Role.ADMIN;
    } else {
      role = Role.USER; // Default to USER if not ADMIN
    }

    // บันทึกข้อมูลลงในฐานข้อมูล
    const passwordHash = await hashPassword(password);
    let newUser;
    try {
      newUser = await prisma.user.create({
        data: {
          cid,
          username,
          password: passwordHash,
          name,
          phone,
          email,
          profileUrl: `/uploads/user/${imageName}`,
          address,
          role,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { success: false, message: "ไม่สามารถสร้างรายการได้" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "สร้างรายการสำเร็จ", item: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
