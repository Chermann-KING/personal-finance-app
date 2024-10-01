"use client";

import React from "react";
import { BillProvider, useBill } from "@/context/BillContext";
import SearchBar from "@/ui/SearchBar";
import SortDropdown from "@/ui/SortDropdown";
import BillsList from "@/components/Dashboard/Bills/BillsList";
import BillsSummary from "@/components/Dashboard/Bills/BillsSummary";
import TotalBills from "@/components/Dashboard/Bills/TotalBills";
import HeaderPage from "@/components/Dashboard/HeaderPage";

const RecurringBillsPage = () => {
  const { bills, setSearchQuery, setSortBy } = useBill();

  return (
    <div className="self-stretch flex flex-col gap-y-8">
      {/* header */}
      <HeaderPage title="Recurring Bills" />

      {/* content */}
      <div className="flex justify-between gap-x-6">
        {/* total bills & summary */}
        <div className="w-[337px] h-[418px] flex flex-col gap-y-6">
          <TotalBills />
          <BillsSummary />
        </div>

        {/* bills list */}
        <div className="w-[669px] bg-white flex flex-col gap-y-6 p-8 rounded-xl">
          {/* search & sort by */}
          <div className="flex justify-between items-center ">
            <SearchBar
              setSearchQuery={setSearchQuery}
              placeholderText="Search bills"
            />
            {/* sort by */}
            <SortDropdown
              setSortBy={setSortBy}
              setCurrentPage={() => {}}
              label={true}
            />
          </div>
          <BillsList bills={bills} />
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <BillProvider>
      <RecurringBillsPage />
    </BillProvider>
  );
}
