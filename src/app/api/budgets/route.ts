import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Budget from "@/models/Budget";
import { withAuth, type JWTPayload } from "@/auth/config";

// GET : Récupère tous les budgets et leurs transactions associées, puis calcule le montant "spent"
export const GET = withAuth(async (req: Request, auth: JWTPayload) => {
  try {
    await connectToDatabase();

    // Récupère les budgets et les transactions associées
    const budgets = await Budget.find({ userId: auth.userId }).populate(
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
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: "Failure to recover budgets" },
      { status: 500 }
    );
  }
});

// POST : Crée un nouveau budget
export const POST = withAuth(async (req: Request, auth: JWTPayload) => {
  try {
    await connectToDatabase();

    const body = await req.json();

    // Validation des données
    if (!body.category || !body.maximum || !body.theme) {
      return NextResponse.json(
        {
          error: "Missing data. Category, maximum, and theme are required.",
        },
        { status: 400 }
      );
    }

    // Validation du maximum
    const maximum = parseFloat(body.maximum);
    if (isNaN(maximum) || maximum <= 0) {
      return NextResponse.json(
        { error: "The maximum must be a positive number" },
        { status: 400 }
      );
    }

    // Vérifier si la catégorie existe déjà pour cet utilisateur
    const existingBudget = await Budget.findOne({
      category: body.category,
      userId: auth.userId,
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: "A budget with this category already exists" },
        { status: 409 }
      );
    }

    // Ajouter l'ID de l'utilisateur au budget
    const budgetData = {
      ...body,
      maximum,
      userId: auth.userId,
      transactions: body.transactions || [],
    };

    // Créez un nouveau budget avec ou sans transactions
    const newBudget = await Budget.create(budgetData);

    return NextResponse.json(
      {
        budget: newBudget,
        message: "Budget successfully created",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Échec de la création du budget :", error);

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { error: "Invalid budget data", details: error.message },
          { status: 400 }
        );
      }

      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: "Failure to create the budget" },
      { status: 500 }
    );
  }
});
