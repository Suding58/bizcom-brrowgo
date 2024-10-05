import { writeFile, mkdir } from "fs/promises"; // นำเข้า mkdir
import path from "path";
import { v4 as uuidv4 } from "uuid"; // นำเข้า uuid

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const saveImage = async (
  group: string,
  image: File
): Promise<string | false> => {
  // ตรวจสอบประเภทของไฟล์
  if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
    console.error("Unsupported file type:", image.type);
    return false;
  }

  // ตรวจสอบขนาดไฟล์
  if (image.size > MAX_FILE_SIZE) {
    console.error("File size exceeds the limit of 5MB");
    return false;
  }

  // สร้างชื่อไฟล์ด้วย UUID
  const imageName = `${uuidv4()}${path.extname(image.name)}`; // Use path.extname to get the correct extension
  const uploadsDir = path.join(process.cwd(), "public", "uploads", group);
  const imagePath = path.join(uploadsDir, imageName);

  // ตรวจสอบและสร้างโฟลเดอร์ uploads ถ้ายังไม่มีอยู่
  try {
    await mkdir(uploadsDir, { recursive: true }); // สร้างโฟลเดอร์ถ้ายังไม่มี
  } catch (error) {
    console.error("Error creating uploads directory:", error);
    return false;
  }

  // บันทึกไฟล์รูปภาพ
  try {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(imagePath, buffer);
  } catch (error) {
    console.error("Error saving image:", error);
    return false;
  }

  return imageName; // คืนชื่อไฟล์ที่บันทึก
};

export default saveImage; // ส่งออกฟังก์ชัน
