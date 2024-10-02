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
      <div className="w-full flex flex-col md:flex-row gap-6 pb-0 sm:pb-20 md:pb-0 lg:pb-0">
        {/* total bills & summary */}
        <div className="w-full md:h-[204px] lg:h-[418px] flex flex-col sm:flex-row md:flex-col gap-6 md:gap-x-6">
          <TotalBills />
          <BillsSummary />
        </div>

        {/* bills list */}
        <div className="w-full lg:w-[669px] bg-white flex flex-col gap-y-6 p-8 rounded-xl">
          {/* search & sort by */}
          <div className="flex justify-between items-center gap-6">
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
