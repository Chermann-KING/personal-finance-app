import mongoose from "mongoose";

/**
 * Fonction pour établir une connexion à la base de données MongoDB via Mongoose.
 *
 * Cette fonction se connecte à MongoDB en utilisant Mongoose et l'URI stockée dans la variable d'environnement `MONGODB_URI`.
 * Si la connexion n'existe pas encore, elle en crée une nouvelle. Une fois connecté, la fonction ne retourne rien,
 * mais Mongoose gère la connexion à la base de données pour tout le projet.
 *
 * @throws {Error} - Lance une erreur si l'URI MongoDB n'est pas définie dans le fichier `.env.local`.
 *
 * @returns {Promise<void>} - Retourne une promesse résolue lorsque la connexion est établie.
 */
const connectToDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      const uri = process.env.MONGODB_URI;

      // Vérifie que l'URI MongoDB est bien définie
      if (!uri) {
        throw new Error("Please add your MongoDB URI to .env.local");
      }

      // Connexion à MongoDB avec Mongoose sans options obsolètes
      await mongoose.connect(uri);
      console.log("Connexion réussie à MongoDB via Mongoose");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion à MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectToDatabase;
