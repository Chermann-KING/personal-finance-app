import React from "react";
import { Transaction } from "@/types";
import Image from "next/image";
import BillDueIcon from "@/assets/images/icon-bill-due.svg";
import BillPaidIcon from "@/assets/images/icon-bill-paid.svg";
import { formatDayWithSuffix } from "@/utils/formatDayWithSuffix";

interface BillItemProps {
  bill: Transaction;
}

const BillItem: React.FC<BillItemProps> = ({ bill }) => {
  const { avatar, name, date, amount, recurring } = bill;

  // Date actuelle
  const today = new Date();

  // Convertir la date de la facture en objet Date
  const formattedDate = new Date(date);
  const day = formattedDate.getUTCDate();
  const suffixDay = formatDayWithSuffix(day);
  const dueDateText = `Monthly - ${suffixDay}`;

  // Déterminer l'état de la facture en prenant en compte la récurrence
  const isPaid = recurring === true && formattedDate < today && amount < 0; // Facture payée si date passée, montant négatif et récurrente
  const dueSoon =
    recurring === true &&
    formattedDate > today &&
    formattedDate.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000; // Si c'est dans 7 jours ou moins
  // const isUpcoming = recurring === true && formattedDate > today; // Si c'est dans le futur

  return (
    <li className="min-w-[303px] sm:w-full grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 py-5">
      {/* Avatar et nom */}
      <div className="w-[319px] flex items-center gap-x-3 col-span-6">
        <Image
          src={avatar}
          alt={name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <h3 className="text-preset-4 text-grey-900 font-bold">{name}</h3>
      </div>

      <div className="col-span-6 flex justify-between">
        {/* Date et icône */}
        <div className="w-[120px] text-left flex justify-start items-center gap-x-2 col-span-3">
          {/* Date */}
          <p className={`text-${isPaid ? "green" : "grey-500"} text-preset-5`}>
            {dueDateText}
          </p>

          {/* Icône */}
          <div>
            {isPaid ? (
              <BillPaidIcon className="text-green" />
            ) : dueSoon ? (
              <BillDueIcon className="text-red" />
            ) : null}
          </div>
        </div>

        {/* Montant */}
        <div className="w-[100px] text-right flex items-center col-span-3">
          <span
            className={`w-full text-${
              dueSoon ? "red" : isPaid ? "green" : "grey-900"
            } font-bold text-preset-4`}
          >
            ${Math.abs(amount).toFixed(2)}
          </span>
        </div>
      </div>
    </li>
  );
};

export default BillItem;
