import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/db";
import { Pot } from "@/models/Pot";
import { authOptions } from "../../auth/config";

// GET : Récupère un pot spécifique
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();

    const pot = await Pot.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!pot) {
      return NextResponse.json({ error: "Pot non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ pot });
  } catch (error) {
    console.error("Erreur lors de la récupération du pot :", error);

    if (error instanceof Error) {
      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json(
          { error: "Erreur de base de données" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Échec de la récupération du pot" },
      { status: 500 }
    );
  }
}

// PUT : Met à jour un pot
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();

    // Validation du montant si présent
    if (body.target !== undefined) {
      const target = parseFloat(body.target);
      if (isNaN(target) || target <= 0) {
        return NextResponse.json(
          { error: "L'objectif doit être un nombre positif" },
          { status: 400 }
        );
      }
      body.target = target;
    }

    // Vérifier si le pot existe
    const existingPot = await Pot.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!existingPot) {
      return NextResponse.json({ error: "Pot non trouvé" }, { status: 404 });
    }

    // Vérifier si le nouveau nom n'est pas déjà utilisé
    if (body.name && body.name !== existingPot.name) {
      const nameExists = await Pot.findOne({
        name: body.name,
        userId: session.user.id,
        _id: { $ne: params.id },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "Un pot avec ce nom existe déjà" },
          { status: 409 }
        );
      }
    }

    const updatedPot = await Pot.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.id,
      },
      body,
      { new: true }
    );

    return NextResponse.json({
      pot: updatedPot,
      message: "Pot mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du pot :", error);

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { error: "Données de pot invalides", details: error.message },
          { status: 400 }
        );
      }

      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json(
          { error: "Erreur de base de données" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Échec de la mise à jour du pot" },
      { status: 500 }
    );
  }
}

// DELETE : Supprime un pot
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();

    // Vérifier si le pot existe
    const existingPot = await Pot.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!existingPot) {
      return NextResponse.json({ error: "Pot non trouvé" }, { status: 404 });
    }

    await Pot.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    return NextResponse.json({
      message: "Pot supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du pot :", error);

    if (error instanceof Error) {
      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json(
          { error: "Erreur de base de données" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Échec de la suppression du pot" },
      { status: 500 }
    );
  }
}
