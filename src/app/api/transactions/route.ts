import { NextResponse } from "next/server";
import Transaction from "@/models/Transaction";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "Latest";
  const category = searchParams.get("category") || "All Transactions";

  const limit = 10;
  const skip = (Number(page) - 1) * limit;

  try {
    let query = {};

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
    console.error("Erreur lors de la récupération des transactions :", error);

    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
