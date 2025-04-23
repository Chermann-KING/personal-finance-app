import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/db";
import Budget from "@/models/Budget";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET : Récupère un budget par catégorie avec les transactions associées
export async function GET(
  req: Request,
  { params }: { params: { category: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();

    // Validation de la catégorie
    if (!params.category) {
      return NextResponse.json(
        { error: "Catégorie non spécifiée" },
        { status: 400 }
      );
    }

    // Trouve le budget par catégorie et peuple les transactions associées
    const budget = await Budget.findOne({
      category: params.category,
      userId: session.user.id,
    }).populate("transactions");

    if (!budget) {
      return NextResponse.json({ error: "Budget non trouvé" }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Erreur lors de la récupération du budget :", error);

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json(
          { error: "Erreur de base de données" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Échec de la récupération du budget" },
      { status: 500 }
    );
  }
}

// PUT : Met à jour un budget par catégorie
export async function PUT(
  req: Request,
  { params }: { params: { category: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();

    // Validation de la catégorie
    if (!params.category) {
      return NextResponse.json(
        { error: "Catégorie non spécifiée" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validation des données
    if (body.maximum !== undefined) {
      const maximum = parseFloat(body.maximum);
      if (isNaN(maximum) || maximum <= 0) {
        return NextResponse.json(
          { error: "Le maximum doit être un nombre positif" },
          { status: 400 }
        );
      }
      body.maximum = maximum;
    }

    // Vérifier si le budget existe
    const existingBudget = await Budget.findOne({
      category: params.category,
      userId: session.user.id,
    });

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget non trouvé" }, { status: 404 });
    }

    // Mettre à jour le budget
    const updatedBudget = await Budget.findOneAndUpdate(
      {
        category: params.category,
        userId: session.user.id,
      },
      body,
      { new: true }
    );

    return NextResponse.json({
      budget: updatedBudget,
      message: "Budget mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du budget :", error);

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { error: "Données de budget invalides", details: error.message },
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
      { error: "Échec de la mise à jour du budget" },
      { status: 500 }
    );
  }
}

// DELETE : Supprime un budget par catégorie
export async function DELETE(
  req: Request,
  { params }: { params: { category: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();

    // Validation de la catégorie
    if (!params.category) {
      return NextResponse.json(
        { error: "Catégorie non spécifiée" },
        { status: 400 }
      );
    }

    // Vérifier si le budget existe
    const existingBudget = await Budget.findOne({
      category: params.category,
      userId: session.user.id,
    });

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget non trouvé" }, { status: 404 });
    }

    const deletedBudget = await Budget.findOneAndDelete({
      category: params.category,
      userId: session.user.id,
    });

    return NextResponse.json({
      budget: deletedBudget,
      message: "Budget supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du budget :", error);

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json(
          { error: "Erreur de base de données" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Échec de la suppression du budget" },
      { status: 500 }
    );
  }
}
