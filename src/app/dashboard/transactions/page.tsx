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
    <div className="flex-grow h-auto px-10 py-9 flex-col justify-start items-center gap-8">
      {/* title page */}
      <div className="mb-10 mx-auto w-[1140px] h-14 py-2 justify-start items-center gap-6">
        <h1 className="text-grey-900 text-preset-1">Transactions</h1>
      </div>

      {/* content */}
      <div className="mx-auto w-[1140px] p-8 bg-white rounded-xl flex-col justify-start items-start">
        {/* actions */}
        <div className="self-stretch justify-between items-center flex">
          {/* search bar */}
          <div className="w-80 flex-col justify-start items-start gap-1 inline-flex">
            <SearchBar setSearchQuery={setSearchQuery} />
          </div>
          {/* filter */}
          <div className="justify-end items-center gap-6 flex">
            {/* sort by */}
            <div className="justify-start items-center gap-2 flex">
              {/* title */}
              <div className="text-grey-500 text-preset-4">Sort by</div>
              {/* dropdown sort by */}
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <SortDropdown
                  setSortBy={setSortBy}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
            {/* category */}
            <div className="justify-start items-center gap-2 flex">
              {/* title */}
              <div className="text-grey-500 text-preset-4">Category</div>
              {/* dropdown category */}
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <CategoriesDropdown
                  onOptionChange={(option) => setCategoryFilter(option)}
                />
              </div>
            </div>
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
