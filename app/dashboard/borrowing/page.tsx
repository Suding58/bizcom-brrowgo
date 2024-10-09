"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DataTable from "@/components/table/reusable-table";
import DialogDelete from "@/components/dialog/dialog-delete";
import axios from "axios";
import { ItemWithTransaction } from "@/interface";
import { timeTH } from "@/utility/time-format";
import { getColorBackground } from "@/utility/transaction-status";
import { Badge } from "@/components/ui/badge";
import ChangeStatusBorrow from "@/components/item/change-status-borrow";

const ManageBorrowingTablePage = () => {
  const [data, setData] = useState<ItemWithTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<ItemWithTransaction>[] = [
    {
      accessorKey: "id",
      size: 10,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ลำดับ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      size: 15, // ขนาดที่เหมาะสมสำหรับชื่อรายการ
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ชื่อรายการ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category",
      size: 15, // ขนาดที่เหมาะสมสำหรับชื่อรายการ
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          หมวดหมู่/ประเภท/ยี่ห้อ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div>{`${item.category}/${item.type}/${item.brand}`}</div>;
      },
    },
    {
      accessorKey: "borrowerName",
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ผู้ยืม
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("borrowerName")}</div>,
    },
    {
      accessorKey: "borrowDate",
      // size: 20,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่ยืม
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{timeTH(row.getValue("borrowDate"))}</div>,
    },
    {
      accessorKey: "statusBorrow",
      // size: 10,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          สถานะยืม
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("statusBorrow") as string;
        const bgColor = getColorBackground(status);

        return <Badge className={`${bgColor} text-white`}>{status}</Badge>;
      },
    },
    {
      id: "imageUrl",
      enableHiding: true,
      size: 30, // ขนาดที่เหมาะสมสำหรับรูปภาพ
      header: () => <div className="p-0 w-30">รูปภาพ</div>,
      cell: ({ row }) => {
        const imageUrl = row.original.imageUrl as string | undefined;
        return (
          <div className="flex justify-start">
            <Image
              src={imageUrl ? imageUrl : "/logo/no_image.jpg"}
              alt={row.original.name}
              width={80} // กำหนดความกว้างของภาพ
              height={80} // กำหนดความสูงของภาพ
              priority={true}
              className="object-cover h-20 w-20" // กำหนด class สำหรับการจัดการสไตล์
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: true,
      size: 30, // ขนาดที่เหมาะสมสำหรับปุ่มกระทำ
      header: () => <div className="p-0">กระทำ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <ChangeStatusBorrow
              statusBorrow={row.original.statusBorrow}
              transactionId={row.original.id}
              reLoading={setLoading}
            />
            <DialogDelete
              urlAPI={`/api/transaction-items/${row.getValue("id")}`}
              reLoading={setLoading}
            />
          </div>
        );
      },
    },
  ];

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/manage-items/transaction/borrow");
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
  }, [loading]);

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        AddEditForm={() => <div></div>}
      />
    </div>
  );
};

export default ManageBorrowingTablePage;
