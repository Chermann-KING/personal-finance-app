import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Budget from "@/models/Budget";
import Transaction from "@/models/Transaction";

// GET : Récupère tous les budgets et calcule le montant "spent" pour chaque catégorie
export async function GET() {
  try {
    await connectToDatabase();

    // Récupère tous les budgets
    const budgets = await Budget.find({});

    // Pour chaque budget, calculer le montant `spent` en fonction des transactions associées
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const transactionsForCategory = await Transaction.find({
          _id: { $in: budget.transactions },
        });

        const spent = transactionsForCategory.reduce(
          (total, transaction) => total + Math.abs(transaction.amount),
          0
        );

        return {
          ...budget._doc, // `_doc` permet d'accéder aux données brutes du document MongoDB
          spent,
          remaining: budget.maximum - spent,
        };
      })
    );

    return NextResponse.json({
      budgets: budgetsWithSpent,
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
