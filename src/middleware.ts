import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware qui vérifie si l'utilisateur a un token JWT dans les cookies
export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken");

  // Si l'utilisateur essaie d'accéder à /auth/login mais qu'il est déjà connecté, le rediriger vers /dashboard/overview
  if (req.nextUrl.pathname === "/auth/login" && token) {
    return NextResponse.redirect(new URL("/dashboard/overview", req.url));
  }

  // Si l'utilisateur essaie d'accéder à une page du dashboard sans token, rediriger vers /auth/login
  // if (req.nextUrl.pathname.startsWith("/dashboard") && !token) {
  //   return NextResponse.redirect(new URL("/auth/login", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
};
