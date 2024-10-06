import mongoose, { Schema, Document } from "mongoose";

interface IBalance extends Document {
  current: number;
  income: number;
  expenses: number;
}

const balanceSchema = new Schema<IBalance>({
  current: { type: Number, required: true },
  income: { type: Number, required: true },
  expenses: { type: Number, required: true },
});

export const Balance = mongoose.model<IBalance>("Balance", balanceSchema);
