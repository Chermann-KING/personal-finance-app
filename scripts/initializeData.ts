import * as dotenv from "dotenv";
import connectToDatabase from "../src/lib/db";
import User from "../src/models/User";
import Transaction from "../src/models/Transaction";
import Budget from "../src/models/Budget";
import { Pot } from "../src/models/Pot";
import transactionsData from "../src/data/transactions.json";
import financialData from "../src/data/financialData.json";
import { Types } from "mongoose";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

async function initializeData() {
  try {
    // Connexion à la base de données
    await connectToDatabase();
    console.log("Connexion à MongoDB réussie.");

    // Supprimer toutes les données existantes
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    await Pot.deleteMany({});
    console.log("Données existantes supprimées.");

    // Créer un utilisateur de test
    const testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      preferences: {
        currency: "USD",
        language: "en",
        notifications: {
          email: true,
          push: true,
        },
      },
    });
    console.log("Utilisateur de test créé.");

    // Insérer les transactions
    const transactionsWithUser = transactionsData.map((transaction) => ({
      ...transaction,
      userId: testUser._id,
      date: new Date(transaction.date),
    }));
    const insertedTransactions = await Transaction.insertMany(
      transactionsWithUser
    );
    console.log("Transactions insérées avec succès.");

    // Créer un map des transactions par catégorie
    const transactionsByCategory = insertedTransactions.reduce<
      Record<string, Types.ObjectId[]>
    >((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = [];
      }
      acc[transaction.category].push(transaction._id as Types.ObjectId);
      return acc;
    }, {});

    // Insérer les budgets avec leurs transactions associées
    const budgetsWithUserAndTransactions = financialData.budgets.map(
      (budget) => ({
        userId: testUser._id,
        category: budget.category,
        maximum: budget.maximum,
        theme: budget.theme,
        transactions: transactionsByCategory[budget.category] || [],
      })
    );
    await Budget.insertMany(budgetsWithUserAndTransactions);
    console.log("Budgets insérés avec succès.");

    // Insérer les pots d'épargne
    const potsWithUser = financialData.pots.map((pot) => ({
      ...pot,
      userId: testUser._id,
    }));
    await Pot.insertMany(potsWithUser);
    console.log("Pots d'épargne insérés avec succès.");

    // Calculer et afficher les statistiques
    const balance = await Transaction.calculateBalance(testUser._id);
    console.log("Balance calculée :", balance);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const categoryStats = await Transaction.getCategoryStats(
      testUser._id,
      startOfMonth,
      now
    );
    console.log("Statistiques par catégorie :", categoryStats);

    // Vérifier que tout a été inséré correctement
    const userCount = await User.countDocuments();
    const transactionCount = await Transaction.countDocuments();
    const budgetCount = await Budget.countDocuments();
    const potCount = await Pot.countDocuments();

    console.log("\nRésumé de l'initialisation :");
    console.log(`- Utilisateurs : ${userCount}`);
    console.log(`- Transactions : ${transactionCount}`);
    console.log(`- Budgets : ${budgetCount}`);
    console.log(`- Pots : ${potCount}`);
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données :", error);
  } finally {
    process.exit(0);
  }
}

initializeData();
