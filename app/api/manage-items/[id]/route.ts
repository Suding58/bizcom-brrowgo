import { NextRequest, NextResponse } from "next/server";
import saveImage from "@/utility/save-image";
import prisma from "@/lib/prisma";
import { ItemStatus } from "@prisma/client";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const item = await prisma.item.findUnique({
    where: { id: parseInt(id) },
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
    },
  });

  if (!item) {
    return NextResponse.json(
      { success: false, message: "ไม่พบข้อมูล" },
      { status: 200 }
    );
  }

  // แปลงผลลัพธ์ให้เป็นโครงสร้างที่ต้องการ
  const formattedItems = {
    id: item.id,
    name: item.name,
    description: item.description,
    parcelNumber: item.parcelNumber,
    imageUrl: item.imageUrl,
    detailId: item.detailId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    category: item.detail.category.name, // แปลง category เป็น string
    brand: item.detail.brand.name, // แปลง brand เป็น string
    type: item.detail.type.name, // แปลง type เป็น string
    status: item.status,
    categoryId: item.detail.category.id,
    brandId: item.detail.brand.id,
    typeId: item.detail.type.id,
  };

  return NextResponse.json(
    { success: true, message: "พบข้อมูล", data: formattedItems },
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
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const parcelNumber = formData.get("parcelNumber") as string;
    const categoryId = parseInt(formData.get("categoryId") as string);
    const typeId = parseInt(formData.get("typeId") as string);
    const brandId = parseInt(formData.get("brandId") as string);
    const statusString = formData.get("status") as string;
    const image = formData.get("image") as File;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (
      !name ||
      !parcelNumber ||
      !categoryId ||
      !typeId ||
      !brandId ||
      !statusString
    ) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const itemExits = await prisma.item.findUnique({
      where: { id: Number(id) },
    });

    if (!itemExits) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข้อมูล",
        },
        { status: 200 }
      );
    }

    let imageUrl = null;
    if (image) {
      imageUrl = await saveImage("item", image);
      if (!imageUrl) {
        return NextResponse.json(
          { message: "ไม่สามารถบันทึกรูปภาพได้" },
          { status: 500 }
        );
      }
    }

    let itemStatus: ItemStatus;
    if (statusString === ItemStatus.AVAILABLE) {
      itemStatus = ItemStatus.AVAILABLE;
    } else if (statusString === ItemStatus.WAITAPPROVAL) {
      itemStatus = ItemStatus.WAITAPPROVAL;
    } else if (statusString === ItemStatus.BORROWED) {
      itemStatus = ItemStatus.BORROWED;
    } else {
      itemStatus = ItemStatus.MAINTENANCE;
    }

    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        name: name,
        description: description,
        parcelNumber: parcelNumber,
        imageUrl: imageUrl ? `item/${imageUrl}` : itemExits.imageUrl,
        status: itemStatus,
        detail: {
          update: {
            categoryId: categoryId,
            typeId: typeId,
            brandId: brandId,
          },
        },
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
    await prisma.item.delete({
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
