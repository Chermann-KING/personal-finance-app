import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/db";
import Budget from "@/models/Budget";
import { authOptions } from "../auth/[...nextauth]/route";

// GET : Récupère tous les budgets et leurs transactions associées, puis calcule le montant "spent"
export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();

    // Récupère les budgets et les transactions associées
    const budgets = await Budget.find({ userId: session.user.id }).populate(
      "transactions"
    );

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

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json(
          { error: "Erreur de base de données" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Échec de la récupération des budgets" },
      { status: 500 }
    );
  }
}

// POST : Crée un nouveau budget
export async function POST(req: Request) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();

    // Validation des données
    if (!body.category || !body.maximum || !body.theme) {
      return NextResponse.json(
        {
          error: "Données manquantes. Catégorie, maximum et thème sont requis.",
        },
        { status: 400 }
      );
    }

    // Validation du maximum
    const maximum = parseFloat(body.maximum);
    if (isNaN(maximum) || maximum <= 0) {
      return NextResponse.json(
        { error: "Le maximum doit être un nombre positif" },
        { status: 400 }
      );
    }

    // Vérifier si la catégorie existe déjà pour cet utilisateur
    const existingBudget = await Budget.findOne({
      category: body.category,
      userId: session.user.id,
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: "Un budget avec cette catégorie existe déjà" },
        { status: 409 }
      );
    }

    // Ajouter l'ID de l'utilisateur au budget
    const budgetData = {
      ...body,
      maximum,
      userId: session.user.id,
      transactions: body.transactions || [],
    };

    // Créez un nouveau budget avec ou sans transactions
    const newBudget = await Budget.create(budgetData);

    return NextResponse.json(
      {
        budget: newBudget,
        message: "Budget créé avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Échec de la création du budget :", error);

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { error: "Données de budget invalides", details: error.message },
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
      { error: "Échec de la création du budget" },
      { status: 500 }
    );
  }
}
