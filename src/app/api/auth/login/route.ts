import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { sign } from "jsonwebtoken";
import { loginAttempts } from "@/lib/loginAttempts";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const now = Date.now();
    const attempts = loginAttempts[email] || [];

    // Filtre les tentatives récentes (moins de 60 secondes)
    loginAttempts[email] = attempts.filter((attempt) => now - attempt < 60000);

    // Vérification des tentatives après filtrage
    if (loginAttempts[email].length > 4) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Ajoute une nouvelle tentative
    loginAttempts[email].push(now);

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Génère le token JWT
    const token = sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET || "default-secret",
      {
        expiresIn: "1h", // Le token expire dans 1 heure
      }
    );

    // Définit le token dans les cookies (httpOnly)
    const response = NextResponse.json(
      { message: "Login successful", token }, // Ajoute le token dans la réponse JSON
      { status: 200 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true, // Empêche JavaScript d'accéder au cookie
      secure: process.env.NODE_ENV === "production", // Utilise le cookie sécurisé en production
      sameSite: "strict", // Protège contre les attaques CSRF
      path: "/", // Cookie accessible sur tout le site
      maxAge: 3600, // 1 heure
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
