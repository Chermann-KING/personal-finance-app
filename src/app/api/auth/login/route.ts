import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import connectToDatabase from "@/lib/db";
import { sign } from "jsonwebtoken";
import { loginAttempts } from "@/lib/loginAttempts";
import User from "@/models/User"; // Modèle Mongoose pour User

export async function POST(req: Request) {
  try {
    // Récupère et normalise les données d'email et de mot de passe
    const { email, password } = await req.json();
    const normalizedEmail = email.trim().toLowerCase();

    const now = Date.now();
    const attempts = loginAttempts[normalizedEmail] || [];

    // Filtre les tentatives récentes (moins de 60 secondes)
    loginAttempts[normalizedEmail] = attempts.filter(
      (attempt) => now - attempt < 60000
    );

    // Vérification des tentatives après filtrage
    if (loginAttempts[normalizedEmail].length > 4) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Ajoute une nouvelle tentative de connexion
    loginAttempts[normalizedEmail].push(now);

    // Connexion à la base de données
    await connectToDatabase();

    // Recherche de l'utilisateur avec Mongoose
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    // Vérifie la validité du mot de passe
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Génération du token JWT
    const token = sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "1h" } // Le token expire dans 1 heure
    );

    // Génération du token de rafraîchissement
    const refreshToken = sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" } // Le token expire dans 7 jours
    );

    // Création de la réponse avec les cookies pour le token et le refreshToken
    const response = NextResponse.json(
      {
        message: "Login successful",
        token,
        refreshToken,
      },
      { status: 200 }
    );

    // Définit le token JWT dans un cookie (httpOnly)
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600, // 1 heure
    });

    // Stocke également le refreshToken
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600 * 24 * 7, // 7 jours
    });

    return response;
  } catch (error) {
    console.error("Erreur lors du traitement de la requête :", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
