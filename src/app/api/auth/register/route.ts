import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  // Vérification des champs requis
  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "All fields (name, email, password) are required" },
      { status: 400 }
    );
  }

  // Normalise l'email
  const normalizedEmail = email.trim().toLowerCase();

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  // Validation du mot de passe
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters long" },
      { status: 400 }
    );
  }

  // Connexion à la base de données via Mongoose
  await connectToDatabase();

  try {
    // Vérifie si l'utilisateur existe déjà dans la collection
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 422 }
      );
    }

    // Hache le mot de passe
    const hashedPassword = await hash(password, 12);

    // Crée et enregistre le nouvel utilisateur
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await newUser.save(); // Enregistre le nouvel utilisateur dans la collection

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
