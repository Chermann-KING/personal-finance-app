import React, { createContext, useState, useContext, ReactNode } from "react";
import { Transaction } from "@/types";
import financialData from "@/data/financialData.json";

interface BillContextProps {
  bills: Transaction[];
  paidBills: Transaction[];
  upcomingBills: Transaction[];
  dueSoonBills: Transaction[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

const BillContext = createContext<BillContextProps | undefined>(undefined);

export const useBill = () => {
  const context = useContext(BillContext);
  if (!context) {
    throw new Error("useBill must be used within a BillProvider");
  }
  return context;
};

export const BillProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bills] = useState<Transaction[]>(financialData.transactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Latest");

  const today = new Date();

  // Factures payées : Montant négatif et date dans le passé
  const paidBills = bills.filter(
    (bill) => bill.amount < 0 && new Date(bill.date) < today
  );

  // Factures à venir : récurrentes, montant négatif, date dans le futur
  const upcomingBills = bills.filter(
    (bill) =>
      bill.recurring === true && bill.amount < 0 && new Date(bill.date) > today
  );

  // Factures dues bientôt : récurrentes, montant négatif, date dans les 7 jours à venir
  const dueSoonBills = bills.filter((bill) => {
    const billDate = new Date(bill.date);
    const timeDifference = billDate.getTime() - today.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return (
      bill.recurring === true &&
      bill.amount < 0 &&
      daysDifference >= 0 &&
      daysDifference <= 7
    );
  });

  // Filtrer par la recherche
  const filteredBills = bills.filter((bill) =>
    bill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Appliquer le tri
  const sortedBills = filteredBills.sort((a, b) => {
    if (sortBy === "Latest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0; // Ajouter d'autres options de tri ici
  });

  return (
    <BillContext.Provider
      value={{
        bills: sortedBills,
        paidBills,
        upcomingBills,
        dueSoonBills,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};
