import React from "react";
import TransactionItem from "./TransactionItem";
import { Transaction } from "@/types";

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* transactions list header */}
      <div className="px-4 py-3 justify-start items-center gap-8 flex mt-6">
        <div className="grow shrink basis-0 text-[#696868] text-xs font-normal font-['Public Sans'] leading-[18px]">
          Recipient / Sender
        </div>
        <div className="w-[120px] text-[#696868] text-xs font-normal font-['Public Sans'] leading-[18px]">
          Category
        </div>
        <div className="w-[120px] text-[#696868] text-xs font-normal font-['Public Sans'] leading-[18px]">
          Transaction Date
        </div>
        <div className="w-[200px] text-right text-[#696868] text-xs font-normal font-['Public Sans'] leading-[18px]">
          Amount
        </div>
      </div>
      {/* transactions list */}
      <ul className="self-stretch flex-col justify-start items-start flex divide-y divide-grey-100">
        {transactions.map((transaction, index) => (
          <TransactionItem key={index} transaction={transaction} />
        ))}
      </ul>
    </div>
  );
};

export default TransactionsList;
