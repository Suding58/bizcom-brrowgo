"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  ClipboardCheck,
  TriangleAlert,
  UsersRound,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

// Define the type for the statistics data
interface Statistics {
  transactionsCount: number;
  transactionChange: string;
  pendingApprovalCount: number;
  approvalChange: string;
  membersCount: number;
  membersChange: string;
  itemsCount: number;
  itemsChange: string;
}

const LabelCount = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const resp = await axios.get("/api/statistics/label");
        const result = resp.data;
        if (result.success) {
          const data: Statistics = result.data;
          setStatistics(data);
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

    fetchStatistics();
  }, [loading]);

  if (loading || !statistics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">รายการยืม/คืน</CardTitle>
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.transactionsCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {statistics.transactionChange}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">รายการรอนุมัติ</CardTitle>
          <TriangleAlert className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.pendingApprovalCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {statistics.approvalChange}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">รายการสมาชิก</CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.membersCount}</div>
          <p className="text-xs text-muted-foreground">
            {statistics.membersChange}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">รายการสินค้า</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.itemsCount}</div>
          <p className="text-xs text-muted-foreground">
            {statistics.itemsChange}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabelCount;
