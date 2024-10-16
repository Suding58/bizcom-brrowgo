"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";
import { Item } from "@/interface";
import { getColorBackground, translateStatus } from "@/utility/item-status";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import BorrowReturnItemForm from "@/components/dialog/borrow-return-item";
import Link from "next/link";
import { timeTH } from "@/utility/time-format";

const BorrowPage = ({ params }: { params: { uuid: string } }) => {
  const { uuid } = params;
  const [data, setData] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(`/api/manage-items/uuid/${uuid}`);
        const result = resp.data;
        if (result.success) {
          setData(result.data);
        } else {
          toast.warning(result.message);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error saving user:", error);
          toast.error(error.message); // Use error.message for a user-friendly message
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred."); // Fallback error message
        }
      } finally {
        setLoading(false);
      }
    };

    if (loading) fetchData();
  }, [loading, uuid]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-950">
      <Card className="max-w-[500px] opacity-90">
        <CardHeader>
          <CardTitle className="text-xl">ข้อมูลรายการ</CardTitle>
          {!loading && (
            <CardDescription>{`สถานะรายการ | ${data?.name}`}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="grid gap-2">
          {loading ? (
            // แสดง Skeleton Loader ขณะโหลดข้อมูล
            <div className="flex flex-col w-full gap-2">
              <Skeleton className="h-6" />
              <Skeleton className="h-50 w-[250px]" />
              <Skeleton className="h-20" />
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
            </div>
          ) : (
            <div className="grid gap-2">
              <Image
                src={`/api/images/${
                  data?.imageUrl ? data?.imageUrl : `notfound/no_image.jpg`
                }`}
                alt={uuid}
                width={80} // กำหนดความกว้างของภาพ
                height={80} // กำหนดความสูงของภาพ
                priority={true}
                className="object-cover min-w-[250px] justify-self-center rounded-sm" // กำหนด class สำหรับการจัดการสไตล์
              />
              <Badge
                className={`${getColorBackground(
                  data?.status ? data.status : ""
                )} text-white justify-self-center text-sm`}
              >
                {translateStatus(data?.status ? data.status : "")}
              </Badge>
              <Label className="text-md">
                {`หมายเลข: ${data?.parcelNumber}`}{" "}
              </Label>
              <Label className="text-md">{`ชื่อ: ${data?.name}`} </Label>
              <Label className="text-md">{`หมวดหมู่/ประเภท/ยี่ห้อ: ${data?.category}/${data?.type}/${data?.brand}`}</Label>
              {data?.status !== "MAINTENANCE" && data?.borrowerName && (
                <Label className="text-md">
                  {`ผู้ยืม: ${data?.borrowerName} | ${data?.borrowerPhone}`}{" "}
                </Label>
              )}
              {data?.status !== "MAINTENANCE" && data?.borrowDate && (
                <Label className="text-md">
                  {`วันที่ยืม: ${timeTH(data.borrowDate)}`}
                </Label>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col justify-center gap-1">
          {(data?.status === "AVAILABLE" || data?.status === "BORROWED") && (
            <BorrowReturnItemForm
              type={data.status}
              itemId={data.id}
              reLoading={setLoading}
            />
          )}
          <div className="mt-4 text-center text-sm">
            ไม่มีบัญชีผู้ใช้ ?
            <Link href="/register" className="underline">
              ลงทะเบียน
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BorrowPage;
