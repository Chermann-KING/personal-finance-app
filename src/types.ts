import { CategoryDropdownOptions } from "./ui/CategoriesDropdown";

export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

export interface Transaction {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

export interface Pot {
  name: string;
  target: number;
  total: number;
  theme: string;
}

export interface Budget {
  category: CategoryDropdownOptions;
  maximum: number;
  spent?: number;
  remaining?: number;
  theme: string;
  transactions?: Transaction[];
}

export interface Bill {
  paid: number;
  upcoming: number;
  dueSoon: number;
}

export interface FinancialData {
  balance: Balance;
  transactions: Transaction[];
  pots: Pot[];
  budgets: Budget[];
  bills: Bill;
}

export interface FetchOptions {
  page: number;
  searchQuery: string;
  sortBy: string;
  categoryFilter: string;
}
