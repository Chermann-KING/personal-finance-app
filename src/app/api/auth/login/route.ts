import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";

import User from "@/models/User"; // Modèle Mongoose pour User
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" }
    );

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}
