import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name, email, password } = await request.json();

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      name,
      email,
      password,
      preferences: {
        currency: "EUR",
        language: "fr",
        notifications: {
          email: true,
          push: true,
        },
      },
    });

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" }
    );

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
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
