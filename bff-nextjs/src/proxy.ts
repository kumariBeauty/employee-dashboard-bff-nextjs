import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/server/config/env";

/**
 * CORS for the BFF's /api/* surface. The BFF is consumed by a separate React
 * app running on its own origin/port, so every response (including
 * preflight OPTIONS) needs these headers. Allowed origins come from
 * ALLOWED_ORIGINS in env — see .env.example.
 */
function resolveAllowedOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const { allowedOrigins } = getConfig();
  return allowedOrigins.includes(origin) ? origin : null;
}

function applyCorsHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const allowedOrigin = resolveAllowedOrigin(request);
  if (allowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    response.headers.set("Vary", "Origin");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

export function proxy(request: NextRequest): NextResponse {
  if (request.method === "OPTIONS") {
    return applyCorsHeaders(new NextResponse(null, { status: 204 }), request);
  }

  return applyCorsHeaders(NextResponse.next(), request);
}

export const config = {
  matcher: "/api/:path*",
};
