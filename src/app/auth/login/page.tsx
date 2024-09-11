"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import IllustrationAuth from "@/assets/images/illustration-authentication.svg";
import LogoLarge from "@/assets/images/logo-large.svg";
import ShowPasswordIcon from "@/assets/images/icon-show-password.svg";
import HidePasswordIcon from "@/assets/images/icon-hide-password.svg";
import InputField from "@/ui/InputField";
import Button from "@/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Assure que les données sont envoyées en JSON
        },
        body: JSON.stringify({ email, password }),
      });

      // Vérifie si la réponse contient un JSON
      let data;
      if (res.headers.get("content-type")?.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Réponse non JSON");
      }

      if (res.ok) {
        // Appel de la fonction login pour stocker le token
        login(data.token);
        // Redirection vers le tableau de bord après connexion réussie
        router.push("/dashboard/overview");
      } else {
        // Affiche l'erreur renvoyée par l'API
        setErrorMessage(
          data.error || "Informations d'identification non valides"
        );
      }
    } catch (error) {
      // Gère les erreurs côté client
      console.error("Erreur lors de la connexion :", error);
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };

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

      {/* Colonne de droite : Formulaire */}
      <div className="flex justify-center items-center flex-grow md:w-1/2 p-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-y-9 bg-white w-[560px]  shadow-md rounded-lg px-8 py-9"
        >
          <h2 className="text-preset-1">Login</h2>
          {errorMessage && (
            <p className="text-red text-preset-4">{errorMessage}</p>
          )}
          <div className="flex flex-col gap-y-5">
            <InputField
              type="email"
              name="email"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              icon={
                showPassword ? (
                  <HidePasswordIcon
                    className={"cursor-pointer"}
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <ShowPasswordIcon
                    className={"cursor-pointer"}
                    onClick={togglePasswordVisibility}
                  />
                )
              }
              helperText="Passwords must be at least 8 characters"
            />
          </div>
          <Button type="submit" variant="primary">
            Login
          </Button>

          <div className="text-center flex justify-center gap-2 text-preset-4 text-gray-500">
            <p>Need to create an account?</p>
            <Link
              href="/auth/register"
              className="text-gray-900 font-bold border-b border-black"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
