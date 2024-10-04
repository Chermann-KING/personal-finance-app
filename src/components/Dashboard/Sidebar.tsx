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

/**
 * Type représentant un élément du menu latéral (Sidebar).
 * @property {string} label - Le texte affiché pour l'élément.
 * @property {JSX.Element} icon - L'icône associée à l'élément.
 * @property {string} route - La route à laquelle l'élément redirige lorsqu'il est cliqué.
 */
type SidebarItem = {
  label: string;
  icon: JSX.Element;
  route: string;
};

/**
 * Composant `Sidebar` pour afficher le menu de navigation latéral et la barre de navigation mobile.
 *
 * Ce composant gère l'état d'ouverture ou de fermeture du menu latéral pour les écrans plus larges, et une navigation responsive pour les appareils mobiles.
 *
 * @returns {JSX.Element} - Le composant de la barre latérale et du menu de navigation mobile.
 */
const Sidebar = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true); // État d'ouverture ou de fermeture du menu
  const pathname = usePathname(); // Chemin de la page actuelle
  const router = useRouter(); // Utilisé pour rediriger les utilisateurs vers une autre page

  /**
   * Fonction pour basculer l'état ouvert/fermé du menu latéral.
   */
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Liste des éléments du menu latéral.
   */
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

        {/* Éléments de navigation */}
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
              {/* Icône */}
              <span
                className={`w-auto h-6 ${
                  pathname === item.route ? "text-green" : ""
                }`}
              >
                {item.icon}
              </span>
              {/* Libellé */}
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

        {/* Bouton pour basculer la barre latérale */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex items-center gap-3 text-grey-300 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-grey-500 transition-all duration-300 rounded-r-xl px-5 py-5"
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
            {/* Icône toujours visible */}
            <span
              className={`w-auto h-6 ${
                pathname === item.route ? "text-green" : ""
              }`}
            >
              {item.icon}
            </span>
            {/* Libellé visible uniquement sur les écrans >= 640px */}
            <span className="hidden sm:block">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
