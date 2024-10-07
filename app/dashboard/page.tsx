"use client";

import LabelCount from "@/components/statistics/label-count";
import BarChartTransaction from "@/components/statistics/barchart-transaction";
import TransactionRecent from "@/components/statistics/transaction-recent";

const DashboardPage = () => {
  return (
    <div className="p-4">
      <LabelCount />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-4">
        <BarChartTransaction />
        <TransactionRecent />
      </div>
    </div>
  );
};

export default DashboardPage;
