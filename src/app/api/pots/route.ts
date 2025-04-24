import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Pot } from "@/models/Pot";
import { verifyAuth } from "@/auth/config";

interface PotQuery {
  userId: string;
  name?: { $regex: string; $options: string };
}

// GET : Récupère tous les pots d'épargne
export async function GET(req: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth.success || !auth.data) {
      return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let query: PotQuery = { userId: auth.data.userId };

    if (search) {
      query = {
        ...query,
        name: { $regex: search, $options: "i" },
      };
    }

    const pots = await Pot.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ pots });
  } catch (error) {
    console.error("Error when retrieving pots:", error);

    if (error instanceof Error) {
      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: "Failure to recover pots" },
      { status: 500 }
    );
  }
}

// POST : Crée un nouveau pot d'épargne
export async function POST(req: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth.success || !auth.data) {
      return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();

    // Validation des données
    if (!body.name || !body.target) {
      return NextResponse.json(
        { error: "Name and purpose are required" },
        { status: 400 }
      );
    }

    // Validation du montant
    const target = parseFloat(body.target);
    if (isNaN(target) || target <= 0) {
      return NextResponse.json(
        { error: "The target must be a positive number" },
        { status: 400 }
      );
    }

    // Vérifier si un pot avec le même nom existe déjà
    const existingPot = await Pot.findOne({
      name: body.name,
      userId: auth.data.userId,
    });

    if (existingPot) {
      return NextResponse.json(
        { error: "A jar with this name already exists" },
        { status: 409 }
      );
    }

    const newPot = await Pot.create({
      ...body,
      target,
      userId: auth.data.userId,
      total: 0,
    });

    return NextResponse.json(
      {
        pot: newPot,
        message: "Pot successfully created",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error when creating the pot :", error);

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { error: "Invalid pot data", details: error.message },
          { status: 400 }
        );
      }

      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: "Failure to create the pot" },
      { status: 500 }
    );
  }
}
