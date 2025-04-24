import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Budget from "@/models/Budget";
import { withAuth, type JWTPayload } from "@/auth/config";

// GET : Récupère un budget spécifique par catégorie
export const GET = withAuth<{ category: string }>(
  async (
    req: Request,
    auth: JWTPayload,
    { params }: { params: { category: string } }
  ) => {
    try {
      await connectToDatabase();

      const budget = await Budget.findOne({
        category: params.category,
        userId: auth.userId,
      }).populate("transactions");

      if (!budget) {
        return NextResponse.json(
          { error: "Budget not found" },
          { status: 404 }
        );
      }

      // Calcul du spent et remaining
      const spent = budget.transactions.reduce(
        (total: number, transaction: { amount: number }) =>
          total + Math.abs(transaction.amount),
        0
      );
      const remaining = Math.max(0, budget.maximum - spent);

      return NextResponse.json({
        budget: {
          ...budget._doc,
          spent,
          remaining,
          transactions: budget.transactions,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du budget :", error);
      return NextResponse.json(
        { error: "Budget recovery failed" },
        { status: 500 }
      );
    }
  }
);

// PUT : Met à jour un budget spécifique
export const PUT = withAuth(
  async (
    req: Request,
    auth: JWTPayload,
    { params }: { params: { category: string } }
  ) => {
    try {
      await connectToDatabase();

      const body = await req.json();

      // Validation du maximum si fourni
      if (body.maximum) {
        const maximum = parseFloat(body.maximum);
        if (isNaN(maximum) || maximum <= 0) {
          return NextResponse.json(
            { error: "The maximum must be a positive number" },
            { status: 400 }
          );
        }
        body.maximum = maximum;
      }

      const updatedBudget = await Budget.findOneAndUpdate(
        { category: params.category, userId: auth.userId },
        { $set: body },
        { new: true }
      ).populate("transactions");

      if (!updatedBudget) {
        return NextResponse.json(
          { error: "Budget not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        budget: updatedBudget,
        message: "Budget successfully updated",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du budget :", error);
      return NextResponse.json(
        { error: "Budget update failed" },
        { status: 500 }
      );
    }
  }
);

// DELETE : Supprime un budget spécifique
export const DELETE = withAuth(
  async (
    req: Request,
    auth: JWTPayload,
    { params }: { params: { category: string } }
  ) => {
    try {
      await connectToDatabase();

      const deletedBudget = await Budget.findOneAndDelete({
        category: params.category,
        userId: auth.userId,
      });

      if (!deletedBudget) {
        return NextResponse.json(
          { error: "Budget not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Budget successfully deleted",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du budget :", error);
      return NextResponse.json(
        { error: "Budget abolition failed" },
        { status: 500 }
      );
    }
  }
);
