"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "@/ui/SearchBar";
import SortDropdown from "@/ui/SortDropdown";
import CategoriesDropdown from "@/ui/CategoriesDropdown";
import TransactionsList from "@/components/Dashboard/Transactions/TransactionsList";
import Pagination from "@/ui/Pagination";
import {
  useTransactionContext,
  TransactionProvider,
} from "@/context/TransactionContext";
import HeaderPage from "@/components/Dashboard/HeaderPage";
import { BudgetProvider } from "@/context/BudgetContext";

function TransactionsPage() {
  const { transactions, fetchTransactions } = useTransactionContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Latest");

  const [categoryFilter, setCategoryFilter] =
    useState<string>("All Transactions");

  // Le nombre total de transactions (à récupérer depuis l'API)
  const [totalTransactions, setTotalTransactions] = useState(0);

  // Nombre de transactions par page
  const transactionsPerPage = 10;

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

  // Fonction fetchData extraite et mémorisée avec useCallback pour éviter la boucle infinie
  const fetchData = useCallback(async () => {
    const sortOptionsMap: Record<string, string> = {
      Latest: "Latest",
      Oldest: "Oldest",
      "A to Z": "A to Z",
      "Z to A": "Z to A",
      Highest: "Highest",
      Lowest: "Lowest",
    };

    const { total } = await fetchTransactions({
      page: currentPage,
      searchQuery,
      sortBy: sortOptionsMap[sortBy],
      categoryFilter,
    });

    // Seulement mettre à jour si le total a changé
    setTotalTransactions(total);
  }, [currentPage, searchQuery, sortBy, categoryFilter, fetchTransactions]);

  // Fetch transactions chaque fois que l'un des filtres change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="self-stretch flex flex-col gap-y-8">
      {/* Header */}
      <HeaderPage title={"Transactions"} />

      {/* content */}
      <div className="self-stretch p-8 bg-white rounded-xl flex-col justify-start items-start">
        {/* actions */}
        <div className="self-stretch flex flex-row justify-between items-center gap-4 sm:gap-6 ">
          {/* search bar */}
          <SearchBar
            setSearchQuery={setSearchQuery}
            placeholderText="Search transaction"
          />
          {/* sort & filter */}
          <div className="w-full sm:w-auto  flex justify-end items-center gap-2 sm:gap-6 ">
            <SortDropdown
              label={true}
              setSortBy={setSortBy}
              setCurrentPage={setCurrentPage}
            />
            <CategoriesDropdown
              label={true}
              onOptionChange={(option) => setCategoryFilter(option)}
              inBudgetContext={false}
            />
          </div>
        </div>

        <TransactionsList transactions={transactions} />

        <Pagination
          currentPage={currentPage}
          setPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <TransactionProvider>
      <BudgetProvider>
        <TransactionsPage />
      </BudgetProvider>
    </TransactionProvider>
  );
}
