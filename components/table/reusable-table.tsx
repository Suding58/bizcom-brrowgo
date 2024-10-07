"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import QRCodePrinter from "../item/qrcode-printer";
import { createRoot } from "react-dom/client"; // Import createRoot from react-dom/client
import { QrCode } from "lucide-react";

// Define T as Record<string, unknown> to let TypeScript understand that T is an object
interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  loading: boolean;
  AddEditForm?: React.FC<any> | null; // Adjust the props as needed
  qrCodePrint?: boolean | null; // Adjust the props as needed
}

const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  loading,
  AddEditForm,
  qrCodePrint,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      // Filter data in all columns
      return Object.values(row.original).some((value) =>
        String(value).toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="ค้นหา..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2 ml-2">
          {qrCodePrint && (
            <Button
              className="h-8 w-8 p-0"
              onClick={() => {
                const selectedRows = table.getFilteredSelectedRowModel().rows;
                const selectedUuids: { name: string; uuid: string }[] =
                  selectedRows.map((row) => ({
                    name: String(row.original.name),
                    uuid: String(row.original.uuid),
                  }));
                // Open QR Code Printer in a new window
                const printWindow = window.open("", "_blank");
                if (printWindow) {
                  printWindow.document.write("<html><head>");
                  printWindow.document.write("<title>รายการ QR Codes</title>");
                  printWindow.document.write("</head><body>");
                  printWindow.document.write('<div id="qr-print-root"></div>');
                  printWindow.document.write("</body></html>");
                  printWindow.document.close();

                  // Render QRCodePrinter in the new window
                  const rootElement =
                    printWindow.document.getElementById("qr-print-root");
                  if (rootElement) {
                    const root = createRoot(rootElement); // Create a root for the new window
                    root.render(<QRCodePrinter uuids={selectedUuids} />); // Use root.render instead of ReactDOM.render
                  }
                }
              }}
              disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            >
              <QrCode className="h-4 w-4" />
            </Button>
          )}
          {AddEditForm && <AddEditForm />}
        </div>
      </div>
      <div className="rounded-md border px-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  กำลังโหลด...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  ไม่มีข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ก่อนหน้า
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ถัดไป
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
