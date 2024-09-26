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
    <div className="flex-grow h-auto max-w-[1140px] py-9 flex-col justify-start items-center gap-8">
      {/* title page */}
      <div className="mb-10 mx-auto max-w-[1140px] h-14 py-2 justify-start items-center gap-6">
        <h1 className="text-grey-900 text-preset-1 font-bold">Transactions</h1>
      </div>

      {/* content */}
      <div className="mx-auto w-full p-8 bg-white rounded-xl flex-col justify-start items-start">
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
      <TransactionsPage />
    </TransactionProvider>
  );
}
