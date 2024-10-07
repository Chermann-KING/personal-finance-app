import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Budget from "@/models/Budget";

// GET : Récupère tous les budgets et leurs transactions associées, puis calcule le montant "spent"
export async function GET() {
  try {
    await connectToDatabase();

    // Récupère les budgets et les transactions associées
    const budgets = await Budget.find({}).populate("transactions");

    // Calcul du spent et remaining pour chaque budget
    const budgetsWithTransactions = budgets.map((budget) => {
      const spent = budget.transactions.reduce(
        (total: number, transaction: { amount: number }) =>
          total + Math.abs(transaction.amount),
        0
      );
      const remaining = Math.max(0, budget.maximum - spent);

      return {
        ...budget._doc,
        spent,
        remaining,
        transactions: budget.transactions, // Inclut les transactions peuplées
      };
    });

    // Retourne uniquement les budgets (transactions sont déjà inclues dans chaque budget)
    return NextResponse.json({ budgets: budgetsWithTransactions });
  } catch (error) {
    console.error("Erreur lors de la récupération des budgets :", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
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

    // Si le champ `transactions` n'existe pas dans le corps de la requête, on l'ajoute avec un tableau vide
    if (!body.transactions) {
      body.transactions = [];
    }

    // Créez un nouveau budget avec ou sans transactions
    const newBudget = await Budget.create(body);
    console.log("Budget créé avec succès :", newBudget);

    // Vérifiez après la création si `transactions` est bien un tableau, sinon l'ajouter explicitement
    if (!newBudget.transactions) {
      await Budget.updateOne(
        { _id: newBudget._id },
        { $set: { transactions: [] } }
      );
    }

    return NextResponse.json({ budget: newBudget }, { status: 201 });
  } catch (error) {
    console.error("Échec de la création du budget :", error);

    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
