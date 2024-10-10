import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

interface ItemCategory {
  name: string;
}

interface ItemType {
  name: string;
  categoryName: string;
}

interface ItemBrand {
  name: string;
  categoryName: string;
}

const itemCategories: ItemCategory[] = [
  { name: "อิเล็กทรอนิกส์" },
  { name: "เสื้อผ้า" },
  { name: "เครื่องใช้ไฟฟ้าในบ้าน" },
  { name: "หนังสือ" },
  { name: "ของเล่น" },
  { name: "อุปกรณ์กีฬา" },
  { name: "เฟอร์นิเจอร์" },
  { name: "ผลิตภัณฑ์ความงาม" },
  { name: "ยานยนต์" },
  { name: "ของชำ" },
];

const itemTypes: ItemType[] = [
  { name: "สมาร์ทโฟน", categoryName: "อิเล็กทรอนิกส์" },
  { name: "แล็ปท็อป", categoryName: "อิเล็กทรอนิกส์" },
  { name: "โทรทัศน์", categoryName: "อิเล็กทรอนิกส์" },
  { name: "หูฟัง", categoryName: "อิเล็กทรอนิกส์" },
  { name: "ตู้เย็น", categoryName: "เครื่องใช้ไฟฟ้าในบ้าน" },
  { name: "เครื่องซักผ้า", categoryName: "เครื่องใช้ไฟฟ้าในบ้าน" },
  { name: "ไมโครเวฟ", categoryName: "เครื่องใช้ไฟฟ้าในบ้าน" },
  { name: "นวนิยาย", categoryName: "หนังสือ" },
  { name: "ตำราเรียน", categoryName: "หนังสือ" },
  { name: "ฟิกเกอร์", categoryName: "ของเล่น" },
  { name: "เกมกระดาน", categoryName: "ของเล่น" },
  { name: "รองเท้าวิ่ง", categoryName: "อุปกรณ์กีฬา" },
  { name: "ดัมเบล", categoryName: "อุปกรณ์กีฬา" },
  { name: "โซฟา", categoryName: "เฟอร์นิเจอร์" },
  { name: "โต๊ะอาหาร", categoryName: "เฟอร์นิเจอร์" },
  { name: "ลิปสติก", categoryName: "ผลิตภัณฑ์ความงาม" },
  { name: "แชมพู", categoryName: "ผลิตภัณฑ์ความงาม" },
  { name: "ยางรถยนต์", categoryName: "ยานยนต์" },
  { name: "น้ำมันเครื่อง", categoryName: "ยานยนต์" },
  { name: "ซีเรียล", categoryName: "ของชำ" },
  { name: "พาสต้า", categoryName: "ของชำ" },
];

const itemBrands: ItemBrand[] = [
  { name: "แอปเปิ้ล", categoryName: "อิเล็กทรอนิกส์" },
  { name: "ซัมซุง", categoryName: "อิเล็กทรอนิกส์" },
  { name: "โซนี่", categoryName: "อิเล็กทรอนิกส์" },
  { name: "แอลจี", categoryName: "เครื่องใช้ไฟฟ้าในบ้าน" },
  { name: "เวิร์ลพูล", categoryName: "เครื่องใช้ไฟฟ้าในบ้าน" },
  { name: "เพนกวิน", categoryName: "หนังสือ" },
  { name: "แฮสโบร", categoryName: "ของเล่น" },
  { name: "ไนกี้", categoryName: "อุปกรณ์กีฬา" },
  { name: "อาดิดาส", categoryName: "อุปกรณ์กีฬา" },
  { name: "อิเกีย", categoryName: "เฟอร์นิเจอร์" },
  { name: "ลอรีอัล", categoryName: "ผลิตภัณฑ์ความงาม" },
  { name: "โตโยต้า", categoryName: "ยานยนต์" },
  { name: "เคลล็อกส์", categoryName: "ของชำ" },
  { name: "บาริลล่า", categoryName: "ของชำ" },
];
export async function POST() {
  try {
    // สร้างหมวดหมู่สินค้า
    const categoryMap: { [key: string]: number } = {};
    for (const category of itemCategories) {
      const createdCategory = await prisma.itemCategory.create({
        data: category,
      });
      categoryMap[category.name] = createdCategory.id;
    }

    // สร้างประเภทสินค้า
    for (const type of itemTypes) {
      await prisma.itemType.create({
        data: {
          name: type.name,
          itemCategoryId: categoryMap[type.categoryName],
        },
      });
    }

    // สร้างแบรนด์สินค้า
    for (const brand of itemBrands) {
      await prisma.itemBrand.create({
        data: {
          name: brand.name,
          itemCategoryId: categoryMap[brand.categoryName],
        },
      });
    }
    return NextResponse.json(
      { success: true, message: "สร้างรายการสำเร็จ" },
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
