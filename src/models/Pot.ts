import mongoose, { Schema, Document } from "mongoose";

interface IPot extends Document {
  name: string;
  target: number;
  total: number;
  theme: string;
}

const potSchema = new Schema<IPot>({
  name: { type: String, required: true },
  target: { type: Number, required: true },
  total: { type: Number, required: true },
  theme: { type: String, required: true },
});

export const Pot = mongoose.model<IPot>("Pot", potSchema);
