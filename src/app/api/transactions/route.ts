import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Transaction from "@/models/Transaction";
import Budget from "@/models/Budget";
import { verifyAuth } from "@/auth/config";

interface TransactionQuery {
  userId: string;
  category?: string;
  name?: { $regex: string; $options: string };
}

export async function GET(req: Request) {
  try {
    // Vérifier l'authentification
    const auth = await verifyAuth();
    if (!auth.success || !auth.data) {
      return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "Latest";
    const category = searchParams.get("category") || "All Transactions";

    // Validation des paramètres
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      return NextResponse.json(
        { error: "Invalid page parameter" },
        { status: 400 }
      );
    }

    const limit = 10;
    const skip = (pageNum - 1) * limit;

    let query: TransactionQuery = { userId: auth.data.userId };

    // Filtrage par catégorie si une catégorie est spécifiée
    if (category !== "All Transactions") {
      query = { ...query, category };
    }

    // Recherche par nom
    if (search) {
      query = {
        ...query,
        name: { $regex: search, $options: "i" }, // Recherche insensible à la casse
      };
    }

    // Création du pipeline de tri
    let sortOption = {};
    switch (sort) {
      case "Latest":
        sortOption = { date: -1 };
        break;
      case "Oldest":
        sortOption = { date: 1 };
        break;
      case "A to Z":
        sortOption = { name: 1 };
        break;
      case "Z to A":
        sortOption = { name: -1 };
        break;
      case "Highest":
        sortOption = { amount: -1 };
        break;
      case "Lowest":
        sortOption = { amount: 1 };
        break;
      default:
        sortOption = { date: -1 };
    }

    // Récupère les transactions depuis MongoDB avec pagination, tri et recherche
    const transactions = await Transaction.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Compter le nombre total de transactions pour la pagination
    const totalTransactions = await Transaction.countDocuments(query);

    // Renvoi des transactions paginées et du total
    return NextResponse.json({ transactions, total: totalTransactions });
  } catch (error) {
    console.error("Error retrieving transactions :", error);

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: "Transaction recovery failure" },
      { status: 500 }
    );
  }
}

// POST : Crée une nouvelle transaction et met à jour le budget associé
export async function POST(req: Request) {
  try {
    // Vérifier l'authentification
    const auth = await verifyAuth();
    if (!auth.success || !auth.data) {
      return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();

    // Validation des données
    if (!body.name || !body.category || !body.amount || !body.date) {
      return NextResponse.json(
        {
          error: "Missing data. Name, category, amount and date are required.",
        },
        { status: 400 }
      );
    }

    // Validation du montant
    if (isNaN(body.amount)) {
      return NextResponse.json(
        { error: "The amount must be a valid number" },
        { status: 400 }
      );
    }

    // Validation de la date
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "The date must be a valid date" },
        { status: 400 }
      );
    }

    // Ajouter l'ID de l'utilisateur à la transaction
    const transactionData = {
      ...body,
      userId: auth.data.userId,
      date: date,
    };

    // Créer la nouvelle transaction
    const newTransaction = await Transaction.create(transactionData);

    // Récupérer le budget associé à la catégorie de la transaction
    const budget = await Budget.findOne({
      category: newTransaction.category,
      userId: auth.data.userId,
    });

    if (!budget) {
      // Si le budget n'existe pas, on le crée automatiquement
      const newBudget = await Budget.create({
        category: newTransaction.category,
        maximum: 1000, // Valeur par défaut
        theme: "default",
        userId: auth.data.userId,
        transactions: [newTransaction._id],
      });

      return NextResponse.json({
        transaction: newTransaction,
        budget: newBudget,
        message: "Transaction created and new budget initiated",
      });
    }

    // Ajouter la transaction au tableau `transactions` du budget
    budget.transactions.push(newTransaction._id);

    // Récupérer toutes les transactions associées au budget pour recalculer le montant `spent`
    const transactionsForCategory = await Transaction.find({
      _id: { $in: budget.transactions },
      userId: auth.data.userId,
    });

    // Calculer le montant total "spent" pour le budget
    budget.spent = transactionsForCategory.reduce(
      (total, transaction) => total + Math.abs(transaction.amount),
      0
    );

    // Mettre à jour le montant `remaining`
    budget.remaining = budget.maximum - budget.spent;

    // Sauvegarder les modifications dans le budget
    await budget.save();

    return NextResponse.json({
      transaction: newTransaction,
      budget,
      message: "Transaction created and budget updated",
    });
  } catch (error) {
    console.error(
      "Échec de la création de la transaction et de la mise à jour du budget:",
      error
    );

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { error: "Invalid transaction data", details: error.message },
          { status: 400 }
        );
      }

      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create transaction and update budget",
      },
      { status: 500 }
    );
  }
}
