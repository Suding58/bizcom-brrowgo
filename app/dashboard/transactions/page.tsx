"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import DataTable from "@/components/table/reusable-table";
import { ItemTransactions } from "@/interface";
import axios from "axios";
import { toast } from "sonner";
import { timeTH } from "@/utility/time-format";
import { getColorBackground } from "@/utility/transaction-status";
import { translateStatus } from "@/utility/item-status";
import DialogDelete from "@/components/dialog/dialog-delete";
import ChangeStatusBorrow from "@/components/item/change-status-borrow";
import ChangeStatusReturn from "@/components/item/change-status-return";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TransactionsPage = () => {
  const [data, setData] = useState<ItemTransactions[]>([]);
  const [loading, setLoading] = useState(true);

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
    {
      id: "actions",
      enableHiding: true,
      size: 10, // ขนาดที่เหมาะสมสำหรับปุ่มกระทำ
      header: () => <div className="p-0">กระทำ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ChangeStatusBorrow
                    statusBorrow={row.original.statusBorrow}
                    transactionId={row.original.id}
                    reLoading={setLoading}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">แก้ไขสถานะการยืม</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ChangeStatusReturn
                    statusReturn={row.original.statusReturn}
                    transactionId={row.original.id}
                    reLoading={setLoading}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">แก้ไขสถานะการคืน</TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
        const resp = await axios.get(`/api/transaction-items`);
        const result = resp.data;
        if (result.success) {
          setData(result.data);
        } else {
          toast.warning(result.message);
        }
      } catch (error: any) {
        console.error("Error fetching items:", error);
        toast.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loading]);

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      AddEditForm={() => <div></div>}
    />
  );
};

export default TransactionsPage;
