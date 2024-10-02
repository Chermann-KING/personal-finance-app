import React from "react";
import BillItem from "./BillItem";
import { Transaction } from "@/types";

interface BillsListProps {
  bills: Transaction[];
}

const BillsList: React.FC<BillsListProps> = ({ bills }) => {
  return (
    <div className="flex flex-col">
      <div className=" hidden sm:grid grid-cols-12 gap-4 text-preset-5 text-grey-500 pb-3 border-b border-grey-100">
        <span className="w-[319px] text-left col-span-6 ">Bill Title</span>
        <div className="col-span-6 flex justify-between">
          <span className="w-[120px] text-left  col-span-3">Due Date</span>
          <span className="w-[100px] text-right col-span-3">Amount</span>
        </div>
      </div>
      <ul className="divide-y divide-grey-100">
        {bills.map((bill, index) => (
          <BillItem key={index} bill={bill} />
        ))}
      </ul>
    </div>
  );
};

export default BillsList;
