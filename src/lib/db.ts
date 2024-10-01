import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

/**
 * Fonction pour établir une connexion à la base de données MongoDB.
 *
 * Cette fonction se connecte à une instance MongoDB en utilisant l'URI stockée dans la variable d'environnement `MONGODB_URI`.
 * Si la connexion n'existe pas encore, elle en crée une nouvelle. Une fois connecté, la fonction retourne la référence à la base de données.
 *
 * @throws {Error} - Lance une erreur si l'URI MongoDB n'est pas définie dans le fichier `.env.local`.
 *
 * @returns {Promise<import("mongodb").Db>} - Retourne une instance de la base de données MongoDB.
 */
export async function connectToDatabase() {
  if (!client) {
    const uri = process.env.MONGODB_URI || "";

    // Vérifie que l'URI MongoDB est bien définie
    if (!uri) {
      throw new Error("Please add your MongoDB URI to .env.local");
    }

    client = new MongoClient(uri); // Crée un nouveau client MongoDB
    await client.connect(); // Connexion à la base de données
    console.log("Connexion réussie à MongoDB");
  }

  // Récupère la base de données spécifique "personal-finance"
  const db = client.db("personal-finance");
  return db;
}
