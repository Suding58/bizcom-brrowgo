"use client";

import LabelCount from "@/components/statistics/label-count";
import BarChartTransaction from "@/components/statistics/barchart-transaction";
import TransactionRecent from "@/components/statistics/transaction-recent";
import TopBorrowersAndItems from "@/components/statistics/top-borrowers-items";
const DashboardPage = () => {
  return (
    <div className="p-4">
      <LabelCount />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4 mt-4">
        <BarChartTransaction />
        <TopBorrowersAndItems />
        <TransactionRecent />
      </div>
    </div>
  );
};

export default DashboardPage;
