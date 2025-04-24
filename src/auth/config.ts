import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface JWTPayload {
  userId: string;
  email?: string;
}

// Type pour les paramètres de route
export interface RouteParams {
  params?: {
    [key: string]: string;
  };
}

// Type pour les handlers d'API protégés
export type ProtectedApiHandler<T> = (
  req: Request,
  auth: JWTPayload,
  context: { params: T }
) => Promise<NextResponse> | NextResponse;

interface AuthResult {
  success: boolean;
  error?: string;
  data?: JWTPayload;
}

// Vérifie si le token JWT est valide
export async function verifyAuth(): Promise<AuthResult> {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  if (!token) {
    return {
      success: false,
      error: "Unauthenticated",
    };
  }

  try {
    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET || "default-secret"
    ) as JWTPayload;

    return {
      success: true,
      data: decoded,
    };
  } catch (error) {
    return {
      success: false,
      error: "Invalid token",
    };
  }
}

// Middleware pour les routes API protégées
export function withAuth<T>(handler: ProtectedApiHandler<T>) {
  return async function (req: Request, context?: { params: T }) {
    const auth = await verifyAuth();

    if (!auth.success || !auth.data) {
      return NextResponse.json(
        { error: auth.error || "Unauthenticated" },
        { status: 401 }
      );
    }

    return handler(req, auth.data, { params: context?.params || ({} as T) });
  };
}
