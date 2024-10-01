import React from "react";
import Illustration from "@/assets/images/illustration-authentication.svg";
import LogoLarge from "@/assets/images/logo-large.svg";

/**
 * Composant IllustrationAuth pour afficher une illustration et un message marketing pour l'authentification.
 *
 * Ce composant est destiné à être utilisé sur des écrans de taille moyenne et plus grands (taille `md` et supérieure),
 * et affiche un logo, une illustration, ainsi qu'un message de bienvenue pour inciter les utilisateurs
 * à utiliser l'application pour suivre leurs finances personnelles.
 *
 * @returns JSX.Element
 */
const IllustrationAuth = () => {
  return (
    <div className="hidden relative md:flex p-5">
      <div className="w-full flex flex-col justify-center items-center overflow-hidden rounded-lg">
        {/* Logo de l'application */}
        <LogoLarge className={"absolute left-20 top-14 z-30 text-white"} />

        {/* Texte de présentation */}
        <div className="absolute left-0 bottom-14 text-left px-24">
          <h2 className="text-white text-preset-1 mb-4">
            Keep track of your money and save for your future
          </h2>
          <p className="text-white text-preset-4">
            Personal finance app puts you in control of your spending. Track
            transactions, set budgets, and add to savings pots easily.
          </p>
        </div>

        {/* Illustration */}
        <Illustration />
      </div>
    </div>
  );
};

export default IllustrationAuth;
