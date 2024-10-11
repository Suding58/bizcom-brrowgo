"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, SquareArrowUp } from "lucide-react";
import DataTable from "../table/reusable-table";
import { ItemTransactions } from "@/interface";
import axios from "axios";
import { toast } from "sonner";
import { timeTH } from "@/utility/time-format";
import { getColorBackground } from "@/utility/transaction-status";
import { translateStatus } from "@/utility/item-status";

type Props = {
  itemId: number;
};

const ItemTransaction = ({ itemId }: Props) => {
  const [data, setData] = useState<ItemTransactions[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const columns: ColumnDef<ItemTransactions>[] = [
    {
      accessorKey: "id",
      // size: 10,
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
      accessorKey: "borrowerName",
      // size: 25,
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

        return (
          <Badge className={`${bgColor} text-white`}>
            {translateStatus(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "approvedBorrow",
      // size: 25,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ผู้อนุมัติยืม
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const approved = row.getValue("approvedBorrow");

        return <div>{`${approved ? approved : "รออนุมัติ"}`}</div>;
      },
    },

    {
      accessorKey: "returnDate",
      // size: 20,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่คืน
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const returnDate = row.getValue("returnDate");
        return (
          <div>
            {returnDate ? timeTH(row.getValue("returnDate")) : "ไม่พบข้อมูล"}
          </div>
        );
      },
    },
    {
      accessorKey: "statusReturn",
      // size: 10,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          สถานะคืน
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("statusReturn") as string;
        const bgColor = getColorBackground(status);

        return (
          <Badge className={`${bgColor} text-white`}>
            {translateStatus(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "approvedReturn",
      // size: 25,
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ผู้อนุมัติคืน
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const approved = row.getValue("approvedReturn");

        return <div>{`${approved ? approved : "รออนุมัติ"}`}</div>;
      },
    },
  ];

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(`/api/manage-items/transaction/${itemId}`);
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

    if (isOpen) fetchData();
  }, [isOpen, itemId]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="h-8 w-8 p-0 bg-green-600 hover:bg-green-500"
          variant="destructive"
        >
          <span className="sr-only">ข้อมูล</span>
          <SquareArrowUp className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>ข้อมูลการยืม/คืน</DialogTitle>
        </DialogHeader>
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          AddEditForm={() => <div></div>}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ItemTransaction;
