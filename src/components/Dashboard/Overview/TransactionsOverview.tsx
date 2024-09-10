import React from "react";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";
import Image from "next/image";
// import { useRouter } from "next/router";

interface Transaction {
  name: string;
  category: string;
  date: string;
  amount: number;
  avatar: string;
}

interface TransactionsOverviewProps {
  transactions: Transaction[];
}

const TransactionsOverview: React.FC<TransactionsOverviewProps> = ({
  transactions,
}) => {
  // const router = useRouter();

  // const handleSeeDetails = () => {
  //   router.push("/dashboard/transactions");
  // };

  // Formater le montant avec un signe positif ou négatif
  const formatCurrency = (amount: number) => {
    const formattedAmount = Math.abs(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    return amount >= 0 ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  return (
    <div className="w-[608px] h-[519px] flex flex-col justify-start gap-y-8 bg-white rounded-lg p-8">
      {/* header */}
      <div className="flex justify-between items-center">
        <h2 className="text-preset-2 text-grey-900">Transactions</h2>
        <button
          type="button"
          className="flex items-center gap-x-3 text-preset-4 text-grey-500"
          // onClick={handleSeeDetails}
        >
          View All <CaretRightIcon />
        </button>
      </div>
      <ul className="divide-y divide-solid divide-grey-100">
        {transactions.map((transaction, index) => (
          <li key={index} className="flex justify-between items-center py-5">
            {/* avatar & name */}
            <div className="flex items-center gap-x-4">
              <Image
                src={transaction.avatar}
                alt={`${transaction.name} avatar`}
                width={40}
                height={40}
                className="rounded-full"
              />
              <p className="text-preset-4 text-grey-900 font-bold">
                {transaction.name}
              </p>
            </div>
            {/* transaction & date */}
            <div className=" flex flex-col justify-center gap-y-2 text-right">
              <p
                className={`text-preset-4 font-bold ${
                  transaction.amount < 0 ? "text-grey-900" : "text-green"
                }`}
              >
                {formatCurrency(transaction.amount)}
              </p>
              <p className="text-preset-5 text-grey-500">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsOverview;
