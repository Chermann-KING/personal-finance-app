"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import OverviewIcon from "@/assets/images/icon-nav-overview.svg";
import TransactionsIcon from "@/assets/images/icon-nav-transactions.svg";
import BudgetsIcon from "@/assets/images/icon-nav-budgets.svg";
import PotsIcon from "@/assets/images/icon-nav-pots.svg";
import RecurringBillsIcon from "@/assets/images/icon-recurring-bills.svg";
import ToggleSidebarIcon from "@/assets/images/icon-minimize-menu.svg";
import LogoLarge from "@/assets/images/logo-large.svg";
import LogoSmall from "@/assets/images/logo-small.svg";

type SidebarItem = {
  label: string;
  icon: JSX.Element;
  route: string;
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const items: SidebarItem[] = [
    {
      label: "Overview",
      icon: <OverviewIcon />,
      route: "/dashboard/overview",
    },
    {
      label: "Transactions",
      icon: <TransactionsIcon />,
      route: "/dashboard/transactions",
    },
    {
      label: "Budgets",
      icon: <BudgetsIcon />,
      route: "/dashboard/budgets",
    },
    {
      label: "Pots",
      icon: <PotsIcon />,
      route: "/dashboard/pots",
    },
    {
      label: "Recurring bills",
      icon: <RecurringBillsIcon className="text-preset-2" />,
      route: "/dashboard/recurring-bills",
    },
  ];

  return (
    <>
      {/* Sidebar pour les écrans moyens et plus */}
      <aside
        className={`hidden md:flex flex-col justify-between pr-[22px] bg-grey-900 transition-all duration-300 ${
          isOpen ? "w-[300px]" : "w-[88px]"
        } py-9 rounded-r-2xl min-h-screen`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between text-white p-5">
          {isOpen ? <LogoLarge /> : <LogoSmall />}
        </div>

        {/* Navigation items */}
        <nav className="mt-[90px] flex flex-col flex-grow items-start space-y-4">
          {items.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => {
                router.push(item.route);
              }}
              className={`w-full flex items-center p-4 transition-all duration-500 border-l-4 rounded-r-xl ${
                pathname === item.route
                  ? "bg-beige-100 text-grey-900 border-l-[4px] border-green"
                  : "text-grey-300 border-transparent"
              }`}
            >
              {/* icon */}
              <span
                className={`w-auto h-6 ${
                  pathname === item.route ? "text-green" : ""
                }`}
              >
                {item.icon}
              </span>
              {/* label */}
              {isOpen && (
                <span
                  className={`pl-4 text-nowrap transition-opacity duration-500 ease-in-out ${
                    isOpen ? "opacity-100" : "opacity-0"
                  } transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-2"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Toggle Sidebar */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex items-center gap-3 text-grey-300 focus:outline-none px-5 py-5"
        >
          <ToggleSidebarIcon
            className={`transform ${isOpen ? "" : "rotate-180"}`}
          />
          {isOpen && (
            <span
              className={`pl-2 text-nowrap transition-opacity duration-500 ease-in-out ${
                isOpen ? "opacity-100" : "opacity-0"
              } transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "-translate-x-2"
              }`}
            >
              Minimize Menu
            </span>
          )}
        </button>
      </aside>

      {/* Navigation responsive pour mobile */}
      <nav className="z-50 flex md:hidden fixed bottom-[-1px] rounded-t-2xl w-full bg-grey-900 border-b border-b-grey-900 justify-between px-5 pt-2 h-[52px] sm:h-[74px]">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              router.push(item.route);
            }}
            className={`flex-1 flex flex-col items-center justify-center text-preset-5 font-bold ${
              pathname === item.route
                ? "bg-beige-100 text-grey-900 border-b-[4px] border-green"
                : "text-grey-300 border-transparent"
            } py-2 sm:py-3 rounded-t-2xl`}
          >
            {/* Icon toujours visible */}
            <span
              className={`w-auto h-6 ${
                pathname === item.route ? "text-green" : ""
              }`}
            >
              {item.icon}
            </span>
            {/* Label visible sur écrans > 640px */}
            <span className="hidden sm:block">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
