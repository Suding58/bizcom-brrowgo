"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/interface";
import AddEditUserForm from "@/components/user/user-add-edit";
import DataTable from "@/components/table/reusable-table";
import DialogDelete from "@/components/dialog/dialog-delete";
import axios from "axios";

const ManageUserTablePage = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "username",
      size: 10, // ขนาดที่เหมาะสมสำหรับชื่อรายการ
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ชื่อบัญชีผู้ใช้
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("username")}</div>,
    },
    {
      accessorKey: "name",
      size: 10,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ชื่อ-สกุล
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "phone",
      size: 10,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          เบอร์ติดต่อ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "email",
      size: 10,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          อีเมล
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },

    {
      accessorKey: "role",
      size: 10, // ขนาดที่เหมาะสมสำหรับสถานะ
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          บทบาท
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        let backgroundColor;
        const role = String(row.getValue("role"));
        switch (role) {
          case "USER":
            backgroundColor = "bg-green-500 hover:bg-green-400"; // สีเขียว
            break;
          case "ADMIN":
            backgroundColor = "bg-red-500 hover:bg-red-400"; // สีแดง
            break;
          default:
            backgroundColor = "bg-gray-500 hover:bg-gray-400"; // สีเทาเป็นค่าเริ่มต้น
        }

        return (
          <Badge className={`${backgroundColor} text-white`}>{role}</Badge>
        );
      },
    },
    {
      id: "profileUrl",
      enableHiding: true,
      size: 20, // ขนาดที่เหมาะสมสำหรับรูปภาพ
      header: () => <div className="p-0">รูปภาพ</div>,
      cell: ({ row }) => {
        const profileUrl = row.original.profileUrl as string | undefined;
        return (
          <div className="flex justify-start">
            <Image
              src={profileUrl ? profileUrl : "/logo/no_image.jpg"}
              alt={row.original.name}
              width={80} // กำหนดความกว้างของภาพ
              height={80} // กำหนดความสูงของภาพ
              className="object-cover h-20 w-20" // กำหนด class สำหรับการจัดการสไตล์
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: true,
      size: 25, // ขนาดที่เหมาะสมสำหรับปุ่มกระทำ
      header: () => <div className="p-0">กระทำ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <AddEditUserForm user={row.original} reLoading={setLoading} />
            <DialogDelete
              urlAPI={`/api/manage-users/${row.getValue("id")}`}
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
        const resp = await axios.get("/api/manage-users");
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
          <AddEditUserForm {...props} reLoading={setLoading} />
        )}
      />
    </div>
  );
};

export default ManageUserTablePage;
