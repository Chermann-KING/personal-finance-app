import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  // Vérification des champs requis
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
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

  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 422 });
  }

  const hashedPassword = await hash(password, 12);

  const newUser = await usersCollection.insertOne({
    name,
    email,
    password: hashedPassword,
  });

  if (newUser.insertedId) {
    console.log("Utilisateur créé avec succès :", newUser.insertedId);
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } else {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
