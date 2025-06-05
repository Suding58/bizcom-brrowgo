import { NextRequest, NextResponse } from "next/server";
import saveImage from "@/utility/save-image";
import { v4 as uuidv4 } from "uuid"; // นำเข้า uuid
import prisma from "@/lib/prisma";
import { ItemStatus } from "@prisma/client";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.item.findMany({
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

  // แปลงผลลัพธ์ให้เป็นโครงสร้างที่ต้องการ
  const formattedItems = items.map((item) => ({
    id: item.id,
    uuid: item.uuid,
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
    hwid : item.hwid,
    status: item.status,
    categoryId: item.detail.category.id,
    brandId: item.detail.brand.id,
    typeId: item.detail.type.id,
  }));

  return NextResponse.json(
    { success: true, message: "พบข้อมูล", data: formattedItems },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const parcelNumber = formData.get("parcelNumber") as string;
    const categoryId = parseInt(formData.get("categoryId") as string);
    const typeId = parseInt(formData.get("typeId") as string);
    const brandId = parseInt(formData.get("brandId") as string);
    const hwid = formData.get("hwid") as string || "";
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

    // สร้าง ItemDetail
    let detailId;
    try {
      detailId = await prisma.itemDetail.create({
        data: {
          categoryId,
          brandId,
          typeId,
        },
      });
    } catch (error) {
      console.error("Error creating item detail:", error);
      return NextResponse.json(
        { error: "ไม่สามารถสร้างรายละเอียดรายการได้" },
        { status: 500 }
      );
    }

    const imageName = await saveImage("item", image);
    if (!imageName) {
      return NextResponse.json(
        { error: "ไม่สามารถบันทึกรูปภาพได้" },
        { status: 500 }
      );
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

    // บันทึกข้อมูลลงในฐานข้อมูล
    let newItem;
    try {
      newItem = await prisma.item.create({
        data: {
          name,
          uuid: uuidv4(),
          description,
          parcelNumber,
          status: itemStatus,
          imageUrl: `item/${imageName}`,
          hwid : hwid,
          detailId: detailId.id,
        },
      });
    } catch (error) {
      console.error("Error creating item:", error);
      return NextResponse.json(
        { error: "ไม่สามารถสร้างรายการได้" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "สร้างรายการสำเร็จ", data: newItem },
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
