"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Item } from "@/interface";
import DataTable from "@/components/table/reusable-table";
import AddEditItemForm from "@/components/item/item-add-edit";
import ItemBorrowRecord from "@/components/item/item-transaction";
import DialogDelete from "@/components/dialog/dialog-delete";
import axios from "axios";
import { getColorBackground } from "@/utility/item-status";
import { Checkbox } from "@/components/ui/checkbox";

const ManageItemsTablePage = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<Item>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      size: 5, // เพิ่มขนาดให้เหมาะสม
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
      accessorKey: "parcelNumber",
      size: 10, // ขนาดที่เหมาะสมสำหรับชื่อรายการ
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          เลขทะเบียน
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("parcelNumber")}</div>,
    },
    {
      accessorKey: "category",
      size: 5, // ขนาดที่เหมาะสมสำหรับหมวดหมู่
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          หมวดหมู่
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "type",
      size: 5, // ขนาดที่เหมาะสมสำหรับประเภท
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ประเภท
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "brand",
      size: 10, // ขนาดที่เหมาะสมสำหรับยี่ห้อ
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ยี่ห้อ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("brand")}</div>,
    },
    {
      accessorKey: "status",
      size: 10, // ขนาดที่เหมาะสมสำหรับสถานะ
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          สถานะ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = String(row.getValue("status"));
        const backgroundColor = getColorBackground(status);
        return (
          <Badge className={`${backgroundColor} text-white`}>{status}</Badge>
        );
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
      size: 10, // ขนาดที่เหมาะสมสำหรับปุ่มกระทำ
      header: () => <div className="p-0">กระทำ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <AddEditItemForm item={row.original} reLoading={setLoading} />
            <ItemBorrowRecord itemId={row.original.id} />
            <DialogDelete
              urlAPI={`/api/manage-items/${row.getValue("id")}`}
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
        const resp = await axios.get("/api/manage-items");
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
        AddEditForm={(props) => (
          <AddEditItemForm {...props} reLoading={setLoading} />
        )}
        qrCodePrint={true}
      />
    </div>
  );
};

export default ManageItemsTablePage;
