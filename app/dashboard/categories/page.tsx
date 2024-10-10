"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DataTable from "@/components/table/reusable-table";
import DialogDelete from "@/components/dialog/dialog-delete";
import axios from "axios";
import ItemType from "@/components/categories/item-type";
import ItemBrand from "@/components/categories/item-brand";
import AddEditCategoryForm from "@/components/categories/category-add-edit";

type ItemCategory = {
  id: number;
  name: string;
};
const ManageCategoryTablePage = () => {
  const [data, setData] = useState<ItemCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<ItemCategory>[] = [
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
      size: 60,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ชื่อหมวดหมู่
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      id: "actions",
      enableHiding: true,
      size: 30, // ขนาดที่เหมาะสมสำหรับปุ่มกระทำ
      header: () => <div className="p-0">กระทำ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <AddEditCategoryForm
              isDefault={false}
              item={row.original}
              reLoading={setLoading}
            />
            <ItemType
              categoryId={row.original.id}
              categoryName={row.original.name}
            />
            <ItemBrand
              categoryId={row.original.id}
              categoryName={row.original.name}
            />
            <DialogDelete
              urlAPI={`/api/category-items/${row.getValue("id")}`}
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
        const resp = await axios.get("/api/category-items/list");
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
        AddEditForm={() => (
          <AddEditCategoryForm isDefault={true} reLoading={setLoading} />
        )}
      />
    </div>
  );
};

export default ManageCategoryTablePage;
