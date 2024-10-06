import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Budget from "@/models/Budget";
import Transaction from "@/models/Transaction";

// GET : Récupère tous les budgets et leurs transactions associées
export async function GET() {
  try {
    await connectToDatabase();

    const budgets = await Budget.find({});
    const transactions = await Transaction.find({});

    return NextResponse.json({
      budgets,
      transactions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch budgets and transactions" },
      { status: 500 }
    );
  }
}

// POST : Crée un nouveau budget
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    console.log("Connexion à MongoDB réussie.");

    const body = await req.json();
    console.log("Données reçues dans la requête POST :", body);

    const newBudget = await Budget.create(body);
    console.log("Budget créé avec succès :", newBudget);

    return NextResponse.json({ budget: newBudget }, { status: 201 });
  } catch (error) {
    console.error("Échec de la création du budget :", error);

    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
