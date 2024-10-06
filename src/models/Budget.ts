import { Schema, model, models } from "mongoose";

// Définition du schéma Budget
const budgetSchema = new Schema({
  category: { type: String, required: true, unique: true },
  maximum: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 },
  theme: { type: String, required: true },
});

// Middleware pour calculer `remaining` avant de sauvegarder un document
budgetSchema.pre("save", function (next) {
  this.remaining = this.maximum - this.spent;
  next();
});

const Budget = models.Budget || model("Budget", budgetSchema);

export default Budget;
