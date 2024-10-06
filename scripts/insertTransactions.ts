import mongoose from "mongoose";
import connectToDatabase from "../src/lib/db";
import Transaction from "../src/models/Transaction";
import transactionsData from "../src/data/transactions.json";

// Fonction principale pour insérer les transactions
async function insertTransactions() {
  try {
    await connectToDatabase();
    console.log("Connexion à MongoDB réussie.");

    // Insère les transactions si la collection est vide
    const existingTransactions = await Transaction.find({});
    if (existingTransactions.length === 0) {
      await Transaction.insertMany(transactionsData);
      console.log("Transactions insérées avec succès.");
    } else {
      console.log("Transactions déjà présentes dans la base de données.");
    }
  } catch (error) {
    console.error("Erreur lors de l'insertion des transactions :", error);
  } finally {
    mongoose.connection.close();
  }
}

insertTransactions();
