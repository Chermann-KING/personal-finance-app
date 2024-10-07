import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Budget from "@/models/Budget";

// GET : Récupère un budget par catégorie avec les transactions associées
export async function GET(
  req: Request,
  { params }: { params: { category: string } }
) {
  try {
    await connectToDatabase();

    // Trouve le budget par catégorie et peuple les transactions associées
    const budget = await Budget.findOne({ category: params.category }).populate(
      "transactions"
    );

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch budget" },
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
    await connectToDatabase();

    const body = await req.json();
    const updatedBudget = await Budget.findOneAndUpdate(
      { category: params.category },
      body,
      { new: true }
    );

    if (!updatedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBudget);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update budget" },
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
    await connectToDatabase();

    const deletedBudget = await Budget.findOneAndDelete({
      category: params.category,
    });
    if (!deletedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(deletedBudget);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
