"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  active: boolean;
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string>("Overview");
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const items: SidebarItem[] = [
    {
      label: "Overview",
      icon: <OverviewIcon />,
      route: "/dashboard/overview",
      active: activeItem === "Overview",
    },
    {
      label: "Transactions",
      icon: <TransactionsIcon />,
      route: "/dashboard/transactions",
      active: activeItem === "Transactions",
    },
    {
      label: "Budgets",
      icon: <BudgetsIcon />,
      route: "/dashboard/budgets",
      active: activeItem === "Budgets",
    },
    {
      label: "Pots",
      icon: <PotsIcon />,
      route: "/dashboard/pots",
      active: activeItem === "Pots",
    },
    {
      label: "Recurring bills",
      icon: <RecurringBillsIcon className="text-preset-2" />,
      route: "/dashboard/recurring-bills",
      active: activeItem === "Recurring bills",
    },
  ];

  return (
    <aside
      className={`relative min-h-screen flex flex-col justify-between bg-grey-900 transition-all duration-300 ${
        isOpen ? "w-[300px]" : "w-[88px]"
      } py-9 pr-6 rounded-r-2xl`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between text-white p-5">
        {isOpen ? <LogoLarge /> : <LogoSmall />}
      </div>

      {/* Navigation items */}
      <nav className="mt-[90px] flex flex-col flex-grow items-start space-y-4">
        {items.map((item) => (
          // item
          <button
            type="button"
            key={item.label}
            onClick={() => {
              setActiveItem(item.label);
              router.push(item.route);
            }}
            className={`w-full flex items-center p-4 transition-all duration-500 border-l-4 rounded-r-xl ${
              item.active
                ? "bg-beige-100 text-grey-900 border-green"
                : "text-grey-300 border-transparent"
            }`}
          >
            {/* icon */}
            <span className={`w-6 h-6 ${item.active ? "text-green" : ""}`}>
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
  );
};

export default Sidebar;
