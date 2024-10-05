"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "../table/reusable-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Tag } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import DialogDelete from "../dialog/dialog-delete";
import AddEditBrandForm from "@/components/categories/brand-add-edit";

type Props = {
  categoryId: number;
  categoryName: string;
};

type ItemBrands = {
  id: number;
  name: string;
};

const ItemBrand = ({ categoryId, categoryName }: Props) => {
  const [data, setData] = useState<ItemBrands[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const columns: ColumnDef<ItemBrands>[] = [
    {
      accessorKey: "id",
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
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ชื่อ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      id: "actions",
      enableHiding: true,
      size: 25, // ขนาดที่เหมาะสมสำหรับปุ่มกระทำ
      header: () => <div className="p-0">กระทำ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <AddEditBrandForm
              item={row.original}
              categoryId={categoryId}
              reLoading={setLoading}
            />
            <DialogDelete
              urlAPI={`/api/brand-items/${row.getValue("id")}`}
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
        const resp = await axios.get(`/api/category-items/${categoryId}/brand`);
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
  }, [loading, categoryId]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="h-8 w-8 p-0 bg-green-600 hover:bg-green-500"
          variant="destructive"
        >
          <span className="sr-only">ข้อมูล</span>
          <Tag className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>{`ยี่ห้อ | หมวดหมู่${categoryName}`}</DialogTitle>
        </DialogHeader>
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          AddEditForm={() => (
            <AddEditBrandForm categoryId={categoryId} reLoading={setLoading} />
          )}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ItemBrand;
