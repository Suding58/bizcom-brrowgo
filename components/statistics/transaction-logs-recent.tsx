"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { translateStatusLogs } from "@/utility/item-status";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileUrl?: string;
}

interface Item {
  id: number;
  name: string;
  status: string;
}

interface ItemTransactionLogs {
  id: number;
  action: string;
  description: string;
  item: Item;
  borrower: User;
  borrowDate: Date;
  returnDate: Date | null;
  statusBorrow: string;
  statusReturn: string;
  createdAt: Date;
}

const TransactionLogsRecent = () => {
  const [transactions, setTransactions] = useState<ItemTransactionLogs[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const resp = await axios.get("/api/transaction-logs");
        const result = resp.data;
        if (result.success) {
          const data: ItemTransactionLogs[] = result.data;
          setTransactions(data);
        } else {
          toast.warning(result.message);
        }
      } catch (error: any) {
        console.error("Error fetching items:", error);
        toast.error("Error fetching items:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>บันทึกยืม/คืน</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src={`/api/images/${
                  transaction.borrower.profileUrl
                    ? transaction.borrower.profileUrl
                    : `notfound/no_image.jpg`
                }`}
                alt={`avatar${transaction.borrower.id}`}
              />
              <AvatarFallback>{transaction.borrower.name[0]}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 text-center sm:text-left">
              <p className="text-sm font-medium leading-none">
                {`${transaction.borrower.name}/${translateStatusLogs(
                  transaction.action
                )}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.description}
              </p>
            </div>
            {/* <div className="ml-auto">
              <div className="flex flex-col items-end">
                <Badge
                  className={`${getColorBackground(
                    transaction.returnDate === null
                      ? transaction.statusBorrow
                      : transaction.statusReturn
                  )} text-white text-[10px]`}
                >
                  {translateStatusLogs(transaction.action)}
                </Badge>
              </div>
            </div> */}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TransactionLogsRecent;
