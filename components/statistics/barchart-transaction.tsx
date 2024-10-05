"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { toast } from "sonner";

interface ChartData {
  month: string;
  borrowed: number;
  returned: number;
}

interface Transaction {
  borrowDate: Date;
  returnDate: Date | null; // ใช้ null ถ้าอาจไม่มีค่า
  statusBorrow: "APPROVED" | "DECLINED"; // หรือประเภทที่เหมาะสม
}

const BarChartTransaction = () => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await axios.get("/api/statistics/barchart");
      const result = resp.data;
      if (result.success) {
        const transactions: Transaction[] = result.data;
        const monthlyData: {
          [key: string]: { borrowed: number; returned: number };
        } = {};

        transactions.forEach((transaction: Transaction) => {
          const month = new Date(transaction.borrowDate).toLocaleString(
            "default",
            { month: "long" }
          );

          if (!monthlyData[month]) {
            monthlyData[month] = { borrowed: 0, returned: 0 };
          }

          if (transaction.statusBorrow === "APPROVED") {
            monthlyData[month].borrowed += 1;
          }

          if (transaction.returnDate) {
            monthlyData[month].returned += 1;
          }
        });

        const formattedData = Object.keys(monthlyData).map((month) => ({
          month,
          borrowed: monthlyData[month].borrowed,
          returned: monthlyData[month].returned,
        }));

        setData(formattedData);
      } else {
        toast.warning(result.message);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>ข้อมูลกราฟแท่งการยืม/คืนรายเดือน</CardTitle>
          <CardDescription>สถิติการยืมและคืนรายเดือน</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center">
        <BarChart
          className="w-full"
          width={500} // กำหนดเป็นค่าเริ่มต้นหรือจะไม่กำหนดเลย
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="borrowed" fill="#82ca9d" name="การยืม" />
          <Bar dataKey="returned" fill="#8884d8" name="การคืน" />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default BarChartTransaction;
