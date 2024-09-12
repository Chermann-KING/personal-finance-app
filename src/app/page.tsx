"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import IllustrationAuth from "@/assets/images/illustration-authentication.svg";
import LogoLarge from "@/assets/images/logo-large.svg";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard/overview");
    } else {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center  bg-beige-100 p-5">
      {/* Colonne de gauche : Illustration */}
      <div className="hidden relative md:flex flex-col justify-center items-center  max-w-[560px] max-h-[920px] overflow-hidden rounded-lg">
        <LogoLarge className={"absolute left-10 top-10 z-30 text-white"} />
        <div className="absolute left-0 bottom-10 text-left pl-10 pr-20">
          <h2 className="text-white text-preset-1 mb-4">
            Keep track of your money and save for your future
          </h2>
          <p className="text-white text-preset-4">
            Personal finance app puts you in control of your spending. Track
            transactions, set budgets, and add to savings pots easily.
          </p>
        </div>
        <IllustrationAuth className={""} />
      </div>

      {/* Colonne de droite : xxx */}
      <div className="flex justify-center items-center flex-grow md:w-1/2 p-8">
        <span className="text-preset-1 font-bold">Loading...</span>
      </div>
    </div>
  );
}
