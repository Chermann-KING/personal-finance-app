import { Schema, model, models } from "mongoose";

const transactionSchema = new Schema({
  avatar: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  recurring: { type: Boolean, required: true },
});

transactionSchema.index({ category: 1 });
transactionSchema.index({ date: -1 });

const Transaction =
  models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
