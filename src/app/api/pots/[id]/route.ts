import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Pot } from "@/models/Pot";
import { verifyAuth } from "@/auth/config";

// GET : Récupère un pot spécifique
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth();
    if (!auth.success || !auth.data) {
      return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    await connectToDatabase();

    const pot = await Pot.findOne({
      _id: params.id,
      userId: auth.data.userId,
    });

    if (!pot) {
      return NextResponse.json({ error: "Pot not found" }, { status: 404 });
    }

    return NextResponse.json({ pot });
  } catch (error) {
    console.error("Pot recovery error:", error);

    if (error instanceof Error) {
      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: "Pot recovery failure" },
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
    const auth = await verifyAuth();
    if (!auth.success || !auth.data) {
      return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();

    // Validation du montant si présent
    if (body.target !== undefined) {
      const target = parseFloat(body.target);
      if (isNaN(target) || target <= 0) {
        return NextResponse.json(
          { error: "The target must be a positive number" },
          { status: 400 }
        );
      }
      body.target = target;
    }

    // Vérifier si le pot existe
    const existingPot = await Pot.findOne({
      _id: params.id,
      userId: auth.data.userId,
    });

    if (!existingPot) {
      return NextResponse.json({ error: "Pot not found" }, { status: 404 });
    }

    // Vérifier si le nouveau nom n'est pas déjà utilisé
    if (body.name && body.name !== existingPot.name) {
      const nameExists = await Pot.findOne({
        name: body.name,
        userId: auth.data.userId,
        _id: { $ne: params.id },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "A pot with this name already exists" },
          { status: 409 }
        );
      }
    }

    const updatedPot = await Pot.findOneAndUpdate(
      {
        _id: params.id,
        userId: auth.data.userId,
      },
      body,
      { new: true }
    );

    return NextResponse.json({
      pot: updatedPot,
      message: "Pot successfully updated",
    });
  } catch (error) {
    console.error("Error updating the pot :", error);

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { error: "Invalid pot data", details: error.message },
          { status: 400 }
        );
      }

      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Pot update failure" }, { status: 500 });
  }
}

// DELETE : Supprime un pot
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth();
    if (!auth.success || !auth.data) {
      return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    await connectToDatabase();

    // Vérifier si le pot existe
    const existingPot = await Pot.findOne({
      _id: params.id,
      userId: auth.data.userId,
    });

    if (!existingPot) {
      return NextResponse.json({ error: "Pot not found" }, { status: 404 });
    }

    await Pot.findOneAndDelete({
      _id: params.id,
      userId: auth.data.userId,
    });

    return NextResponse.json({
      message: "Pot successfully removed",
    });
  } catch (error) {
    console.error("Error when deleting the pot :", error);

    if (error instanceof Error) {
      if (error.name === "MongoError" || error.name === "MongoServerError") {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: "Unsuccessful pot removal" },
      { status: 500 }
    );
  }
}
