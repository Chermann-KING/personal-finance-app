import { Schema, model, models, Types, CallbackError } from "mongoose";

// Définition du schéma Budget
const budgetSchema = new Schema(
  {
    category: { type: String, required: true, unique: true },
    maximum: { type: Number, required: true },
    spent: { type: Number, default: 0 }, // sera calculé dynamiquement
    remaining: { type: Number, default: 0 }, // sera calculé dynamiquement
    theme: { type: String, required: true },
    transactions: [
      {
        type: Types.ObjectId,
        ref: "Transaction",
        default: [], // Par défaut, un tableau vide
      },
    ],
  },
  { minimize: false } // Force la sauvegarde des champs vides
);

// Middleware pour calculer `spent` et `remaining` avant de sauvegarder un document
budgetSchema.pre("save", async function (next) {
  // Utiliser `this` directement pour accéder au budget actuel
  const transactionModel = models.Transaction || model("Transaction");

  try {
    // Récupère toutes les transactions associées à ce budget
    const transactions = await transactionModel.find({
      _id: { $in: this.transactions },
    });

    // Calcule le total des dépenses (spent)
    this.spent = transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    // Calcule le restant (remaining)
    this.remaining = this.maximum - this.spent;

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const Budget = models.Budget || model("Budget", budgetSchema);

export default Budget;
