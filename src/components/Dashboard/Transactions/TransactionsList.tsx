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
      <div className="self-stretch hidden sm:grid grid-cols-2 gap-8 py-3 mt-6 border-b border-b-grey-100">
        {/* recipent/sender, category */}
        <div className="min-w-[191px] max-w-[657px] grow shrink basis-0 h-auto justify-start items-center  gap-x-3 sm:gap-x-4 flex">
          <div className="h-full w-full min-w-[136px] flex flex-col sm:flex-row justify-between sm:items-center gap-x-0 sm:gap-x-8">
            <span className="w-[136px] sm:w-[282px]  sm:flex-grow-0 text-preset-5 text-grey-500 text-nowrap">
              Recipient / Sender
            </span>
            <span className="w-full sm:w-[120px] text-preset-5 text-grey-500 text-left">
              Category
            </span>
          </div>
        </div>
        {/* date & amount*/}
        <div className="sm:flex-row flex-col-reverse justify-between items-center gap-0 sm:gap-x-8 inline-flex">
          <span className="w-full sm:w-[120px] sm:text-left text-right text-preset-5 text-grey-500">
            Transaction Date
          </span>
          <span
            className={`w-full sm:w-[200px] text-preset-5 text-grey-500 text-right`}
          >
            Amount
          </span>
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
