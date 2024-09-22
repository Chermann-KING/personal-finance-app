import React from "react";
import { useBill } from "@/context/BillContext";

// Formater le montant
const formatCurrency = (amount: number) => {
  const formattedAmount = Math.abs(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formattedAmount;
};

const BillsSummary: React.FC = () => {
  const { paidBills, upcomingBills, dueSoonBills } = useBill();

  const totalPaid = paidBills.reduce(
    (acc, bill) => acc + Math.abs(bill.amount),
    0
  );
  const totalUpcoming = upcomingBills.reduce(
    (acc, bill) => acc + Math.abs(bill.amount),
    0
  );
  const totalDueSoon = dueSoonBills.reduce(
    (acc, bill) => acc + Math.abs(bill.amount),
    0
  );

  return (
    <div className="bg-white w-full flex flex-col justify-start px-5 pt-5 pb-1 rounded-xl">
      <h3 className="text-preset-3 font-bold text-grey-900">Summary</h3>
      <ul className="divide-y divide-grey-100">
        <li className="flex justify-between items-center text-preset-5 py-4">
          <span className="text-grey-500">Paid Bills</span>{" "}
          <span className="font-bold text-grey-900">
            {paidBills.length} ({formatCurrency(totalPaid)})
          </span>
        </li>
        <li className="flex justify-between items-center text-preset-5 py-4">
          <span className="text-grey-500">Total Upcoming</span>{" "}
          <span className="font-bold text-grey-900">
            {upcomingBills.length} ({formatCurrency(totalUpcoming)})
          </span>
        </li>
        <li className="flex justify-between items-center text-preset-5 text-red py-4">
          <span className="">Due Soon</span>{" "}
          <span className="font-bold">
            {dueSoonBills.length} ({formatCurrency(totalDueSoon)})
          </span>
        </li>
      </ul>
    </div>
  );
};

export default BillsSummary;
