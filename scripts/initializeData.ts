import * as dotenv from "dotenv";
import connectToDatabase from "../src/lib/db";
import User from "../src/models/User";
import Transaction from "../src/models/Transaction";
import Budget from "../src/models/Budget";
import Pot from "../src/models/Pot";
import transactionsData from "../src/data/transactions.json";
import financialData from "../src/data/financialData.json";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

async function initializeData() {
  try {
    // Connexion à la base de données
    await connectToDatabase();
    console.log("Connexion à MongoDB réussie.");

    // Créer un utilisateur de test s'il n'existe pas
    let testUser = await User.findOne({ email: "test@example.com" });
    if (!testUser) {
      testUser = await User.create({
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
    }

    // Insérer les transactions
    const existingTransactions = await Transaction.find({
      userId: testUser._id,
    });
    if (existingTransactions.length === 0) {
      const transactionsWithUser = transactionsData.map((transaction) => ({
        ...transaction,
        userId: testUser._id,
      }));
      await Transaction.insertMany(transactionsWithUser);
      console.log("Transactions insérées avec succès.");
    }

    // Insérer les budgets
    const existingBudgets = await Budget.find({ userId: testUser._id });
    if (existingBudgets.length === 0) {
      const budgetsWithUser = financialData.budgets.map((budget) => ({
        ...budget,
        userId: testUser._id,
      }));
      await Budget.insertMany(budgetsWithUser);
      console.log("Budgets insérés avec succès.");
    }

    // Insérer les pots d'épargne
    const existingPots = await Pot.find({ userId: testUser._id });
    if (existingPots.length === 0) {
      const potsWithUser = financialData.pots.map((pot) => ({
        ...pot,
        userId: testUser._id,
      }));
      await Pot.insertMany(potsWithUser);
      console.log("Pots d'épargne insérés avec succès.");
    }

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
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données :", error);
  } finally {
    process.exit(0);
  }
}

initializeData();
