import { Schema, model, models } from "mongoose";

// Définit le schéma utilisateur
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Réutilise si le modèle existe déjà dans les modèles Mongoose
const User = models.User || model("User", userSchema);

export default User;
