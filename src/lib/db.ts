import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

export async function connectToDatabase() {
  if (!client) {
    const uri = process.env.MONGODB_URI || "";
    if (!uri) {
      throw new Error("Please add your MongoDB URI to .env.local");
    }

    client = new MongoClient(uri);
    await client.connect();
    console.log("Connexion réussie à MongoDB");
  }

  const db = client.db("personal-finance");
  return db;
}
