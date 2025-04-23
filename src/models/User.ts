import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// Définit le schéma utilisateur
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
    preferences: {
      currency: { type: String, default: "USD" },
      language: { type: String, default: "en" },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuels pour les relations
userSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("budgets", {
  ref: "Budget",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("pots", {
  ref: "Pot",
  localField: "_id",
  foreignField: "userId",
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Middleware pour hasher le mot de passe avant la sauvegarde
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Index pour optimiser les recherches
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Réutilise si le modèle existe déjà dans les modèles Mongoose
const User = models.User || model("User", userSchema);

export default User;
