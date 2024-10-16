"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";

// Define interfaces for our data structures
interface Borrower {
  id: string;
  name: string;
  profileUrl: string;
  borrowCount: number;
}

interface Item {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  type: string;
  brand: string;
  borrowCount: number;
}

interface ApiResponse {
  topBorrowers: Borrower[];
  topItems: Item[];
}

const TopBorrowersAndItems = () => {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/statistics/top");
        const result = resp.data;
        if (result.success) {
          const top = result.data as ApiResponse;
          setData(top);
        } else {
          toast.warning(result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-2">
      <Card>
        <CardHeader>
          <CardTitle>ผู้ยืม/คืนสูงสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {data?.topBorrowers.map((borrower: Borrower, index: number) => (
              <li key={index} className="flex justify-between space-x-2 mb-2">
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={`/api/images/${
                        borrower.profileUrl
                          ? borrower.profileUrl
                          : `notfound/no_image.jpg`
                      }`}
                      alt={borrower.name}
                    />
                    <AvatarFallback>{borrower.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{borrower.name}</span>
                </div>

                <Badge variant="secondary">{borrower.borrowCount} ครั้ง</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>รายการยืม/คืนสูงสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {data?.topItems.map((item: Item, index: number) => (
              <li key={index} className="flex justify-between space-x-2 mb-2">
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={`/api/images/${
                        item.imageUrl ? item.imageUrl : `notfound/no_image.jpg`
                      }`}
                      alt={item.name}
                    />

                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.category}/{item.brand}/{item.type}
                    </p>
                  </div>
                </div>

                <Badge variant="secondary">{item.borrowCount} ครั้ง</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopBorrowersAndItems;
