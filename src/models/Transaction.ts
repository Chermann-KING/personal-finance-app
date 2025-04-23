import { Schema, model, models, Types } from "mongoose";

const transactionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    avatar: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    recurring: { type: Boolean, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "completed",
    },
    recurringDetails: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
      },
      nextDate: { type: Date },
      endDate: { type: Date },
    },
    metadata: {
      location: String,
      tags: [String],
      receipt: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes pour les performances
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, status: 1 });
transactionSchema.index({ "recurringDetails.nextDate": 1 }, { sparse: true });

// Méthode statique pour calculer le solde d'un utilisateur
transactionSchema.statics.calculateBalance = async function (userId) {
  const result = await this.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        income: { $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] } },
        expenses: {
          $sum: { $cond: [{ $lt: ["$amount", 0] }, { $abs: "$amount" }, 0] },
        },
        total: { $sum: "$amount" },
      },
    },
  ]);
  return result[0] || { income: 0, expenses: 0, total: 0 };
};

// Méthode statique pour obtenir les statistiques par catégorie
transactionSchema.statics.getCategoryStats = async function (
  userId,
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);
};

const Transaction =
  models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
