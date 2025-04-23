import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/db";
import { Pot } from "@/models/Pot";
import { authOptions } from "../auth/config";

interface PotQuery {
  userId: string;
  name?: { $regex: string; $options: string };
}

// GET : Récupère tous les pots d'épargne
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let query: PotQuery = { userId: session.user.id };

    if (search) {
      query = {
        ...query,
        name: { $regex: search, $options: "i" },
      };
    }

    const pots = await Pot.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ pots });
  } catch (error) {
    console.error("Erreur lors de la récupération des pots :", error);

    if (error instanceof Error) {
      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json(
          { error: "Erreur de base de données" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Échec de la récupération des pots" },
      { status: 500 }
    );
  }
}

// POST : Crée un nouveau pot d'épargne
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();

    // Validation des données
    if (!body.name || !body.target) {
      return NextResponse.json(
        { error: "Nom et objectif sont requis" },
        { status: 400 }
      );
    }

    // Validation du montant
    const target = parseFloat(body.target);
    if (isNaN(target) || target <= 0) {
      return NextResponse.json(
        { error: "L'objectif doit être un nombre positif" },
        { status: 400 }
      );
    }

    // Vérifier si un pot avec le même nom existe déjà
    const existingPot = await Pot.findOne({
      name: body.name,
      userId: session.user.id,
    });

    if (existingPot) {
      return NextResponse.json(
        { error: "Un pot avec ce nom existe déjà" },
        { status: 409 }
      );
    }

    const newPot = await Pot.create({
      ...body,
      target,
      userId: session.user.id,
      total: 0,
    });

    return NextResponse.json(
      {
        pot: newPot,
        message: "Pot créé avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du pot :", error);

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { error: "Données de pot invalides", details: error.message },
          { status: 400 }
        );
      }

      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json(
          { error: "Erreur de base de données" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Échec de la création du pot" },
      { status: 500 }
    );
  }
}
