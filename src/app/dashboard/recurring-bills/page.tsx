"use client";

import React from "react";
import { BillProvider, useBill } from "@/context/BillContext";
import SearchBar from "@/ui/SearchBar";
import SortDropdown from "@/ui/SortDropdown";
import BillsList from "@/components/Dashboard/Bills/BillsList";
import BillsSummary from "@/components/Dashboard/Bills/BillsSummary";
import TotalBills from "@/components/Dashboard/Bills/TotalBills";

const RecurringBillsPage = () => {
  const { bills, setSearchQuery, setSortBy } = useBill();

  return (
    <div className="flex-grow h-auto px-10 py-9 flex-col justify-start items-center gap-8">
      {/* title page */}
      <div className="mb-10 mx-auto w-[1060px] h-14 py-2 justify-start items-center gap-6">
        <h1 className="text-grey-900 text-preset-1">Recurring Bills</h1>
      </div>
      {/* content */}
      <div className="mx-auto w-[1060px] flex justify-between gap-x-6">
        {/* total bills & summary */}
        <div className="w-[337px] h-[418px] flex flex-col gap-y-6">
          <TotalBills />
          <BillsSummary />
        </div>

        {/* bills list */}
        <div className="w-[669px] bg-white flex flex-col gap-y-6 p-8 rounded-xl">
          {/* search & sort by */}
          <div className="flex justify-between items-center ">
            <div className="w-[320px]">
              <SearchBar
                setSearchQuery={setSearchQuery}
                placeholderText="Search bills"
              />
            </div>
            {/* sort by */}
            <div className="w-[169px] flex justify-between items-center">
              <span className="text-grey-500 text-preset-4">Sort by</span>
              <SortDropdown setSortBy={setSortBy} setCurrentPage={() => {}} />
            </div>
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
